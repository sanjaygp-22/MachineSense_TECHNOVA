import React, { useState, useRef, useEffect } from 'react';
import AudioFileCard from './AudioFileCard';
import { setActiveAudioFile } from '../../utils/audioStore';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_EXTENSIONS = ['wav', 'mp3', 'flac', 'm4a'];

export default function AudioUploader({ onAnalyzeFile }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const currentObjectUrlRef = useRef(null);

  // Clean up object URL when unmounting or changing file
  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateAndProcessFile = (file) => {
    setError('');

    if (!file) return;

    // Extension check
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      setError(`Unsupported file format (.${extension}). Please upload a WAV, MP3, FLAC, or M4A file.`);
      return;
    }

    // Size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size (${formatFileSize(file.size)}) exceeds maximum limit of 50 MB.`);
      return;
    }

    // Clean up previous URL if any
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    currentObjectUrlRef.current = objectUrl;

    // Save in memory store
    setActiveAudioFile(file);

    // Load metadata to extract duration
    const audio = new Audio();
    audio.src = objectUrl;

    audio.onloadedmetadata = () => {
      const durationSec = audio.duration;
      const durationFormatted =
        isNaN(durationSec) || !isFinite(durationSec)
          ? 'Duration N/A'
          : `${durationSec.toFixed(1)} seconds`;

      const info = {
        name: file.name,
        format: extension.toUpperCase(),
        sizeFormatted: formatFileSize(file.size),
        durationFormatted,
        audioUrl: objectUrl,
        rawFile: file
      };

      setSelectedFile(file);
      setFileInfo(info);
    };

    audio.onerror = () => {
      // Fallback if metadata fails to decode
      const info = {
        name: file.name,
        format: extension.toUpperCase(),
        sizeFormatted: formatFileSize(file.size),
        durationFormatted: 'Audio Ready',
        audioUrl: objectUrl,
        rawFile: file
      };
      setSelectedFile(file);
      setFileInfo(info);
    };
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }
    setSelectedFile(null);
    setFileInfo(null);
    setError('');
    setActiveAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    if (!fileInfo) return;
    setIsProcessing(true);
    if (fileInfo.rawFile) {
      setActiveAudioFile(fileInfo.rawFile);
    }
    if (onAnalyzeFile) {
      onAnalyzeFile(fileInfo);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      {/* Hidden Native Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".wav,.mp3,.flac,.m4a,audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Render File Card if file is selected */}
      {fileInfo ? (
        <AudioFileCard
          fileInfo={fileInfo}
          onRemove={handleRemoveFile}
          onAnalyze={handleAnalyze}
          isProcessing={isProcessing}
        />
      ) : (
        /* Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`glass-panel rounded-xl p-8 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
            isDragOver
              ? 'border-primary-container bg-primary-container/10 scale-[1.01] shadow-[0_0_25px_rgba(0,229,255,0.25)]'
              : 'border-white/15 hover:border-primary-container/50 hover:bg-surface-bright/40'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 group-hover:border-primary-container/40 transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <span className="material-symbols-outlined text-primary-container text-3xl">
              upload_file
            </span>
          </div>

          <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
            Upload Audio File
          </h3>

          <p className="font-body-md text-on-surface-variant text-sm max-w-sm mb-4">
            <span className="hidden md:inline">Drag & drop your machinery sound recording here, or </span>
            <span className="text-primary font-semibold underline underline-offset-4">Browse files</span>
          </p>

          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-white/5">
            <span className="font-data-mono text-[11px] text-outline uppercase tracking-wider">
              WAV • MP3 • FLAC • M4A (MAX 50 MB)
            </span>
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-xl glass-panel border-l-4 border-l-error bg-error/10 text-error text-sm flex items-center gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
          <span className="font-body-md">{error}</span>
        </div>
      )}
    </div>
  );
}
