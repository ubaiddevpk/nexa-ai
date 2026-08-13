import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';

// Load the backend environment variables
dotenv.config({ path: path.resolve('backend', '.env') });

const apiKey = process.env.GROK_API_KEY;
console.log('Using API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');

if (!apiKey) {
  console.error('Error: GROK_API_KEY is not defined');
  process.exit(1);
}

const grok = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.x.ai/v1'
});

async function listModelsAndTest() {
  try {
    console.log('Listing available models from xAI...');
    const modelsList = await grok.models.list();
    console.log('Available models:');
    modelsList.data.forEach(m => console.log(`- ${m.id}`));

    if (modelsList.data.length > 0) {
      const selectedModel = modelsList.data[0].id;
      console.log(`\nTesting chat completion with model: ${selectedModel}...`);
      const completion = await grok.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: 'user', content: 'Say hello and confirm you are online!' }
        ]
      });
      console.log('\n--- SUCCESS ---');
      console.log('Response content:');
      console.log(completion.choices[0].message.content);
      console.log('----------------');
    }
  } catch (error) {
    console.error('\n--- FAILURE ---');
    console.error('Error testing Grok API:', error.message);
    if (error.status) console.error('HTTP Status:', error.status);
    console.error('----------------');
  }
}

listModelsAndTest();
