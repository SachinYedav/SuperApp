import React from 'react';
import { Image as ImageIcon, Video, FileText, Music, File } from 'lucide-react';

// 1. Size Formatter (Bytes -> MB/GB)
export const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024; 
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 2. File Icon Helper
export const getFileIcon = (type) => {
  if (!type) return <File size={18} />;
  if (type.startsWith('image/')) return <ImageIcon size={18} />;
  if (type.startsWith('video/')) return <Video size={18} />;
  if (type.startsWith('audio/')) return <Music size={18} />;
  if (type.includes('pdf')) return <FileText size={18} />;
  return <File size={18} />;
};