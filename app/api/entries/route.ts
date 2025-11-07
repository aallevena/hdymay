import { NextRequest, NextResponse } from 'next/server';
import { getDayEntriesByYear, createDayEntry } from '@/lib/db';
import { CreateDayEntryRequest } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');

    if (!year) {
      return NextResponse.json(
        { error: 'Year parameter is required' },
        { status: 400 }
      );
    }

    const entries = await getDayEntriesByYear(parseInt(year));
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDayEntryRequest = await request.json();

    // Validate required fields
    if (!body.date || !body.entry_type) {
      return NextResponse.json(
        { error: 'Date and entry_type are required' },
        { status: 400 }
      );
    }

    // Validate entry type specific fields
    if (body.entry_type === 'photo' && !body.photo_url) {
      return NextResponse.json(
        { error: 'photo_url is required for photo entries' },
        { status: 400 }
      );
    }

    if (body.entry_type === 'text' && !body.text_content) {
      return NextResponse.json(
        { error: 'text_content is required for text entries' },
        { status: 400 }
      );
    }

    const entry = await createDayEntry(body);
    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating entry:', error);

    // Handle unique constraint violation
    if (error?.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'An entry already exists for this date' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}
