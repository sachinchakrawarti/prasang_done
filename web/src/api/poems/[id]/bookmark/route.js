// src/app/api/poems/[id]/bookmark/route.js

import { NextResponse } from 'next/server';

// In-memory store for bookmarks (replace with database in production)
const bookmarkStore = new Map();

export async function POST(request, { params }) {
  try {
    // Await params before accessing
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Poem ID is required' },
        { status: 400 }
      );
    }

    const poemId = parseInt(id);
    
    // Get current bookmark status
    const currentBookmarked = bookmarkStore.get(poemId) || false;
    
    // Toggle bookmark
    const newBookmarked = !currentBookmarked;
    bookmarkStore.set(poemId, newBookmarked);
    
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        bookmarked: newBookmarked
      }
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
}

// Optional: GET route to fetch bookmark status
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Poem ID is required' },
        { status: 400 }
      );
    }

    const poemId = parseInt(id);
    const bookmarked = bookmarkStore.get(poemId) || false;
    
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        bookmarked: bookmarked
      }
    });
  } catch (error) {
    console.error('Error fetching bookmark status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmark status' },
      { status: 500 }
    );
  }
}