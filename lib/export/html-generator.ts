/**
 * HTML Generator for Diia Services
 * Generates interactive HTML prototypes from flow definitions
 */

import { ServiceFlow, FlowStep } from '../llm/pipeline/flow-generator'

export interface HTMLGeneratorOptions {
  includeStyles?: boolean
  includeTailwind?: boolean
  standalone?: boolean
  language?: 'uk' | 'en'
}

export class HTMLGenerator {
  private options: HTMLGeneratorOptions

  constructor(options: HTMLGeneratorOptions = {}) {
    this.options = {
      includeStyles: true,
      includeTailwind: true,
      standalone: true,
      language: 'uk',
      ...options
    }
  }

  /**
   * Generate complete HTML prototype from service flow
   */
  generatePrototype(flow: ServiceFlow): string {
    const screens = flow.steps.map((step, index) => 
      this.generateScreen(step, index, flow.steps.length)
    )

    if (this.options.standalone) {
      return this.wrapInHTML(screens, flow.name)
    }

    return screens.join('\n\n')
  }

  /**
   * Generate single screen HTML
   */
  private generateScreen(step: FlowStep, index: number, total: number): string {
    const screenId = `screen-${index}`
    
    return `
<!-- ${step.screen} -->
<div id="${screenId}" class="screen mx-auto max-w-[360px] min-h-[680px] bg-[#E2ECF4] p-2" ${index > 0 ? 'style="display:none"' : ''}>
  <div class="bg-white rounded-2xl p-4 mt-4 flex flex-col gap-6">
    ${this.generateScreenContent(step, index, total)}
  </div>
</div>
`
  }

  /**
   * Generate screen content based on step type
   */
  private generateScreenContent(step: FlowStep, index: number, total: number): string {
    switch (step.type) {
      case 'info':
        return this.generateInfoScreen(step)
      case 'input':
        return this.generateInputScreen(step, index, total)
      case 'upload':
        return this.generateUploadScreen(step, index, total)
      case 'review':
        return this.generateReviewScreen(step, index, total)
      case 'result':
        return this.generateResultScreen(step)
      case 'diia_signature':
        return this.generateAuthScreen(step, index, total)
      default:
        return this.generateGenericScreen(step, index, total)
    }
  }

  /**
   * Generate info/entry screen
   */
  private generateInfoScreen(step: FlowStep): string {
    return `
    <!-- PageHeader -->
    <div class="mb-6">
      <h1 class="text-[22px] font-bold text-gray-900">${step.props?.title || step.screen}</h1>
    </div>

    <!-- InfoBlock -->
    <div class="mb-6">
      <div class="text-base text-gray-700 mb-2">
        ${step.props?.description || 'Опис послуги'}
      </div>
      ${step.props?.requirements ? `
      <div class="text-sm text-gray-500">
        <span class="font-semibold">Потрібні документи:</span><br />
        ${step.props.requirements.map((req: string) => `– ${req}`).join('<br />')}
      </div>
      ` : ''}
    </div>

    <!-- PrimaryButton -->
    <button onclick="nextScreen()" class="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold active:opacity-80">
      Розпочати
    </button>
`
  }

  /**
   * Generate upload screen
   */
  private generateUploadScreen(step: FlowStep, index: number, total: number): string {
    return `
    <!-- InfoBlock -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-2">${step.props?.title || 'Завантаження документів'}</h2>
      <p class="text-sm text-gray-700">${step.props?.description || 'Додайте необхідні документи'}</p>
    </div>

    <!-- UploadField -->
    <label class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl py-8 px-4 text-gray-500 cursor-pointer bg-[#F5F8FA]">
      <span class="text-base mb-2">Додати файл</span>
      <input type="file" class="hidden" multiple onchange="handleFileUpload(event)">
    </label>

    <!-- FileList -->
    <div id="file-list-${index}" class="hidden">
      <div class="text-xs text-gray-500 text-center">Файли завантажено</div>
    </div>

    <!-- PrimaryButton -->
    <button onclick="nextScreen()" class="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold active:opacity-80">
      Далі
    </button>

    ${index > 0 ? `
    <!-- SecondaryButton -->
    <button onclick="prevScreen()" class="w-full mt-2 text-black bg-transparent text-sm rounded-2xl py-2 font-medium">
      Повернутись
    </button>
    ` : ''}
`
  }

