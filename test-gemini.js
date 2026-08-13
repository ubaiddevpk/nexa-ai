import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

dotenv.config({ path: path.resolve('backend', '.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGeminiImageGen() {
  const model = 'gemini-2.5-flash-image'; // from our model list - supports generateContent with images

  try {
    console.log(`\nTrying generateContent image generation with model: ${model}...`);
    const response = await ai.models.generateContent({
      model: model,
      contents: 'Generate an image of a simple red apple on a white background',
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          console.log(`\n--- SUCCESS! ---`);
          console.log(`MIME type: ${part.inlineData.mimeType}`);
          console.log(`Base64 size: ${part.inlineData.data.length} chars`);
          return;
        } else if (part.text) {
          console.log(`Text part: ${part.text.substring(0, 100)}`);
        }
      }
    }
    console.log('No image data in response:', JSON.stringify(response, null, 2).substring(0, 500));
  } catch (e) {
    console.error(`--- FAILURE: ${e.message.substring(0, 200)} ---`);
  }
}

testGeminiImageGen();
