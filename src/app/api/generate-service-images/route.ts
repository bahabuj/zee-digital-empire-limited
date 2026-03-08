import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const services = [
  {
    id: 'ai-commercial-ads',
    name: 'AI Commercial Ads',
    prompt: 'Professional AI-powered commercial advertisement, cinematic lighting, modern branding, high quality, 4K, sleek design'
  },
  {
    id: 'cinematic-vfx',
    name: 'Cinematic VFX Production',
    prompt: 'Cinematic visual effects production, movie scene with special effects, dramatic lighting, professional quality, movie industry'
  },
  {
    id: 'ai-music-video',
    name: 'AI Music Video Production',
    prompt: 'AI music video production, vibrant neon colors, dynamic camera work, modern music video style, energetic, professional'
  },
  {
    id: 'documentary',
    name: 'Documentary Production',
    prompt: 'Documentary film production, compelling storytelling scene, cinematic quality, professional camera equipment, documentary style'
  },
  {
    id: 'ai-photoshoots',
    name: 'AI Photoshoots',
    prompt: 'AI-powered fashion photography, studio lighting, professional quality, modern editorial style, high fashion, creative'
  },
  {
    id: 'website-dev',
    name: 'Website Development',
    prompt: 'Modern website development, developer coding on screen, professional workspace, clean design, technology, web development'
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    prompt: 'Content creation workspace, digital production tools, creative setup, professional content studio, modern equipment'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    prompt: 'Digital marketing analytics, data visualization charts, modern interface, professional marketing dashboard, business intelligence'
  },
  {
    id: 'virtual-assistant',
    name: 'Virtual Assistant Services',
    prompt: 'AI virtual assistant interface, futuristic design, helpful technology, clean UI, modern chat interface, AI technology'
  }
];

export async function POST() {
  try {
    const zai = await ZAI.create();
    const outputDir = path.join(process.cwd(), 'public', 'service-images');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = [];

    for (const service of services) {
      try {
        console.log(`Generating image for: ${service.name}`);

        const response = await zai.images.generations.create({
          prompt: service.prompt,
          size: '1344x768' // Landscape aspect ratio for service cards
        });

        const imageBase64 = response.data[0].base64;
        const buffer = Buffer.from(imageBase64, 'base64');
        
        const filename = `${service.id}.png`;
        const filepath = path.join(outputDir, filename);
        fs.writeFileSync(filepath, buffer);

        results.push({
          service: service.name,
          filename: filename,
          url: `/service-images/${filename}`,
          success: true
        });

        console.log(`✓ Generated: ${filename}`);
      } catch (error) {
        console.error(`✗ Failed for ${service.name}:`, error);
        results.push({
          service: service.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    console.error('Error generating service images:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Send a POST request to generate service images',
    services: services.map(s => ({
      id: s.id,
      name: s.name
    }))
  });
}
