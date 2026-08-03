'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, Upload, Sparkles, Loader2, ImageIcon, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { API_BASE } from '@/constants';

interface VisualSearchResult {
  extractedAttributes: {
    category?: string;
    color?: string;
    pattern?: string;
    material?: string;
    style?: string;
    confidence?: number;
  };
  exactMatches: any[];
  similarMatches: any[];
  wasFallback: boolean;
  latencyMs: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onResultsReady: (results: VisualSearchResult, query: string) => void;
}

export function VisualSearchModal({ isOpen, onClose, onResultsReady }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'preview' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<VisualSearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPreview(null);
      setFile(null);
      setPhase('idle');
      setResult(null);
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WEBP, HEIC).');
      setPhase('error');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg('Image too large — maximum 5 MB allowed.');
      setPhase('error');
      return;
    }
    const objectUrl = URL.createObjectURL(f);
    setPreview(objectUrl);
    setFile(f);
    setPhase('preview');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSearch = async () => {
    if (!file) return;
    setPhase('loading');
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/v1/web/search/visual`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Visual search failed');
      }
      const data: VisualSearchResult = json.data ?? json;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response structure received from visual search service.');
      }
      setResult(data);
      setPhase('done');
      // Persist results to sessionStorage for products page
      sessionStorage.setItem('visual_search_results', JSON.stringify(data));
      // Build a descriptive query string from extracted attributes
      const attrs = data.extractedAttributes || {};
      const queryParts = [attrs.color, attrs.category, attrs.style, attrs.material].filter(Boolean);
      const queryStr = queryParts.join(' ').trim() || 'visual search';
      onResultsReady(data, queryStr);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
      setPhase('error');
    }
  };

  const totalResults = result ? (result.exactMatches?.length ?? 0) + (result.similarMatches?.length ?? 0) : 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-label="AI Image Search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d9488] to-teal-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-sm tracking-tight">AI Image Search</h2>
              <p className="text-teal-100 text-[10px] font-medium">Upload a photo — Gemini finds matching styles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer border-none"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* === IDLE / UPLOAD ZONE === */}
          {(phase === 'idle' || phase === 'error') && (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all select-none
                  ${isDragging
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">JPG, PNG, WEBP · Max 5 MB</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse files</span>
                </div>
              </div>

              {phase === 'error' && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-400 font-medium">{errorMsg}</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />

              {/* Tips */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-3.5 space-y-1.5">
                <p className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">💡 Tips for best results</p>
                <ul className="text-[10px] text-amber-700 dark:text-amber-400 space-y-0.5 font-medium">
                  <li>• Use a clear, well-lit photo of the clothing item</li>
                  <li>• Single item works better than a full outfit</li>
                  <li>• Screenshots from other shopping apps work great!</li>
                </ul>
              </div>
            </>
          )}

          {/* === PREVIEW === */}
          {phase === 'preview' && preview && (
            <>
              <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square max-h-56">
                <img src={preview} alt="Selected" className="w-full h-full object-contain" />
                <button
                  onClick={() => { setPreview(null); setFile(null); setPhase('idle'); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer border-none"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                <ImageIcon className="w-4 h-4 shrink-0 text-gray-400" />
                <span className="truncate font-medium">{file?.name}</span>
                <span className="ml-auto shrink-0 text-gray-400">
                  {file ? (file.size / 1024).toFixed(0) + ' KB' : ''}
                </span>
              </div>

              <button
                onClick={handleSearch}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#0d9488] to-teal-600 hover:from-teal-600 hover:to-[#0d9488] text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm shadow-teal-300 dark:shadow-teal-900"
              >
                <Sparkles className="w-4 h-4" />
                Search with AI
              </button>

              <button
                onClick={() => { setPreview(null); setFile(null); setPhase('idle'); }}
                className="w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-1 cursor-pointer bg-transparent border-none transition-colors"
              >
                Choose a different image
              </button>
            </>
          )}

          {/* === LOADING === */}
          {phase === 'loading' && (
            <div className="py-10 flex flex-col items-center gap-5">
              {preview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 ring-4 ring-teal-200 dark:ring-teal-800">
                  <img src={preview} alt="Analyzing" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent flex items-end justify-center pb-2">
                    <Loader2 className="w-5 h-5 text-teal-300 animate-spin" />
                  </div>
                </div>
              )}
              <div className="text-center space-y-1.5">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-4 h-4 text-teal-500 animate-pulse" />
                  Gemini Vision is analysing…
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Identifying style, color, material & pattern</p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          )}

          {/* === DONE / RESULTS === */}
          {phase === 'done' && result && (
            <>
              <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <p className="text-xs font-bold text-teal-800 dark:text-teal-300">
                  Found <span className="text-teal-600">{totalResults}</span> matching styles
                  {result.wasFallback ? ' (similar)' : ''}
                </p>
              </div>

              {/* Extracted attribute pills */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">AI Detected Attributes</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(result.extractedAttributes)
                    .filter(([k, v]) => v && k !== 'confidence')
                    .map(([key, val]) => (
                      <span
                        key={key}
                        className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-300 capitalize border border-gray-200 dark:border-gray-700"
                      >
                        <span className="text-gray-400 mr-1">{key}:</span>{String(val)}
                      </span>
                    ))
                  }
                  {result.extractedAttributes.confidence !== undefined && (
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-[11px] font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {Math.round(Number(result.extractedAttributes.confidence) * 100)}% confidence
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#0d9488] to-teal-600 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm shadow-teal-300 dark:shadow-teal-900 hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" />
                View {totalResults} Results
              </button>

              <button
                onClick={() => { setPhase('idle'); setPreview(null); setFile(null); setResult(null); }}
                className="w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-1 cursor-pointer bg-transparent border-none transition-colors"
              >
                Search a different image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
