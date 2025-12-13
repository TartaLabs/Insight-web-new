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
