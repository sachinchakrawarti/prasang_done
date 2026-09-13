// src/app/api/poems/related/[id]/route.js

import { NextResponse } from 'next/server';

// Mock related poems data
const relatedPoemsData = {
  1: [
    {
      id: 2,
      title: 'ख्वाबों की दुनिया',
      content: 'ख्वाबों की दुनिया में हम खो गए...',
      language: 'hi',
      poet: 'Unknown Poet',
      poetSlug: 'unknown-poet',
      type: 'Poem',
      likes: 28,
      views: 85,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'परिंदों की उड़ान',
      content: 'परिंदे उड़ते हैं आसमान में...',
      language: 'hi',
      poet: 'Unknown Poet',
      poetSlug: 'unknown-poet',
      type: 'Poem',
      likes: 35,
      views: 102,
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'मंज़िल की तलाश',
      content: 'हर इंसान को अपनी मंज़िल मिले...',
      language: 'hi',
      poet: 'Unknown Poet',
      poetSlug: 'unknown-poet',
      type: 'Poem',
      likes: 22,
      views: 67,
      createdAt: new Date().toISOString(),
    },
  ],
  2: [
    {
      id: 1,
      title: 'आसमान के परिंदे',
      content: 'पंछी उड़ते हैं, आसमान में...',
      language: 'hi',
      poet: 'Unknown Poet',
      poetSlug: 'unknown-poet',
      type: 'Poem',
      likes: 42,
      views: 128,
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: 'सपनों की बारिश',
      content: 'सपनों की बारिश में भीगते हुए...',
      language: 'hi',
      poet: 'Unknown Poet',
      poetSlug: 'unknown-poet',
      type: 'Poem',
      likes: 19,
      views: 54,
      createdAt: new Date().toISOString(),
    }
  ]
};

export async function GET(request, { params }) {
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
    const relatedPoems = relatedPoemsData[poemId] || [];

    return NextResponse.json({
      success: true,
      data: relatedPoems
    });
  } catch (error) {
    console.error('Error fetching related poems:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: 'Failed to fetch related poems'
    });
  }
}