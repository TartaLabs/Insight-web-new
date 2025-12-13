import React, { useRef, useEffect, useState } from 'react';

interface CaptureStepProps {
  onCapture: (photoDataUrl: string) => void;
}

/**
 * 任务流程 - 拍照步骤
 * 显示摄像头预览和拍照按钮
 */
export const CaptureStep: React.FC<CaptureStepProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');

  useEffect(() => {
    const startCamera = async () => {
      setCameraError('');
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        setStream(media);
        if (videoRef.current) {
          videoRef.current.srcObject = media;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error(error);
        // setCameraError('Camera access denied or unavailable.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="flex flex-col items-center w-full z-10">
      <div className="relative w-full max-w-sm aspect-[3/4] bg-black border border-white/20 mb-8 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 border-2 border-tech-blue/30 m-8 rounded-[40%]" />
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-tech-blue/20" />
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-tech-blue/20" />
        {cameraError && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-red-400 text-xs px-4 text-center">
            {cameraError}
          </div>
        )}
      </div>
      <button
        onClick={handleCapture}
        disabled={!!cameraError}
        className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center hover:scale-105 transition-transform group disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="w-16 h-16 bg-white rounded-full group-hover:bg-tech-blue transition-colors" />
      </button>
    </div>
  );
};
