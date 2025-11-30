import React, { useEffect, useState } from 'react';
import { Loader2, Zap, Brain, Video } from 'lucide-react';

const LoadingState: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { icon: Video, text: "Scanning video frames..." },
    { icon: Brain, text: "Analyzing content context..." },
    { icon: Zap, text: "Detecting viral moments..." },
    { icon: Loader2, text: "Finalizing clips..." }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full max-w-2xl mx-auto">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
        <div className="relative bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl">
          <div className="flex gap-4">
             {steps.map((s, i) => {
               const Icon = s.icon;
               const isActive = i === step;
               const isPast = i < step;
               return (
                 <div key={i} className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                    ${isActive ? 'bg-brand-500 text-white scale-110 shadow-lg shadow-brand-500/50' : 
                      isPast ? 'bg-brand-900/50 text-brand-400' : 'bg-gray-800 text-gray-600'}
                 `}>
                   <Icon size={20} className={isActive && s.icon === Loader2 ? 'animate-spin' : ''} />
                 </div>
               )
             })}
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">AI is watching your video</h2>
      <p className="text-brand-400 text-lg font-medium animate-pulse min-h-[28px]">
        {steps[step].text}
      </p>
      <p className="text-gray-500 mt-4 text-sm max-w-md">
        This might take a minute depending on the video length. The Gemini model is processing visual and audio cues to find the best hooks.
      </p>
    </div>
  );
};

export default LoadingState;
