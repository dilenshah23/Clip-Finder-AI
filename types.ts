export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface Clip {
  startTime: string; // "HH:MM:SS"
  endTime: string; // "HH:MM:SS"
  title: string;
  description: string;
  viralityScore: number; // 1-10
  reasoning: string;
}

export interface VideoFile {
  file: File;
  url: string;
  base64?: string;
}

export interface AnalysisResult {
  clips: Clip[];
  overallSummary: string;
}
