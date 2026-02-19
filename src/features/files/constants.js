import { File, Image as ImageIcon, Video, Music, FileText } from 'lucide-react';

export const FILTERS = [
  { id: 'all', label: 'All Files', icon: File },
  { id: 'image', label: 'Images', icon: ImageIcon },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'document', label: 'Docs', icon: FileText }
];