  /**
   * Generate input form screen
   */
  private generateInputScreen(step: FlowStep, index: number, total: number): string {
    const fields = step.props?.fields || []
    
    return `
    <!-- InfoBlock -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-2">${step.props?.title || 'Введіть дані'}</h2>
      <p class="text-sm text-gray-700">${step.props?.description || 'Заповніть необхідні поля'}</p>
    </div>

    ${fields.map((field: any) => this.generateFormField(field)).join('\n')}

    <!-- PrimaryButton -->
    <button onclick="nextScreen()" class="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold active:opacity-80">
      Далі
    </button>

    ${index > 0 ? `
    <button onclick="prevScreen()" class="w-full mt-2 text-black bg-transparent text-sm rounded-2xl py-2 font-medium">
      Повернутись
    </button>
    ` : ''}
`
  }

  /**
   * Generate form field
   */
  private generateFormField(field: any): string {
    const fieldType = field.type || 'text'
    
    switch (fieldType) {
      case 'select':
        return `
    <!-- FormField Dropdown -->
    <div>
      <label class="block mb-1 text-sm font-medium text-gray-800">${field.label}</label>
      <select class="block w-full rounded-2xl border-gray-200 text-gray-900 p-3 bg-[#F5F8FA]">
        <option>${field.placeholder || 'Оберіть...'}</option>
        ${(field.options || []).map((opt: string) => `<option>${opt}</option>`).join('\n')}
      </select>
    </div>
`
      case 'date':
        return `
    <!-- FormField DatePicker -->
    <div>
      <label class="block mb-1 text-sm font-medium text-gray-800">${field.label}</label>
      <input type="date" class="block w-full rounded-2xl border-gray-200 text-gray-900 p-3 bg-[#F5F8FA]" placeholder="${field.placeholder || 'Виберіть дату'}">
    </div>
`
      case 'textarea':
        return `
    <!-- FormField Textarea -->
    <div>
      <label class="block mb-1 text-sm font-medium text-gray-800">${field.label}</label>
      <textarea rows="3" class="block w-full rounded-2xl border-gray-200 text-gray-900 p-3 bg-[#F5F8FA]" placeholder="${field.placeholder || ''}"></textarea>
    </div>
`
      default:
        return `
    <!-- FormField Input -->
    <div>
      <label class="block mb-1 text-sm font-medium text-gray-800">${field.label}</label>
      <input type="${fieldType}" class="block w-full rounded-2xl border-gray-200 text-gray-900 p-3 bg-[#F5F8FA]" placeholder="${field.placeholder || ''}">
    </div>
`
    }
  }

  /**
   * Generate review screen
   */
  private generateReviewScreen(step: FlowStep, index: number, total: number): string {
    const data = step.props?.reviewData || []
    
    return `
    <!-- InfoBlock -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-2">Перевірте дані заявки</h2>
      <p class="text-sm text-gray-700">Будь ласка, перевірте внесені вами дані. За необхідності відредагуйте перед відправкою.</p>
    </div>

    <!-- DataTable -->
    <div class="bg-[#F5F8FA] rounded-2xl p-4">
      ${data.map((item: any, i: number) => `
      <div class="flex justify-between items-center ${i < data.length - 1 ? 'mb-3' : ''}">
        <span class="text-gray-800 text-sm">${item.label}</span>
        <span class="text-gray-900 font-semibold text-sm">${item.value || '---'}</span>
      </div>
      `).join('\n')}
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col gap-2 mt-3">
      <button onclick="nextScreen()" class="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold active:opacity-80">
        Підтвердити
      </button>
      <button onclick="prevScreen()" class="w-full text-black bg-transparent text-sm rounded-2xl py-2 font-medium">
        Редагувати
      </button>
    </div>
`
  }

  /**
   * Generate success/result screen
   */
  private generateResultScreen(step: FlowStep): string {
    const isSuccess = step.props?.status !== 'error'
    
    return `
    <!-- SuccessIcon -->
    <div class="w-20 h-20 rounded-full ${isSuccess ? 'bg-[#E6F4D7]' : 'bg-red-100'} flex items-center justify-center mb-2">
      ${isSuccess ? `
      <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12l5 5l9-9"/>
      </svg>
      ` : `
      <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      `}
    </div>

    <!-- InfoBlock -->
    <div class="text-center">
      <h2 class="text-xl font-bold text-gray-900 mb-2">${step.props?.title || 'Заява подана успішно'}</h2>
      <p class="text-gray-700 text-base">${step.props?.message || 'Дякуємо! Ваша заява прийнята.'}</p>
    </div>

    <!-- PrimaryButton -->
    <button onclick="window.location.href='/'" class="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold active:opacity-80">
      До розділу послуг
    </button>
`
  }

