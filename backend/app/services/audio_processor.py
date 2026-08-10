import io
import numpy as np
import scipy.signal
import librosa
import librosa.display
import matplotlib
matplotlib.use('Agg')  # Non-interactive background backend
import matplotlib.pyplot as plt
from pathlib import Path
from typing import Dict, Any, Tuple


def generate_spectrogram_png(y: np.ndarray, sr: int) -> bytes:
    """Generates a high-quality Mel Spectrogram PNG image in memory."""
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=sr // 2)
    S_dB = librosa.power_to_db(S, ref=np.max)

    fig, ax = plt.subplots(figsize=(8, 4), dpi=100)
    fig.patch.set_facecolor('#0d1516')
    ax.set_facecolor('#0d1516')

    img = librosa.display.specshow(
        S_dB,
        sr=sr,
        x_axis='time',
        y_axis='mel',
        fmax=sr // 2,
        ax=ax,
        cmap='magma'
    )

    cbar = fig.colorbar(img, ax=ax, format='%+2.0f dB')
    cbar.ax.yaxis.set_tick_params(color='#849396')
    plt.setp(plt.getp(cbar.ax.axes, 'yticklabels'), color='#849396')
    cbar.outline.set_edgecolor('#3b494c')

    ax.set_title('Mel Spectrogram (Power dB)', color='#c3f5ff', fontsize=12, fontweight='bold', pad=10)
    ax.set_xlabel('Time (s)', color='#bac9cc', fontsize=10)
    ax.set_ylabel('Frequency (Hz)', color='#bac9cc', fontsize=10)

    ax.tick_params(colors='#849396', which='both')
    for spine in ax.spines.values():
        spine.set_color('#3b494c')

    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()


