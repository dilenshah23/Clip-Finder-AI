import React from 'react';
import { Clip } from '../types';
import { Play, TrendingUp, Sparkles, Clock } from 'lucide-react';

interface ClipCardProps {
  clip: Clip;
  isActive: boolean;
  onSelect: (clip: Clip) => void;
}

const ClipCard: React.FC<ClipCardProps> = ({ clip, isActive, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(clip)}
      className={`
        cursor-pointer rounded-xl p-4 transition-all duration-300 border
        ${isActive 
          ? 'bg-brand-900/30 border-brand-500/50 ring-1 ring-brand-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
        }
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold text-lg line-clamp-1 ${isActive ? 'text-brand-300' : 'text-gray-100'}`}>
          {clip.title}
        </h3>
        <div className="flex items-center gap-1 bg-gray-950/50 px-2 py-1 rounded-md border border-gray-800">
          <TrendingUp size={14} className={clip.viralityScore >= 8 ? "text-green-400" : "text-yellow-400"} />
          <span className="text-xs font-bold font-mono">{clip.viralityScore}/10</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span className="font-mono">{clip.startTime} - {clip.endTime}</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">
        {clip.description}
      </p>

      <div className="bg-gray-950/30 rounded-lg p-3 border border-gray-800/50">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-purple-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-400 italic">
            "{clip.reasoning}"
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button 
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${isActive 
              ? 'bg-brand-600 text-white' 
              : 'text-brand-400 hover:text-brand-300 bg-transparent'
            }
          `}
        >
          <Play size={16} fill={isActive ? "currentColor" : "none"} />
          {isActive ? 'Playing' : 'Preview Clip'}
        </button>
      </div>
    </div>
  );
};

export default ClipCard;
