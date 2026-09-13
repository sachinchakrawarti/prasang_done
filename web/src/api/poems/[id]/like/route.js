// src/app/api/poems/[id]/like/route.js

import { NextResponse } from 'next/server';

// In-memory store for likes (replace with database in production)
const likesStore = new Map();

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
    
    // Get current like status
    const currentLikes = likesStore.get(poemId) || { liked: false, count: 0 };
    
    // Toggle like
    const newLiked = !currentLiked;
    const newCount = currentLikes.count + (newLiked ? 1 : -1);
    
    // Update store
    likesStore.set(poemId, { liked: newLiked, count: Math.max(0, newCount) });
    
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        liked: newLiked,
        likes: Math.max(0, newCount)
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

// Optional: GET route to fetch like status
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
    const likeData = likesStore.get(poemId) || { liked: false, count: 0 };
    
    return NextResponse.json({
      success: true,
      data: {
        id: poemId,
        liked: likeData.liked,
        likes: likeData.count
      }
    });
  } catch (error) {
    console.error('Error fetching like status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like status' },
      { status: 500 }
    );
  }
}