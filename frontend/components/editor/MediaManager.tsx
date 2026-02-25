'use client';

import { useState, useRef } from 'react';
import { X, Upload, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MediaManagerProps {
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MediaManager({ companyId, isOpen, onClose }: MediaManagerProps) {
  const [medias, setMedias] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMedia = {
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: reader.result as string,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };
        setMedias(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setMedias(prev => prev.filter(m => m.id !== id));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed left-14 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-r border-slate-200 shadow-lg z-30 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Médias</h2>
          </div>

          {/* Upload Section */}
          <div className="p-4 border-b border-slate-200">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Upload en cours...' : 'Uploader des médias'}
            </Button>
          </div>

          {/* Media List */}
          <div className="flex-1 overflow-y-auto p-4">
            {medias.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Aucun média</p>
                <p className="text-xs mt-1">Uploadez des images ou vidéos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {medias.map((media) => (
                  <div
                    key={media.id}
                    className="relative group border border-slate-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-24 object-cover"
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCopyUrl(media.url)}
                        className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors"
                        title="Copier l'URL"
                      >
                        <Copy className="h-4 w-4 text-slate-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(media.id)}
                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                    
                    <div className="p-2 bg-white">
                      <p className="text-xs text-slate-600 truncate" title={media.name}>
                        {media.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
