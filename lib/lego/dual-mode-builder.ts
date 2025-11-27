// DUAL-MODE LEGO BUILDER
// Режим 1: Hackathon (макети) | Режим 2: Production (full-stack)

import type { LegoComponent } from './types'

export type LegoMode = 'hackathon' | 'production'

// Палітра блоків для різних режимів
export const BLOCKS_PALETTE = {
  hackathon: [
    { id: 'form-simple', name: 'Form', icon: '📋', exportAs: 'figma' },
    { id: 'section', name: 'Section', icon: '📦', exportAs: 'figma' },
    { id: 'button-simple', name: 'Button', icon: '🔘', exportAs: 'figma' },
    { id: 'text', name: 'Text', icon: '📝', exportAs: 'figma' },
    { id: 'image', name: 'Image', icon: '🖼️', exportAs: 'figma' },
    { id: 'auth-mock', name: 'Auth (Mock)', icon: '🔐', exportAs: 'figma' },
  ],
  production: [
    { id: 'form-validated', name: 'Form + Validator', icon: '📋✅', exportAs: 'nextjs', hasDB: true },
    { id: 'section-db', name: 'Section + Query', icon: '📦🗄️', exportAs: 'nextjs', hasDB: true },
    { id: 'button-webhook', name: 'Button + Webhook', icon: '🔘🔗', exportAs: 'nextjs', hasAPI: true },
    { id: 'auth-diia', name: 'DiiaID Auth', icon: '🔐🇺🇦', exportAs: 'nextjs', hasAuth: true },
    { id: 'api-nais', name: 'NAIS Integration', icon: '🏛️', exportAs: 'nextjs', hasAPI: true },
    { id: 'api-youcontrol', name: 'YouControl', icon: '🔍', exportAs: 'nextjs', hasAPI: true },
    { id: 'notification', name: 'Push Notification', icon: '🔔', exportAs: 'nextjs' },
    { id: 'offline-sync', name: 'Offline Sync', icon: '📴', exportAs: 'nextjs' },
  ]
}

// Головна функція білдера
export async function buildService(blocks: LegoComponent[], mode: LegoMode) {
  if (mode === 'hackathon') {
    return buildHackathon(blocks)
  } else {
    return buildProduction(blocks)
  }
}

// HACKATHON MODE: Генерує макети
async function buildHackathon(blocks: LegoComponent[]) {
  const screens = blocks.map((block, index) => ({
    id: `screen-${index + 1}`,
    name: block.name || `Screen ${index + 1}`,
    type: block.type,
    props: block.props,
  }))

  return {
    type: 'hackathon',
    screens,
    exports: {
      figma: generateFigmaJSON(blocks),
      html: generateHTMLMockup(screens),
      description: generateDescription(blocks),
      pdf: null // Генерується на клієнті
    },
    metadata: {
      totalScreens: blocks.length,
      generatedAt: new Date().toISOString(),
      mode: 'hackathon'
    }
  }
}

// Генерує HTML mockup у стилі Diia
function generateHTMLMockup(screens: any[]): string {
  const screenHTML = screens.map((screen, index) => `
    <!-- Screen ${index + 1}: ${screen.name} -->
    <div id="screen-${index}" class="screen" ${index > 0 ? 'style="display:none"' : ''}>
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        ${index > 0 ? `<button onclick="prevScreen()" class="mb-4 text-gray-600">← ${screen.name}</button>` : ''}
        ${generateScreenContent(screen, index, screens.length)}
      </div>
    </div>
  `).join('\n')

  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diia Service Mockup</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #E2ECF4;
    }
  </style>
</head>
<body>
  <div id="app" class="mx-auto max-w-[400px]">
    ${screenHTML}
  </div>

  <script>
    let currentScreen = 0;
    const screens = document.querySelectorAll('.screen');

    function showScreen(index) {
      screens.forEach((screen, i) => {
        screen.style.display = i === index ? 'block' : 'none';
      });
      currentScreen = index;
    }

    function nextScreen() {
      if (currentScreen < screens.length - 1) {
        showScreen(currentScreen + 1);
      }
    }

    function prevScreen() {
      if (currentScreen > 0) {
        showScreen(currentScreen - 1);
      }
    }
  </script>
