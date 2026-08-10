import numpy as np
import librosa
from pathlib import Path
from typing import Tuple
from ml.config import TARGET_SR, MONO


def load_and_preprocess_audio(
    file_path: str,
    target_sr: int = TARGET_SR,
    mono: bool = MONO
) -> Tuple[np.ndarray, int]:
    """
    Loads an audio file from disk, converts to mono, resamples to target_sr (default 16,000 Hz),
    normalizes amplitude to [-1.0, 1.0], and validates signal sanity.
    Does NOT modify the original file on disk.
    """
    path_obj = Path(file_path)
    if not path_obj.exists():
        raise FileNotFoundError(f"Audio file not found: {file_path}")

    try:
        y, sr = librosa.load(str(path_obj), sr=target_sr, mono=mono)
    except Exception as e:
        raise ValueError(f"Failed to load or decode audio file '{file_path}': {str(e)}")

    if len(y) == 0:
        raise ValueError(f"Loaded audio signal from '{file_path}' is empty.")

    # Amplitude Normalization
    max_peak = np.max(np.abs(y))
    if max_peak > 0:
        y_norm = y / max_peak
    else:
        y_norm = y

    return y_norm, sr
