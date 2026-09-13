// src/app/api/poems/[slug]/route.js

import { NextResponse } from 'next/server';

// Mock data - replace with your database
const poemsData = {
  'aasmaan-ke-parinde': {
    id: 1,
    title: 'आसमान के परिंदे',
    content: `पंछी उड़ते हैं, आसमान में,
पर हम उड़ते हैं, अरमानों में।
ख्वाब हैं हमारे, बुलंद बहुत,
मंज़िल है दूर, मगर पास नहीं।`,
    language: 'hi',
    poet: 'Unknown Poet',
    poetSlug: 'unknown-poet',
    type: 'Poem',
    likes: 42,
    views: 128,
    featured: true,
    createdAt: new Date().toISOString(),
    tags: ['nature', 'dreams', 'inspiration'],
    translations: {
      en: {
        title: 'Birds of the Sky',
        content: `Birds fly in the sky,
But we fly in our dreams.
Our dreams are very high,
The destination is far, but not close.`
      },
      ur: {
        title: 'آسمان کے پرندے',
        content: `پرندے آسمان میں اڑتے ہیں،
لیکن ہم اپنے خوابوں میں اڑتے ہیں۔
ہمارے خواب بہت بلند ہیں،
منزل دور ہے مگر قریب نہیں۔`
      }
    }
  },
  'khwabon-ki-duniya': {
    id: 2,
    title: 'ख्वाबों की दुनिया',
    content: `ख्वाबों की दुनिया में हम खो गए,
अरमानों के पंखों पर उड़ गए।
मंज़िलें थीं दूर, रास्ते थे नए,
हर सपना एक नई सुबह ले आए।`,
    language: 'hi',
    poet: 'Unknown Poet',
    poetSlug: 'unknown-poet',
    type: 'Poem',
    likes: 28,
    views: 85,
    featured: false,
    createdAt: new Date().toISOString(),
    tags: ['dreams', 'journey', 'hope'],
    translations: {
      en: {
        title: 'World of Dreams',
        content: `We got lost in the world of dreams,
Flew on the wings of desires.
Destinations were far, paths were new,
Every dream brought a new dawn.`
      }
    }
  }
};

export async function GET(request, { params }) {
  try {
    // Await params before accessing
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Find poem by slug
    const poem = poemsData[slug];
    
    if (!poem) {
      return NextResponse.json(
        { error: 'Poem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: poem
    });
  } catch (error) {
    console.error('Error fetching poem:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}