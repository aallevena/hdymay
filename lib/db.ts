import { sql } from '@vercel/postgres';
import { DayEntry } from '@/types';

export async function createDayEntriesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS day_entries (
        id SERIAL PRIMARY KEY,
        date DATE UNIQUE NOT NULL,
        entry_type VARCHAR(10) CHECK (entry_type IN ('photo', 'text')),

        photo_url TEXT,
        photo_thumbnail_url TEXT,

        text_content TEXT,
        color VARCHAR(7),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_day_entries_date ON day_entries(date);
    `;

    console.log('day_entries table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

export async function getDayEntriesByYear(year: number): Promise<DayEntry[]> {
  const result = await sql<DayEntry>`
    SELECT * FROM day_entries
    WHERE EXTRACT(YEAR FROM date) = ${year}
    ORDER BY date ASC
  `;
  return result.rows;
}

export async function getDayEntryByDate(date: string): Promise<DayEntry | null> {
  const result = await sql<DayEntry>`
    SELECT * FROM day_entries
    WHERE date = ${date}
    LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function createDayEntry(data: {
  date: string;
  entry_type: 'photo' | 'text';
  photo_url?: string;
  photo_thumbnail_url?: string;
  text_content?: string;
  color?: string;
}): Promise<DayEntry> {
  const result = await sql<DayEntry>`
    INSERT INTO day_entries (
      date, entry_type, photo_url, photo_thumbnail_url, text_content, color
    ) VALUES (
      ${data.date},
      ${data.entry_type},
      ${data.photo_url || null},
      ${data.photo_thumbnail_url || null},
      ${data.text_content || null},
      ${data.color || null}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateDayEntry(
  id: number,
  data: {
    entry_type?: 'photo' | 'text';
    photo_url?: string;
    photo_thumbnail_url?: string;
    text_content?: string;
    color?: string;
  }
): Promise<DayEntry> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.entry_type !== undefined) {
    updates.push(`entry_type = $${paramCount++}`);
    values.push(data.entry_type);
  }
  if (data.photo_url !== undefined) {
    updates.push(`photo_url = $${paramCount++}`);
    values.push(data.photo_url);
  }
  if (data.photo_thumbnail_url !== undefined) {
    updates.push(`photo_thumbnail_url = $${paramCount++}`);
    values.push(data.photo_thumbnail_url);
  }
  if (data.text_content !== undefined) {
    updates.push(`text_content = $${paramCount++}`);
    values.push(data.text_content);
  }
  if (data.color !== undefined) {
    updates.push(`color = $${paramCount++}`);
    values.push(data.color);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE day_entries
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await sql.query<DayEntry>(query, values);
  return result.rows[0];
}

export async function deleteDayEntry(id: number): Promise<void> {
  await sql`
    DELETE FROM day_entries WHERE id = ${id}
  `;
}
