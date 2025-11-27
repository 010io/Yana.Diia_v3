/**
 * LEGO Flow Examples
 * 
 * Example flows demonstrating how to use the LEGO system
 * to build government service flows.
 */

import { FlowBuilder } from './flow-engine';

/**
 * Example 1: Traffic Fine Payment Flow
 * 
 * Steps:
 * 1. User authenticates with Diia.Signature
 * 2. Fetch car fines from eDrfo API
 * 3. Create payment invoice via Monobank
 * 4. Show success message
 */
export function createTrafficFineFlow() {
  const builder = new FlowBuilder(
    'Traffic Fine Payment',
    'Оплата штрафів за порушення ПДР'
  );

  // Step 1: Authentication
  const authStep = builder.addStep(
    'diia-signature',
    {
      title: 'Увійдіть через Дія',
      documentHash: 'traffic_fine_auth',
    },
    { x: 100, y: 100 },
    {
      provider: 'diia',
      endpoint: '/api/v1/auth/signature',
      method: 'POST',
      responseMapping: {
        userId: 'user.id',
        userName: 'user.name',
      },
    }
  );

  // Step 2: Fetch fines
  const finesStep = builder.addStep(
    'edrfo-api',
    {
      action: 'getFines',
    },
    { x: 100, y: 250 },
    {
      provider: 'opendatabot',
      endpoint: '/edrfo/fines',
      method: 'GET',
      params: {
        userId: '{{step_1.userId}}',
      },
      responseMapping: {
        fines: 'data.fines',
        totalAmount: 'data.total',
      },
    }
  );

  // Step 3: Create payment
  const paymentStep = builder.addStep(
    'monobank-payment',
    {
      description: 'Оплата штрафу ПДР',
    },
    { x: 100, y: 400 },
    {
      provider: 'monobank',
      endpoint: '/api/merchant/invoice/create',
      method: 'POST',
      body: {
        amount: '{{step_2.totalAmount}}',
        description: 'Оплата штрафу ПДР',
      },
      responseMapping: {
        invoiceId: 'invoiceId',
        paymentUrl: 'pageUrl',
      },
    }
  );

  // Step 4: Success message
  const successStep = builder.addStep(
    'success-banner',
    {
      title: 'Штраф оплачено!',
      message: 'Дякуємо за оплату. Квитанція надіслана на ваш email.',
    },
    { x: 100, y: 550 }
  );

  // Connect steps
  builder.connect(authStep, finesStep);
  builder.connect(finesStep, paymentStep);
  builder.connect(paymentStep, successStep);

  // Set metadata
  builder.setMetadata({
    author: 'Yana.Diia',
    version: '1.0.0',
    tags: ['traffic', 'fine', 'payment'],
    createdAt: new Date(),
  });

  return builder.build();
}

/**
 * Example 2: Company Verification Flow
 * 
 * Steps:
 * 1. Input EDRPOU code
 * 2. Fetch company data from EDR
 * 3. Check court cases
 * 4. Display company info card
 */
export function createCompanyVerificationFlow() {
  const builder = new FlowBuilder(
    'Company Verification',
    'Перевірка компанії за кодом ЄДРПОУ'
  );

  // Step 1: Input EDRPOU
  const inputStep = builder.addStep(
    'input-edrpou',
    {
      label: 'Введіть код ЄДРПОУ',
      placeholder: '12345678',
    },
    { x: 100, y: 100 }
  );

  // Step 2: Fetch company data
  const companyStep = builder.addStep(
    'edr-api',
    {},
    { x: 100, y: 250 },
    {
      provider: 'opendatabot',
      endpoint: '/company',
      method: 'GET',
      params: {
        code: '{{step_1.edrpou}}',
      },
      responseMapping: {
        name: 'data.name',
        director: 'data.head',
        address: 'data.address',
        status: 'data.state',
      },
    }
  );

  // Step 3: Check court cases
  const courtStep = builder.addStep(
    'court-registry',
    {},
    { x: 100, y: 400 },
    {
      provider: 'opendatabot',
      endpoint: '/court',
      method: 'GET',
      params: {
        query: '{{step_2.name}}',
      },
      responseMapping: {
        cases: 'data.cases',
        caseCount: 'data.count',
      },
    }
  );

  // Step 4: Display info
  const infoStep = builder.addStep(
    'info-card',
    {
      title: '{{step_2.name}}',
      text: 'Директор: {{step_2.director}}\nАдреса: {{step_2.address}}\nСудових справ: {{step_3.caseCount}}',
      icon: '🏢',
    },
    { x: 100, y: 550 }
  );

  // Connect steps
  builder.connect(inputStep, companyStep);
  builder.connect(companyStep, courtStep);
  builder.connect(courtStep, infoStep);

  // Set metadata
  builder.setMetadata({
    author: 'Yana.Diia',
    version: '1.0.0',
    tags: ['company', 'verification', 'edr'],
    createdAt: new Date(),
  });

  return builder.build();
}

/**
 * Example 3: Document Signing Flow
 * 
 * Steps:
 * 1. Upload document
 * 2. Sign with Diia.Signature
 * 3. Send notification
 * 4. Show success
 */
export function createDocumentSigningFlow() {
  const builder = new FlowBuilder(
    'Document Signing',
    'Підпис документа через Дія.Підпис'
  );

  // Step 1: Upload document
  const uploadStep = builder.addStep(
    'upload-docs',
    {
      maxSize: 10485760, // 10MB
      types: ['pdf', 'jpg', 'png'],
    },
    { x: 100, y: 100 }
  );

  // Step 2: Sign document
  const signStep = builder.addStep(
    'diia-signature',
    {
      title: 'Підпишіть документ',
    },
    { x: 100, y: 250 },
    {
      provider: 'diia',
      endpoint: '/api/v1/auth/signature',
      method: 'POST',
      body: {
        documentHash: '{{step_1.fileHash}}',
      },
      responseMapping: {
        signedDocument: 'data.signedDocument',
        userId: 'data.userId',
      },
    }
  );

  // Step 3: Send notification
  const notifyStep = builder.addStep(
    'diia-push',
    {
      title: 'Документ підписано',
      message: 'Ваш документ успішно підписано',
    },
    { x: 100, y: 400 },
    {
      provider: 'diia',
      endpoint: '/api/v1/notifications/push',
      method: 'POST',
      body: {
        userId: '{{step_2.userId}}',
        title: 'Документ підписано',
        message: 'Ваш документ успішно підписано',
      },
    }
  );

  // Step 4: Success
  const successStep = builder.addStep(
    'success-banner',
    {
      title: 'Готово!',
      message: 'Документ підписано та збережено',
    },
    { x: 100, y: 550 }
  );

  // Connect steps
  builder.connect(uploadStep, signStep);
  builder.connect(signStep, notifyStep);
  builder.connect(notifyStep, successStep);

  // Set metadata
  builder.setMetadata({
    author: 'Yana.Diia',
    version: '1.0.0',
    tags: ['document', 'signature', 'diia'],
    createdAt: new Date(),
  });

  return builder.build();
}

/**
 * Get all example flows
 */
export function getAllExampleFlows() {
  return [
    createTrafficFineFlow(),
    createCompanyVerificationFlow(),
    createDocumentSigningFlow(),
  ];
}
