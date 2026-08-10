import numpy as np
import scipy.signal
import librosa
from typing import Dict, Any


def extract_acoustic_features(y: np.ndarray, sr: int) -> Dict[str, Any]:
    """
    Extracts 33 acoustic numerical features from preprocessed audio signal array y:
    - 13 MFCC means (mfcc_1_mean ... mfcc_13_mean)
    - 13 MFCC stds (mfcc_1_std ... mfcc_13_std)
    - RMS energy (rms)
    - Spectral Centroid (spectral_centroid_hz)
    - Spectral Bandwidth (spectral_bandwidth_hz)
    - Spectral Rolloff (spectral_rolloff_hz)
    - Spectral Flatness (spectral_flatness)
    - Zero Crossing Rate (zero_crossing_rate)
    - Dominant Frequency (dominant_frequency_hz)
    """
    if len(y) == 0:
        raise ValueError("Cannot extract features from an empty audio signal.")

    # 1. RMS Energy
    rms_val = float(np.sqrt(np.mean(y ** 2)))

    # 2. Dominant Frequency via SciPy/NumPy FFT
    fft_vals = np.abs(np.fft.rfft(y))
    fft_freqs = np.fft.rfftfreq(len(y), 1.0 / sr)

    if len(fft_vals) > 1:
        max_idx = np.argmax(fft_vals[1:]) + 1
        dominant_freq = float(fft_freqs[max_idx])
    else:
        dominant_freq = 0.0

    # 3. Librosa Spectral Features
    centroid = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
    bandwidth = float(np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr)))
    rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)))
    flatness = float(np.mean(librosa.feature.spectral_flatness(y=y)))
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=y)))

    # 4. 13 MFCC Coefficients (mean & std per coefficient)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

    features: Dict[str, Any] = {
        "rms": round(rms_val, 6),
        "spectral_centroid_hz": round(centroid, 2),
        "spectral_bandwidth_hz": round(bandwidth, 2),
        "spectral_rolloff_hz": round(rolloff, 2),
        "spectral_flatness": round(flatness, 6),
        "zero_crossing_rate": round(zcr, 6),
        "dominant_frequency_hz": round(dominant_freq, 2),
    }

    # Add 13 MFCC means
    for i in range(13):
        coeff_mean = float(np.mean(mfccs[i, :]))
        features[f"mfcc_{i+1}_mean"] = round(coeff_mean, 6)

    # Add 13 MFCC stds
    for i in range(13):
        coeff_std = float(np.std(mfccs[i, :]))
        features[f"mfcc_{i+1}_std"] = round(coeff_std, 6)

    return features
