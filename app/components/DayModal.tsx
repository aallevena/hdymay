'use client';

import { useState, useEffect } from 'react';
import { DayEntry } from '@/types';
import ColorPalette from './ColorPalette';
import Image from 'next/image';

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  entry: DayEntry | null;
  onSave: () => void;
}

export default function DayModal({ isOpen, onClose, date, entry, onSave }: DayModalProps) {
  const [entryType, setEntryType] = useState<'photo' | 'text'>('text');
  const [textContent, setTextContent] = useState('');
  const [color, setColor] = useState('#6BCB77');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes or entry changes
  useEffect(() => {
    if (isOpen) {
      if (entry) {
        setEntryType(entry.entry_type || 'text');
        setTextContent(entry.text_content || '');
        setColor(entry.color || '#6BCB77');
        setPhotoPreview(entry.photo_url || null);
      } else {
        setEntryType('text');
        setTextContent('');
        setColor('#6BCB77');
        setPhotoFile(null);
        setPhotoPreview(null);
      }
      setError(null);
    }
  }, [isOpen, entry]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);

    try {
      let photoUrl = entry?.photo_url;

      // Upload photo if there's a new file
      if (entryType === 'photo' && photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || 'Failed to upload photo');
        }

        const uploadData = await uploadRes.json();
        photoUrl = uploadData.url;
      }

      // Create or update entry
      const dateStr = date.toISOString().split('T')[0];
      const payload = {
        date: dateStr,
        entry_type: entryType,
        ...(entryType === 'photo' && { photo_url: photoUrl }),
        ...(entryType === 'text' && { text_content: textContent, color }),
      };

      if (entry) {
        // Update existing entry
        const res = await fetch(`/api/entries/${entry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update entry');
        }
      } else {
        // Create new entry
        const res = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create entry');
        }
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!entry || !confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/entries/${entry.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete entry');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete entry');
    }
  };

  if (!isOpen) return null;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{formattedDate}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Entry Type Selection */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setEntryType('text')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  entryType === 'text'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                📝 Text Memory
              </button>
              <button
                type="button"
                onClick={() => setEntryType('photo')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  entryType === 'photo'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                📷 Photo
              </button>
            </div>

            {/* Text Entry Form */}
            {entryType === 'text' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-2">
                    Your memory
                  </label>
                  <textarea
                    id="text-content"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What happened on this day?"
                    required
                  />
                </div>
                <ColorPalette selectedColor={color} onSelectColor={setColor} />
              </div>
            )}

            {/* Photo Entry Form */}
            {entryType === 'photo' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required={!entry?.photo_url}
                  />
                </div>
                {photoPreview && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Saving...' : entry ? 'Update' : 'Save'}
              </button>
              {entry && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
