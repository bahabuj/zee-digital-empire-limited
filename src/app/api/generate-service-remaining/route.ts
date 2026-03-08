import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const remainingServices = [
  {
    id: 'website-dev',
    name: 'Website Development',
    prompt: 'Modern website development, developer coding on screen, professional workspace, clean design, technology'
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    prompt: 'Content creation workspace, digital production tools, creative setup, professional content studio'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    prompt: 'Digital marketing analytics, data visualization charts, modern interface, professional dashboard'
  },
  {
    id: 'virtual-assistant',
    name: 'Virtual Assistant Services',
    prompt: 'AI virtual assistant interface, futuristic design, helpful technology, clean UI, chat interface'
  }
];

export async function POST() {
  try {
    const zai = await ZAI.create();
    const outputDir = path.join(process.cwd(), 'public', 'service-images');

    const results = [];

    for (const service of remainingServices) {
      try {
        console.log(`Generating image for: ${service.name}`);

        const response = await zai.images.generations.create({
          prompt: service.prompt,
          size: '1344x768'
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

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
