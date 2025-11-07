export type EntryType = 'photo' | 'text' | null;

export interface DayEntry {
  id: number;
  date: string; // ISO date string (YYYY-MM-DD)
  entry_type: EntryType;

  // For photo entries
  photo_url: string | null;
  photo_thumbnail_url: string | null;

  // For text entries
  text_content: string | null;
  color: string | null; // hex code

  created_at: string;
  updated_at: string;
}

export interface CreateDayEntryRequest {
  date: string;
  entry_type: 'photo' | 'text';

  // For photo entries
  photo_url?: string;
  photo_thumbnail_url?: string;

  // For text entries
  text_content?: string;
  color?: string;
}

export interface UpdateDayEntryRequest {
  entry_type?: 'photo' | 'text';
  photo_url?: string;
  photo_thumbnail_url?: string;
  text_content?: string;
  color?: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}
