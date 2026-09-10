import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Aether 3D Engine API',
      timestamp: new Date().toISOString(),
      webgl_support: true,
    });
  });

  // Newsletter / Waitlist signup
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    return res.json({
      success: true,
      message: 'Welcome to Aether Early Access! Your priority token has been issued.',
      email,
      queueNumber: Math.floor(Math.random() * 400) + 120,
    });
  });

  // Interactive AI Assistant for 3D Shader & Scene Customizer
  app.post('/api/ai-assistant', async (req, res) => {
    const { prompt, currentConfig } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful smart fallback response when key is not yet set
      const suggestions = [
        {
          preset: 'Cyberpunk Neon',
          color1: '#06b6d4',
          color2: '#ec4899',
          wireframe: false,
          speed: 1.4,
          roughness: 0.15,
          metalness: 0.85,
          advice: 'Configured high-contrast neon specular highlights with rapid rotational torque.',
        },
        {
          preset: 'Deep Obsidian',
          color1: '#312e81',
          color2: '#0f172a',
          wireframe: true,
          speed: 0.7,
          roughness: 0.4,
          metalness: 0.95,
          advice: 'Applied quantum dark lattice with high refractive index and subtle ambient diffusion.',
        },
        {
          preset: 'Supernova Aurora',
          color1: '#8b5cf6',
          color2: '#f59e0b',
          wireframe: false,
          speed: 1.2,
          roughness: 0.2,
          metalness: 0.7,
          advice: 'Shifted thermal spectrum to hyper-vibrant dual gradients with floating sub-particles.',
        },
      ];
      const match = suggestions[Math.floor(Math.random() * suggestions.length)];
      return res.json({
        success: true,
        source: 'local-preset-engine',
        data: match,
        reply: `Generated custom visual shader matrix based on "${prompt}". ${match.advice}`,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are the Aether 3D Engine Copilot. The user wants to adjust 3D aesthetics, lighting, or scene parameters.
Return ONLY a valid JSON object (no markdown, no backticks) with this structure:
{
  "preset": string,
  "color1": string (hex color),
  "color2": string (hex color),
  "wireframe": boolean,
  "speed": number (between 0.4 and 2.5),
  "roughness": number (between 0.05 and 0.9),
  "metalness": number (between 0.1 and 1.0),
  "reply": string (concise 1-2 sentence explanation of the design choices)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `User request: ${prompt}. Current configuration: ${JSON.stringify(currentConfig || {})}` }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        source: 'gemini-2.5-flash',
        data: parsed,
        reply: parsed.reply || 'Scene parameters dynamically tuned to your request.',
      });
    } catch (err: any) {
      return res.json({
        success: true,
        source: 'fallback',
        data: {
          preset: 'Bioluminescent Indigo',
          color1: '#6366f1',
          color2: '#38bdf8',
          wireframe: false,
          speed: 1.0,
          roughness: 0.2,
          metalness: 0.85,
        },
        reply: 'Applied intelligent neural shader profile with balanced dielectric reflections.',
      });
    }
  });

  // Interactive Demo Request
  app.post('/api/demo-request', (req, res) => {
    const { name, email, company, plan } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    return res.json({
      success: true,
      message: `Thank you ${name}! An enterprise architecture specialist will contact ${email} within 2 business hours.`,
      referenceId: `AETH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aether Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
