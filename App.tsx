import React, { useState } from 'react';
import { Upload, X, Film, AlertCircle } from 'lucide-react';
import { AppState, Clip, AnalysisResult, VideoFile } from './types';
import { analyzeVideo } from './services/geminiService';
import { fileToBase64 } from './services/utils';
import LoadingState from './components/LoadingState';
import VideoPlayer from './components/VideoPlayer';
import ClipCard from './components/ClipCard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentClip, setCurrentClip] = useState<Clip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('video/')) {
      setError("Please upload a valid video file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB warning
       setError("File is larger than 50MB. It may fail to process in the browser due to memory limits.");
       // We let them proceed but keep the warning visible for a moment or until error clears
    } else {
        setError(null);
    }

    const url = URL.createObjectURL(file);
    setVideoFile({ file, url });
    setAppState(AppState.IDLE);
    setResult(null);
    setCurrentClip(null);
  };

  const startAnalysis = async () => {
    if (!videoFile) return;

    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const base64 = await fileToBase64(videoFile.file);
      const analysisData = await analyzeVideo(base64, videoFile.file.type);
      setResult(analysisData);
      setAppState(AppState.RESULTS);
      
      // Auto select the first clip
      if (analysisData.clips.length > 0) {
        setCurrentClip(analysisData.clips[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze video. Please try a shorter video or check your API key.");
      setAppState(AppState.ERROR);
    }
  };

  const reset = () => {
    setVideoFile(null);
    setResult(null);
    setCurrentClip(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-gradient-to-tr from-brand-500 to-blue-600 p-2 rounded-lg">
              <Film size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Clip Finder AI
            </h1>
          </div>
          {videoFile && appState === AppState.RESULTS && (
             <button 
                onClick={reset}
                className="text-sm text-gray-400 hover:text-white transition-colors"
             >
               Start Over
             </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-200">
            <AlertCircle size={20} />
            <p>{error}</p>
            <button onClick={() => setError(null)} className="ml-auto hover:text-white"><X size={16}/></button>
          </div>
        )}

        {/* State: IDLE or ERROR (Input) */}
        {(appState === AppState.IDLE || appState === AppState.ERROR) && (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            {!videoFile ? (
               <div className="w-full max-w-xl text-center">
                 <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
                   Turn long videos into <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">
                     viral shorts instantly
                   </span>
                 </h2>
                 <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                   Upload your long-form content. Our AI identifies the most engaging moments, scores their virality, and creates perfect 30-60s clips for TikTok & Reels.
                 </p>
                 
                 <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                   <div className="relative bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl p-12 transition-all hover:border-brand-500/50 hover:bg-gray-800/50">
                     <input 
                       type="file" 
                       accept="video/*" 
                       onChange={handleFileChange}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     />
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 p-4 rounded-full mb-4 group-hover:bg-brand-900/30 group-hover:text-brand-400 transition-colors">
                         <Upload size={32} />
                       </div>
                       <p className="text-lg font-medium text-white mb-2">Drop video or click to browse</p>
                       <p className="text-sm text-gray-500">MP4, MOV, WebM (Max 50MB for demo)</p>
                     </div>
                   </div>
                 </div>
               </div>
            ) : (
              <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Review Upload</h3>
                    <button onClick={() => setVideoFile(null)} className="text-gray-400 hover:text-white p-2">
                      <X size={20} />
                    </button>
                 </div>
                 
                 <div className="bg-black rounded-xl overflow-hidden mb-6 aspect-video flex items-center justify-center relative">
                    <video src={videoFile.url} controls className="max-h-full max-w-full" />
                 </div>

                 <div className="flex justify-end">
                   <button 
                     onClick={startAnalysis}
                     className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                   >
                     Analyze with AI
                   </button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* State: ANALYZING */}
        {appState === AppState.ANALYZING && (
          <LoadingState />
        )}

        {/* State: RESULTS */}
        {appState === AppState.RESULTS && result && videoFile && (
           <div className="flex flex-col lg:flex-row gap-8 h-full">
              {/* Left Column: Player */}
              <div className="w-full lg:w-2/3 flex flex-col gap-6">
                 <div className="sticky top-24">
                   <VideoPlayer 
                      videoUrl={videoFile.url}
                      startTime={currentClip?.startTime}
                      endTime={currentClip?.endTime}
                      autoPlay={true}
                   />
                   
                   <div className="mt-6 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {currentClip ? currentClip.title : "Full Video"}
                      </h2>
                      <p className="text-gray-400 leading-relaxed">
                        {currentClip ? currentClip.description : result.overallSummary}
                      </p>
                      {currentClip && (
                         <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-4">
                            <div>
                               <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Time Range</span>
                               <span className="font-mono text-brand-300 bg-brand-900/20 px-2 py-1 rounded">
                                 {currentClip.startTime} - {currentClip.endTime}
                               </span>
                            </div>
                            <div>
                               <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Virality Score</span>
                               <span className="font-bold text-green-400">{currentClip.viralityScore}/10</span>
                            </div>
                         </div>
                      )}
                   </div>
                 </div>
              </div>

              {/* Right Column: List */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                       <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
                         {result.clips.length}
                       </span>
                       Identified Clips
                    </h3>
                    <span className="text-xs text-gray-500">Sorted by relevance</span>
                 </div>
                 
                 <div className="flex flex-col gap-4 pb-12">
                   {result.clips.map((clip, idx) => (
                     <ClipCard 
                       key={idx} 
                       clip={clip} 
                       isActive={currentClip === clip}
                       onSelect={setCurrentClip}
                     />
                   ))}
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
