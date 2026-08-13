// Quick end-to-end PDF upload test
const fs = require('fs');
const path = require('path');
const http = require('http');

// First create a chat, then upload a PDF buffer via HTTP multipart
async function test() {
  // Step 1: create a chat
  const chatRes = await fetch('http://localhost:5000/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'PDF Test Chat' })
  });
  const chat = await chatRes.json();
  console.log('Created chat:', chat._id);

  // Step 2: build a minimal valid PDF
  const pdfContent = Buffer.from(
    '%PDF-1.4\n' +
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n' +
    '4 0 obj<</Length 44>>stream\nBT /F1 12 Tf 100 700 Td (Hello PDF World) Tj ET\nendstream\nendobj\n' +
    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n' +
    'xref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000266 00000 n\n0000000360 00000 n\n' +
    'trailer<</Size 6/Root 1 0 R>>\nstartxref\n441\n%%EOF'
  );

  // Step 3: Upload PDF as multipart form
  const FormData = (await import('undici')).FormData;
  const { Blob } = await import('buffer');
  const form = new FormData();
  form.append('pdf', new Blob([pdfContent], { type: 'application/pdf' }), 'test.pdf');

  const uploadRes = await fetch(`http://localhost:5000/api/chats/${chat._id}/pdf`, {
    method: 'POST',
    body: form
  });
  const uploadData = await uploadRes.json();

  if (uploadRes.ok) {
    console.log('✅ PDF UPLOAD SUCCESS:', uploadData.message);
    console.log('   activePDF:', uploadData.activePDF);
  } else {
    console.error('❌ PDF UPLOAD FAILED:', uploadData.error);
  }
}

test().catch(console.error);