</body>
</html>`
}

function generateScreenContent(screen: any, index: number, total: number): string {
  const isLast = index === total - 1

  if (isLast) {
    // Success screen
    return `
      <div class="text-center">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Вітаємо!</h2>
        <p class="text-gray-700 mb-6">${screen.props?.successMessage || 'Операція виконана успішно'}</p>
        <button onclick="window.location.href='/'" class="w-full bg-black text-white rounded-2xl py-3 font-semibold mb-3">
          На головний екран
        </button>
        <button class="w-full bg-transparent text-black rounded-2xl py-3 font-medium">
          До моїх послуг
        </button>
      </div>
    `
  }

  // Regular screen
  return `
    <h1 class="text-2xl font-bold text-gray-900 mb-6">${screen.name}</h1>
    <div class="bg-gray-100 rounded-2xl p-4 mb-6">
      <p class="text-sm text-gray-700">${screen.props?.description || 'Опис кроку'}</p>
    </div>
    <button onclick="nextScreen()" class="w-full bg-black text-white rounded-2xl py-3 font-semibold">
      ${index === total - 2 ? 'Підтвердити' : 'Далі'}
    </button>
  `
}

// PRODUCTION MODE: Генерує full-stack app
async function buildProduction(blocks: LegoComponent[]) {
  return {
    type: 'production',
    pages: blocks.map((block, index) => ({
      route: `/service/step-${index + 1}`,
      component: generateNextJSComponent(block, index),
      api: generateAPIRoute(block, index)
    })),
    database: {
      schema: generatePrismaSchema(blocks),
      migrations: `-- Auto-generated migration\n${blocks.map(b => generateMigration(b)).join('\n')}`
    },
    apis: blocks
      .filter(b => b.type?.includes('api') || b.props?.hasAPI)
      .map(b => ({
        path: `/api/${b.id}`,
        code: generateAPIHandler(b)
      })),
    docker: generateDockerfile(),
    vercel: generateVercelConfig(),
    metadata: {
      totalPages: blocks.length,
      hasAuth: blocks.some(b => b.type?.includes('auth')),
      hasDB: blocks.some(b => b.props?.hasDB),
      generatedAt: new Date().toISOString(),
      mode: 'production'
    }
  }
}

// Генератори для Hackathon Mode
function generateFigmaJSON(blocks: LegoComponent[]) {
  return {
    document: {
      id: 'yana-service',
      name: 'Yana.Diia Service',
      children: blocks.map((block, i) => ({
        id: `frame-${i}`,
        name: block.name || `Frame ${i + 1}`,
        type: 'FRAME',
        children: [{
          type: mapBlockToFigmaType(block.type),
          name: block.name,
          ...block.props
        }]
      }))
    }
  }
}



function generateDescription(blocks: LegoComponent[]) {
  return `# Опис послуги

## Кількість екранів: ${blocks.length}

## Flow:
${blocks.map((b, i) => `${i + 1}. ${b.name || b.type}`).join('\n')}

## Компоненти:
${blocks.map(b => `- ${b.type}: ${b.name || 'Unnamed'}`).join('\n')}

Згенеровано: ${new Date().toLocaleString('uk-UA')}
`
}

// Генератори для Production Mode
function generateNextJSComponent(block: LegoComponent, index: number) {
  return `'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Step${index + 1}() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/step-${index + 1}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        router.push('/service/step-${index + 2}')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">${block.name || `Step ${index + 1}`}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Auto-generated form fields */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold"
        >
          {loading ? 'Обробка...' : 'Далі'}
        </button>
      </form>
    </div>
  )
}
`
}

function generateAPIRoute(block: LegoComponent, index: number) {
  return `import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    // Save to database
    // Call external APIs if needed
    
    return NextResponse.json({ 
      success: true, 
      step: ${index + 1},
      data: body 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
`
}

function generateAPIHandler(block: LegoComponent) {
  return `// API Handler for ${block.name || block.type}
export async function handler(req, res) {
  // Implementation
}
`
}

function generatePrismaSchema(blocks: LegoComponent[]) {
  return `// Auto-generated Prisma Schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ServiceSubmission {
  id        String   @id @default(cuid())
  userId    String
  step      Int
  data      Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

${blocks.map((b, i) => `
model Step${i + 1}Data {
  id        String   @id @default(cuid())
  userId    String
  data      Json
  createdAt DateTime @default(now())
}
`).join('')}
`
}

function generateMigration(block: LegoComponent) {
  return `-- Migration for ${block.name || block.type}`
}

function generateDockerfile() {
  return `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
`
}

function generateVercelConfig() {
  return {
    buildCommand: "npm run build",
    framework: "nextjs",
    regions: ["fra1"]
  }
}

function mapBlockToFigmaType(type: string | undefined) {
  const map: Record<string, string> = {
    'form': 'FRAME',
    'form-simple': 'FRAME',
    'section': 'FRAME',
    'button': 'RECTANGLE',
    'text': 'TEXT',
    'image': 'RECTANGLE'
  }
  return map[type || ''] || 'FRAME'
}

// Export utilities
export function getBlocksPalette(mode: LegoMode) {
  return BLOCKS_PALETTE[mode]
}

export function canExportTo(mode: LegoMode, format: string) {
  if (mode === 'hackathon') {
    return ['figma', 'html', 'pdf', 'json', 'txt'].includes(format)
  }
  return ['nextjs', 'docker', 'vercel', 'openapi', 'mobile'].includes(format)
}