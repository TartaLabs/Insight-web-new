import React, { useRef, useEffect, useState, useCallback } from 'react';

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
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  const [isReady, setIsReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setIsReady(false);
    setPermissionDenied(false);

    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      // 检查组件是否仍然挂载
      if (!isMountedRef.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = media;

      if (videoRef.current) {
        videoRef.current.srcObject = media;
        try {
          await videoRef.current.play();
          if (isMountedRef.current) {
            setIsReady(true);
          }
        } catch (playError) {
          // 忽略 AbortError，这是由于组件卸载或重新渲染导致的
          if (playError instanceof DOMException && playError.name === 'AbortError') {
            return;
          }
          throw playError;
        }
      }
    } catch (error) {
      // 忽略 AbortError
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      console.error(error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setCameraError(
          'Camera permission denied. Please enable it in browser settings, then tap to retry.',
        );
      } else {
        setCameraError('Camera unavailable. Tap to retry.');
      }
    }
  }, []);

  const handleRetry = () => {
    startCamera();
  };

  useEffect(() => {
    isMountedRef.current = true;
    startCamera();

    return () => {
      isMountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [startCamera]);

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

  const isDisabled = !isReady || !!cameraError;

  return (
    <div className="flex flex-col items-center w-full z-10">
      <div className="relative w-full max-w-sm aspect-[3/4] bg-black border border-white/20 mb-8 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 border-2 border-tech-blue/30 m-8 rounded-[40%]" />
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-tech-blue/20" />
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-tech-blue/20" />

        {/* 加载状态 */}
        {!isReady && !cameraError && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-tech-blue text-xs font-mono animate-pulse">
              INITIALIZING CAMERA...
            </div>
          </div>
        )}

        {/* 错误状态 - 点击重试 */}
        {cameraError && (
          <div
            onClick={handleRetry}
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-xs px-4 text-center cursor-pointer hover:bg-black/60 transition-colors gap-3"
          >
            <span className="text-red-400">{cameraError}</span>
            {permissionDenied && (
              <span className="text-gray-400 text-[10px]">
                Settings → Site Settings → Camera → Allow
              </span>
            )}
            <span className="text-tech-blue text-[10px] underline">Tap to retry</span>
          </div>
        )}
      </div>

      <button
        onClick={handleCapture}
        disabled={isDisabled}
        className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center hover:scale-105 transition-transform group disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="w-16 h-16 bg-white rounded-full group-hover:bg-tech-blue transition-colors" />
      </button>
    </div>
  );
};
