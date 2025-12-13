import toast from 'react-hot-toast';

export const copyToClipboard = async (text: string, successMsg?: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMsg || 'Copied to clipboard');
  } catch {
    toast.error('Copy failed. Please try again.');
  }
};

export const getTodayUTC = () => new Date().toISOString().split('T')[0];

export const dataUrlToFile = (dataUrl: string, fileName: string) => {
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return new File([blob], fileName, { type: mimeString });
};
