import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response, status
from app.config import ALLOWED_EXTENSIONS, MAX_UPLOAD_SIZE_BYTES, UPLOAD_DIR
from app.services.audio_processor import process_audio_file
from app.services.analysis_store import store_analysis, get_spectrogram_png
from app.services.ml_service import get_ml_service
from ml.preprocessing import load_and_preprocess_audio

router = APIRouter()

@router.post("/analyze")
async def analyze_audio(
    audio: UploadFile = File(...),
    machine_id: str = Form("MTR-001")
):
    if not audio or not audio.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No audio file uploaded."
        )

    # Extension check
    file_ext = Path(audio.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file_ext}'. Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    # Save to temp file & check size
    unique_filename = f"{uuid.uuid4().hex}_{Path(audio.filename).name}"
    temp_file_path = UPLOAD_DIR / unique_filename

    try:
        file_bytes = await audio.read()
        if len(file_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

        if len(file_bytes) > MAX_UPLOAD_SIZE_BYTES:
            size_mb = len(file_bytes) / (1024 * 1024)
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size ({size_mb:.1f} MB) exceeds maximum upload limit of 50 MB."
            )

        with open(temp_file_path, "wb") as f:
            f.write(file_bytes)

        # Check ML model status
        ml_service = get_ml_service()
        if not ml_service.is_loaded():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"ML Model is unavailable: {ml_service.load_error or 'Model pipeline failed to load'}"
            )

        # Generate unique analysis ID
        analysis_id = uuid.uuid4().hex

        # Run acoustic signal processing & spectrogram PNG generation
        analysis_result, spectrogram_png = process_audio_file(str(temp_file_path))

        # Run ML model prediction
        y_norm, sr = load_and_preprocess_audio(str(temp_file_path))
        ml_result = ml_service.predict(y_norm, sr, filename_or_path=audio.filename)

        detected_machine_id = ml_result["machine_id"] if ml_result["machine_id"] != "unknown" else machine_id

        spectrogram_info = {
            "url": f"/api/analysis/{analysis_id}/spectrogram",
            "format": "image/png"
        }

        full_response = {
            "analysis_id": analysis_id,
            "machine_id": detected_machine_id,
            "prediction": ml_result["prediction"],
            "spectrogram": spectrogram_info,
            **analysis_result
        }

        # Cache results in-memory
        store_analysis(analysis_id, full_response, spectrogram_png)

        return full_response

    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Audio processing error: {str(ve)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An internal error occurred while processing audio: {str(e)}"
        )
    finally:
        # Cleanup temporary uploaded file
        if temp_file_path.exists():
            try:
                os.remove(temp_file_path)
            except Exception:
                pass


@router.get("/analysis/{analysis_id}/spectrogram")
def get_spectrogram_image(analysis_id: str):
    png_bytes = get_spectrogram_png(analysis_id)
    if not png_bytes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Spectrogram image for analysis_id '{analysis_id}' was not found or has expired."
        )

    return Response(content=png_bytes, media_type="image/png")