  /**
   * Generate auth screen
   */
  private generateAuthScreen(step: FlowStep, index: number, total: number): string {
    return `
    <!-- InfoBlock -->
    <div class="text-center mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-2">Авторизація через Дія</h2>
      <p class="text-sm text-gray-700">Для продовження необхідно підтвердити особу через Дія.Підпис</p>
    </div>

    <!-- Diia.Signature Button -->
    <button onclick="nextScreen()" class="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold active:opacity-80 flex items-center justify-center gap-2">
      <span>Увійти через Дія</span>
    </button>

    ${index > 0 ? `
    <button onclick="prevScreen()" class="w-full mt-2 text-black bg-transparent text-sm rounded-2xl py-2 font-medium">
      Назад
    </button>
    ` : ''}
`
  }

  /**
   * Generate generic screen
   */
  private generateGenericScreen(step: FlowStep, index: number, total: number): string {
    return `
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-2">${step.screen}</h2>
      <p class="text-sm text-gray-700">${step.component}</p>
    </div>

    <button onclick="nextScreen()" class="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold active:opacity-80">
      Далі
    </button>

    ${index > 0 ? `
    <button onclick="prevScreen()" class="w-full mt-2 text-black bg-transparent text-sm rounded-2xl py-2 font-medium">
      Назад
    </button>
    ` : ''}
`
  }

  /**
   * Wrap screens in complete HTML document
   */
  private wrapInHTML(screens: string[], title: string): string {
    return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Дія</title>
  ${this.options.includeTailwind ? `
  <script src="https://cdn.tailwindcss.com"></script>
  ` : ''}
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .screen {
      transition: opacity 0.3s ease-in-out;
    }
    .screen.fade-out {
      opacity: 0;
    }
    .screen.fade-in {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div id="app">
    ${screens.join('\n')}
  </div>

  <script>
    let currentScreen = 0;
    const screens = document.querySelectorAll('.screen');
    const totalScreens = screens.length;

    function showScreen(index) {
      screens.forEach((screen, i) => {
        if (i === index) {
          screen.style.display = 'block';
          setTimeout(() => screen.classList.add('fade-in'), 10);
        } else {
          screen.classList.remove('fade-in');
          screen.style.display = 'none';
        }
      });
      currentScreen = index;
    }

    function nextScreen() {
      if (currentScreen < totalScreens - 1) {
        showScreen(currentScreen + 1);
      }
    }

    function prevScreen() {
      if (currentScreen > 0) {
        showScreen(currentScreen - 1);
      }
    }

    function handleFileUpload(event) {
      const fileList = event.target.closest('.screen').querySelector('[id^="file-list"]');
      if (fileList && event.target.files.length > 0) {
        fileList.classList.remove('hidden');
      }
    }

    // Initialize
    showScreen(0);
  </script>
</body>
</html>`
  }

  /**
   * Generate React component from flow
   */
  generateReactComponent(flow: ServiceFlow): string {
    return `import React, { useState } from 'react'

export function ${this.toPascalCase(flow.name)}Service() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const nextStep = () => {
    if (currentStep < ${flow.steps.length - 1}) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="mx-auto max-w-[360px] min-h-[680px] bg-[#E2ECF4] p-2">
      {currentStep === 0 && (
        ${this.generateReactScreen(flow.steps[0], 0, flow.steps.length)}
      )}
      ${flow.steps.slice(1).map((step, i) => `
      {currentStep === ${i + 1} && (
        ${this.generateReactScreen(step, i + 1, flow.steps.length)}
      )}
      `).join('\n')}
    </div>
  )
}
`
  }

  private generateReactScreen(step: FlowStep, index: number, total: number): string {
    // Simplified React generation - can be expanded
    return `
        <div className="bg-white rounded-2xl p-4 mt-4 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">${step.screen}</h2>
          </div>
          <button onClick={nextStep} className="w-full bg-black text-white rounded-2xl py-3 text-lg font-semibold">
            Далі
          </button>
          ${index > 0 ? `
          <button onClick={prevStep} className="w-full mt-2 text-black bg-transparent text-sm rounded-2xl py-2 font-medium">
            Назад
          </button>
          ` : ''}
        </div>
      `
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }
}

export const htmlGenerator = new HTMLGenerator()
