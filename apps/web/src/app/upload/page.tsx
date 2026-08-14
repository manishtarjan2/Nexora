'use client';

import React, { useState, useRef } from 'react';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    // Only accept video files
    if (selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setStatus('idle');
      setProgress(0);
    } else {
      alert('Please upload a valid video file.');
    }
  };

  const uploadVideo = async () => {
    if (!file) return;
    setStatus('uploading');

    try {
      // 1. Get Presigned URL from Node.js API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const urlResponse = await fetch(`${API_URL}/api/videos/upload-url?filename=${encodeURIComponent(file.name)}`);
      
      if (!urlResponse.ok) {
        throw new Error('Failed to fetch presigned URL');
      }
      
      const { uploadUrl } = await urlResponse.json();

      // 2. Upload file to MinIO using XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            setStatus('success');
            resolve(true);
          } else {
            setStatus('error');
            reject('Upload failed');
          }
        };

        xhr.onerror = () => {
          setStatus('error');
          reject('Network error during upload');
        };

        xhr.send(file);
      });
      
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 tracking-tight mb-2">
          Upload Studio
        </h1>
        <p className="text-gray-400 mb-12">Drag and drop your next viral hit right here.</p>

        {/* Drag and Drop Zone */}
        {!file ? (
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(236,72,153,0.2)]' 
                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
            }`}
          >
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            />
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500/20 to-violet-500/20 flex items-center justify-center mb-4 border border-white/10">
              <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Select files to upload</h3>
            <p className="text-sm text-gray-500">Or drag and drop video files</p>
          </div>
        ) : (
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4zm2 2v8h12V8z"/></svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-lg font-bold truncate text-white">{file.name}</h3>
                <p className="text-sm text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              
              {status === 'idle' && (
                <button 
                  onClick={() => setFile(null)}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {status === 'idle' && (
              <button 
                onClick={uploadVideo}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(236,72,153,0.3)]"
              >
                Upload to MinIO
              </button>
            )}

            {status === 'uploading' && (
              <div className="w-full flex flex-col gap-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-pink-400">Uploading...</span>
                  <span className="text-white">{progress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-center flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Upload Complete! FFmpeg is now processing your video.
              </div>
            )}

            {status === 'error' && (
              <div className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-center">
                Upload failed. Please try again.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
