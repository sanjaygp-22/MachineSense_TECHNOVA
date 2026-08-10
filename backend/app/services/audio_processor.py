import io
import time
import numpy as np
import scipy.signal
import librosa
import librosa.display
import soundfile as sf
import matplotlib
matplotlib.use('Agg')  # Non-interactive background backend
import matplotlib.pyplot as plt
from pathlib import Path
from typing import Dict, Any, Tuple, Union


def generate_spectrogram_png(S_dB: np.ndarray, sr: int) -> bytes:
    """Generates a high-quality Mel Spectrogram PNG image in memory from pre-computed dB spectrogram."""
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


def process_audio_signal(
    audio_input: Union[str, Tuple[np.ndarray, int]],
    target_sr: int = 16000
) -> Tuple[Dict[str, Any], bytes, Dict[str, float]]:
    """
    Processes audio signal through MachineSense acoustic analysis pipeline.
    Accepts either file_path string OR pre-loaded (y_norm, sr) tuple.
    Returns (analysis_dict, spectrogram_png_bytes, timing_breakdown_ms).
    """
    timings = {}

    # Stage 1: Audio Loading & Resampling
    t0 = time.perf_counter()
    if isinstance(audio_input, str):
        path_obj = Path(audio_input)
        if not path_obj.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_input}")
        try:
            y, orig_sr = sf.read(str(path_obj), dtype='float32')
            if y.ndim > 1:
                y = np.mean(y, axis=1)
            if orig_sr != target_sr:
                t_res_start = time.perf_counter()
                y = librosa.resample(y, orig_sr=orig_sr, target_sr=target_sr)
                sr = target_sr
                timings["resampling_ms"] = round((time.perf_counter() - t_res_start) * 1000, 2)
            else:
                sr = orig_sr
                timings["resampling_ms"] = 0.0
        except Exception:
            y, sr = librosa.load(audio_input, sr=target_sr, mono=True)
            timings["resampling_ms"] = 0.0
    else:
        y, sr = audio_input
        timings["resampling_ms"] = 0.0

    if len(y) == 0:
        raise ValueError("Audio file is empty or contains no playable sound data.")

    t1 = time.perf_counter()
    timings["audio_loading_ms"] = round((t1 - t0) * 1000, 2)

    # Stage 2: Noise Filtering & Peak Normalization
    t_nf_start = time.perf_counter()
    peak_val = np.max(np.abs(y))
    if peak_val > 0:
        y_norm = (y / peak_val).astype(np.float32)
    else:
        y_norm = y.astype(np.float32)

    duration = float(len(y_norm) / sr)
    number_of_samples = int(len(y_norm))
    rms = float(np.sqrt(np.mean(y_norm ** 2)))
    peak_amplitude = float(np.max(np.abs(y_norm)))
    crest_factor = float(peak_amplitude / (rms + 1e-9))

    if rms > 0.05 and 1.2 <= crest_factor <= 15.0:
        signal_quality = "good"
    elif rms > 0.01:
        signal_quality = "moderate"
    else:
        signal_quality = "poor"

    t_nf_end = time.perf_counter()
    timings["noise_filtering_and_norm_ms"] = round((t_nf_end - t_nf_start) * 1000, 2)

    # Stage 3: Feature Extraction (Waveform, Spectrum, Spectral Features, MFCCs)
    t_feat_start = time.perf_counter()

    # Downsampled Waveform (500 points for frontend charting)
    num_waveform_points = min(500, len(y_norm))
    step_w = max(1, len(y_norm) // num_waveform_points)
    waveform_samples = [float(round(val, 4)) for val in y_norm[::step_w][:num_waveform_points]]

    # Single-Pass STFT Computation
    n_fft = 2048
    hop_length = 512
    S_stft = np.abs(librosa.stft(y_norm, n_fft=n_fft, hop_length=hop_length))

    # FFT & Downsampled Spectrum
    fft_vals = np.abs(np.fft.rfft(y_norm))
    fft_freqs = np.fft.rfftfreq(len(y_norm), 1.0 / sr)

    if len(fft_vals) > 1:
        max_idx = np.argmax(fft_vals[1:]) + 1
        dominant_freq = float(fft_freqs[max_idx])
    else:
        dominant_freq = 0.0

    peaks, _ = scipy.signal.find_peaks(fft_vals, distance=max(1, int(sr / 500)))
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

    # Spectral Features using pre-computed S_stft
    spec_centroid = float(np.mean(librosa.feature.spectral_centroid(S=S_stft, sr=sr)))
    spec_bandwidth = float(np.mean(librosa.feature.spectral_bandwidth(S=S_stft, sr=sr)))
    spec_rolloff = float(np.mean(librosa.feature.spectral_rolloff(S=S_stft, sr=sr)))
    spec_flatness = float(np.mean(librosa.feature.spectral_flatness(S=S_stft)))
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=y_norm)))

    # Mel Spectrogram & MFCCs from S_stft
    S_power = S_stft ** 2
    S_mel = librosa.feature.melspectrogram(S=S_power, sr=sr, n_fft=n_fft, hop_length=hop_length, n_mels=128)
    S_mel_db = librosa.power_to_db(S_mel + 1e-9)
    n_mels, n_frames = S_mel.shape

    mfccs = librosa.feature.mfcc(S=S_mel_db, sr=sr, n_mfcc=13)
    mfcc_mean = [float(round(val, 4)) for val in mfccs.mean(axis=1)]
    mfcc_std = [float(round(val, 4)) for val in mfccs.std(axis=1)]

    # Fast Spectrogram PNG from S_mel_db
    spectrogram_png = generate_spectrogram_png(S_mel_db, sr)

    t_feat_end = time.perf_counter()
    timings["feature_extraction_ms"] = round((t_feat_end - t_feat_start) * 1000, 2)

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
        }
    }

    return result_dict, spectrogram_png, timings


def process_audio_file(file_path: str, target_sr: int = 16000) -> Tuple[Dict[str, Any], bytes]:
    """Legacy backward-compatible wrapper returning (analysis_dict, spectrogram_png)."""
    analysis_dict, spectrogram_png, _ = process_audio_signal(file_path, target_sr=target_sr)
    return analysis_dict, spectrogram_png