def process_audio_file(file_path: str, target_sr: int = 16000) -> Tuple[Dict[str, Any], bytes]:
    """
    Processes an uploaded audio file through the MachineSense acoustic analysis pipeline:
    Returns (analysis_dict, spectrogram_png_bytes).
    """
    path_obj = Path(file_path)
    if not path_obj.exists():
        raise FileNotFoundError(f"Audio file not found: {file_path}")

    # 1. Load audio, convert to mono, resample
    try:
        y, sr = librosa.load(file_path, sr=target_sr, mono=True)
    except Exception as e:
        raise ValueError(f"Unable to decode audio file: {str(e)}")

    if len(y) == 0:
        raise ValueError("Audio file is empty or contains no playable sound data.")

    # 2. Amplitude Normalization
    peak_val = np.max(np.abs(y))
    if peak_val > 0:
        y_norm = y / peak_val
    else:
        y_norm = y

    # 3. Audio Information
    duration = float(len(y) / sr)
    number_of_samples = int(len(y))
    rms = float(np.sqrt(np.mean(y_norm ** 2)))
    peak_amplitude = float(np.max(np.abs(y_norm)))

    # Crest factor & Signal Quality
    crest_factor = float(peak_amplitude / (rms + 1e-9))
    if rms > 0.05 and 1.2 <= crest_factor <= 15.0:
        signal_quality = "good"
    elif rms > 0.01:
        signal_quality = "moderate"
    else:
        signal_quality = "poor"

    # 4. Downsampled Waveform (500 points for frontend charting)
    num_waveform_points = min(500, len(y_norm))
    step_w = max(1, len(y_norm) // num_waveform_points)
    waveform_samples = [float(round(val, 4)) for val in y_norm[::step_w][:num_waveform_points]]

    # 5. SciPy / NumPy FFT & Downsampled Spectrum
    fft_vals = np.abs(np.fft.rfft(y_norm))
    fft_freqs = np.fft.rfftfreq(len(y_norm), 1.0 / sr)

    # Dominant frequency
    if len(fft_vals) > 1:
        max_idx = np.argmax(fft_vals[1:]) + 1
        dominant_freq = float(fft_freqs[max_idx])
    else:
        dominant_freq = 0.0

    # Top frequency peaks finding
    peaks, _ = scipy.signal.find_peaks(fft_vals, distance=int(sr / 500))
    if len(peaks) > 0:
        sorted_peaks = sorted(peaks, key=lambda i: fft_vals[i], reverse=True)[:5]
        max_mag = np.max(fft_vals) if np.max(fft_vals) > 0 else 1.0
        top_peaks = [
            {
                "frequency_hz": float(round(fft_freqs[p], 2)),
                "magnitude": float(round(fft_vals[p] / max_mag, 4))
            }
            for p in sorted_peaks
        ]
    else:
        top_peaks = []

    # Downsample spectrum to ~400 points while preserving local peak magnitudes
    max_freq = sr / 2
    valid_mask = (fft_freqs >= 0) & (fft_freqs <= max_freq)
    valid_freqs = fft_freqs[valid_mask]
    valid_mags = fft_vals[valid_mask]
    max_mag_all = np.max(valid_mags) if np.max(valid_mags) > 0 else 1.0
    valid_mags_norm = valid_mags / max_mag_all

    target_spectrum_points = 400
    chunk_size = max(1, len(valid_freqs) // target_spectrum_points)
    spectrum_freqs = []
    spectrum_mags = []

    for i in range(0, len(valid_freqs), chunk_size):
        chunk_f = valid_freqs[i:i + chunk_size]
        chunk_m = valid_mags_norm[i:i + chunk_size]
        if len(chunk_m) == 0:
            continue
        max_local_idx = np.argmax(chunk_m)
        spectrum_freqs.append(float(round(chunk_f[max_local_idx], 1)))
        spectrum_mags.append(float(round(chunk_m[max_local_idx], 4)))

    # 6. Librosa Spectral Features
    spec_centroid = float(np.mean(librosa.feature.spectral_centroid(y=y_norm, sr=sr)))
    spec_bandwidth = float(np.mean(librosa.feature.spectral_bandwidth(y=y_norm, sr=sr)))
    spec_rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=y_norm, sr=sr)))
    spec_flatness = float(np.mean(librosa.feature.spectral_flatness(y=y_norm)))
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=y_norm)))

    # 7. Mel Spectrogram Metadata
    S = librosa.feature.melspectrogram(y=y_norm, sr=sr, n_mels=128)
    n_mels, n_frames = S.shape

    # 8. MFCC Calculation (13 coefficients)
    mfccs = librosa.feature.mfcc(y=y_norm, sr=sr, n_mfcc=13)
    mfcc_mean = [float(round(val, 4)) for val in mfccs.mean(axis=1)]
    mfcc_std = [float(round(val, 4)) for val in mfccs.std(axis=1)]

    # 9. Generate Spectrogram PNG Image
    spectrogram_png = generate_spectrogram_png(y_norm, sr)

    result_dict = {
        "audio": {
            "duration": round(duration, 2),
            "sample_rate": sr,
            "channels": 1,
            "number_of_samples": number_of_samples
        },
        "signal": {
            "rms": round(rms, 4),
            "peak_amplitude": round(peak_amplitude, 4),
            "crest_factor": round(crest_factor, 2),
            "signal_quality": signal_quality
        },
        "waveform": {
            "sample_rate": sr,
            "samples": waveform_samples
        },
        "frequency": {
            "dominant_frequency_hz": round(dominant_freq, 2),
            "top_peaks": top_peaks,
            "spectrum": {
                "frequencies_hz": spectrum_freqs,
                "magnitudes": spectrum_mags
            }
        },
        "spectral_features": {
            "centroid_hz": round(spec_centroid, 2),
            "bandwidth_hz": round(spec_bandwidth, 2),
            "rolloff_hz": round(spec_rolloff, 2),
            "flatness": round(spec_flatness, 4),
            "zero_crossing_rate": round(zcr, 4)
        },
        "mel_spectrogram": {
            "n_mels": n_mels,
            "frames": n_frames
        },
        "mfcc": {
            "n_mfcc": 13,
            "frames": mfccs.shape[1],
            "mean": mfcc_mean,
            "std": mfcc_std
        },
        "ml": {
            "status": "not_available",
            "message": "Machine-learning model will be added after dataset preparation and training."
        }
    }

    return result_dict, spectrogram_png
