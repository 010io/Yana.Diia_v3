/**
 * LEGO Component Registry
 * 
 * Central catalog of all available LEGO components with their
 * metadata, API bindings, and UI representations.
 */

import { z } from 'zod';

export interface LegoComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  icon: string;
  apiProvider?: string;
  apiEndpoint?: string;
  dataSchema?: z.ZodSchema;
  props: ComponentProps;
  metadata: ComponentMetadata;
}

export type ComponentCategory =
  | 'auth'
  | 'data'
  | 'payment'
  | 'notification'
  | 'layout'
  | 'form';

export interface ComponentProps {
  [key: string]: PropDefinition;
}

export interface PropDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  default?: any;
  description?: string;
  validation?: z.ZodSchema;
}

export interface ComponentMetadata {
  documentation: string;
  examples: string[];
  tags: string[];
  version: string;
  author: string;
}

/**
 * Component Registry Class
 */
export class ComponentRegistry {
  private components: Map<string, LegoComponent> = new Map();

  register(component: LegoComponent): void {
    this.components.set(component.id, component);
  }

  get(id: string): LegoComponent | undefined {
    return this.components.get(id);
  }

  getByCategory(category: ComponentCategory): LegoComponent[] {
    return Array.from(this.components.values()).filter(
      (c) => c.category === category
    );
  }

  search(query: string): LegoComponent[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.components.values()).filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getAll(): LegoComponent[] {
    return Array.from(this.components.values());
  }
}

// Global registry instance
export const componentRegistry = new ComponentRegistry();

/**
 * Register default LEGO components
 */

// AUTH COMPONENTS
componentRegistry.register({
  id: 'diia-signature',
  name: 'Diia.Signature',
  category: 'auth',
  description: 'Підпис документів через Дія.Підпис',
  icon: '🔐',
  apiProvider: 'diia',
  apiEndpoint: '/api/v1/auth/signature',
  props: {
    documentHash: {
      type: 'string',
      required: true,
      description: 'Hash документа для підпису',
    },
    redirectUrl: {
      type: 'string',
      required: false,
      description: 'URL для редиректу після підпису',
    },
  },
  metadata: {
    documentation: 'https://diia.gov.ua/developers/signature',
    examples: ['Traffic fine payment', 'Contract signing'],
    tags: ['auth', 'signature', 'diia'],
    version: '1.0.0',
    author: 'Diia Team',
  },
});

componentRegistry.register({
  id: 'bankid-auth',
  name: 'BankID',
  category: 'auth',
  description: 'Автентифікація через BankID',
  icon: '🏦',
  apiProvider: 'bankid',
  apiEndpoint: '/api/v1/auth',
  props: {
    redirectUrl: {
      type: 'string',
      required: true,
      description: 'URL для повернення після автентифікації',
    },
  },
  metadata: {
    documentation: 'https://bankid.privatbank.ua/docs',
    examples: ['User login', 'Identity verification'],
    tags: ['auth', 'bankid', 'privatbank'],
    version: '1.0.0',
    author: 'PrivatBank',
  },
});

// DATA COMPONENTS
componentRegistry.register({
  id: 'edrfo-api',
  name: 'eDrfo (Авто)',
  category: 'data',
  description: 'Інформація про автомобілі та штрафи',
  icon: '🚗',
  apiProvider: 'opendatabot',
  apiEndpoint: '/edrfo',
  props: {
    licensePlate: {
      type: 'string',
      required: true,
      description: 'Номерний знак автомобіля',
    },
    action: {
      type: 'string',
      required: false,
      default: 'getInfo',
      description: 'Дія: getInfo, getFines, getOwner',
    },
  },
  metadata: {
    documentation: 'https://opendatabot.ua/api/edrfo',
    examples: ['Check car fines', 'Verify car ownership'],
    tags: ['data', 'car', 'edrfo', 'fines'],
    version: '1.0.0',
    author: 'OpenDataBot',
  },
});

componentRegistry.register({
  id: 'edr-api',
  name: 'EDR (Компанії)',
  category: 'data',
  description: 'Інформація про компанії з ЄДР',
  icon: '🏢',
  apiProvider: 'opendatabot',
  apiEndpoint: '/company',
  props: {
    edrpou: {
      type: 'string',
      required: true,
      description: 'Код ЄДРПОУ компанії',
    },
  },
  metadata: {
    documentation: 'https://opendatabot.ua/api/edr',
    examples: ['Company verification', 'Director search'],
    tags: ['data', 'company', 'edr', 'edrpou'],
    version: '1.0.0',
    author: 'OpenDataBot',
  },
});

componentRegistry.register({
  id: 'court-registry',
  name: 'Court Registry',
  category: 'data',
  description: 'Судові рішення та справи',
  icon: '⚖️',
  apiProvider: 'opendatabot',
  apiEndpoint: '/court',
  props: {
    query: {
      type: 'string',
      required: true,
      description: 'Пошуковий запит (ім\'я, номер справи)',
    },
  },
  metadata: {
    documentation: 'https://court.gov.ua/api',
    examples: ['Search court cases', 'Check legal history'],
    tags: ['data', 'court', 'legal'],
    version: '1.0.0',
    author: 'Court Registry',
  },
});

// PAYMENT COMPONENTS
componentRegistry.register({
  id: 'monobank-payment',
  name: 'Monobank Payment',
  category: 'payment',
  description: 'Прийом платежів через Monobank',
  icon: '💳',
  apiProvider: 'monobank',
  apiEndpoint: '/api/merchant/invoice/create',
  props: {
    amount: {
      type: 'number',
      required: true,
      description: 'Сума платежу в копійках',
    },
    description: {
      type: 'string',
      required: true,
      description: 'Опис платежу',
    },
  },
  metadata: {
    documentation: 'https://api.monobank.ua/docs',
    examples: ['Fine payment', 'Service fee'],
    tags: ['payment', 'monobank', 'invoice'],
    version: '1.0.0',
    author: 'Monobank',
  },
});

componentRegistry.register({
  id: 'liqpay-payment',
  name: 'LiqPay',
  category: 'payment',
  description: 'Універсальний платіжний шлюз',
  icon: '💰',
  apiProvider: 'liqpay',
  apiEndpoint: '/api/request',
  props: {
    amount: {
      type: 'number',
      required: true,
      description: 'Сума платежу',
    },
    currency: {
      type: 'string',
      required: false,
      default: 'UAH',
      description: 'Валюта платежу',
    },
  },
  metadata: {
    documentation: 'https://www.liqpay.ua/documentation',
    examples: ['Online payment', 'Subscription'],
    tags: ['payment', 'liqpay', 'gateway'],
    version: '1.0.0',
    author: 'LiqPay',
  },
});

// NOTIFICATION COMPONENTS
componentRegistry.register({
  id: 'diia-push',
  name: 'Diia Push',
  category: 'notification',
  description: 'Push-повідомлення в додаток Дія',
  icon: '📱',
  apiProvider: 'diia',
  apiEndpoint: '/api/v1/notifications/push',
  props: {
    userId: {
      type: 'string',
      required: true,
      description: 'ID користувача в Дія',
    },
    message: {
      type: 'string',
      required: true,
      description: 'Текст повідомлення',
    },
    title: {
      type: 'string',
      required: false,
      description: 'Заголовок повідомлення',
    },
  },
  metadata: {
    documentation: 'https://diia.gov.ua/developers/notifications',
    examples: ['Payment confirmation', 'Document ready'],
    tags: ['notification', 'push', 'diia'],
    version: '1.0.0',
    author: 'Diia Team',
  },
});

// LAYOUT COMPONENTS
componentRegistry.register({
  id: 'diia-header',
  name: 'Diia Header',
  category: 'layout',
  description: 'Стандартний хедер Дії',
  icon: '📋',
  props: {
    title: {
      type: 'string',
      required: true,
      description: 'Заголовок сторінки',
    },
    showBack: {
      type: 'boolean',
      required: false,
      default: false,
      description: 'Показати кнопку назад',
    },
  },
  metadata: {
    documentation: 'https://design.diia.gov.ua/components/header',
    examples: ['Service page', 'Form page'],
    tags: ['layout', 'header', 'ui'],
    version: '1.0.0',
    author: 'Diia Design System',
  },
});

componentRegistry.register({
  id: 'info-card',
  name: 'Info Card',
  category: 'layout',
  description: 'Картка з інформацією',
  icon: 'ℹ️',
  props: {
    title: {
      type: 'string',
      required: true,
      description: 'Заголовок картки',
    },
    text: {
      type: 'string',
      required: true,
      description: 'Текст картки',
    },
    icon: {
      type: 'string',
      required: false,
      description: 'Іконка',
    },
  },
  metadata: {
    documentation: 'https://design.diia.gov.ua/components/card',
    examples: ['Information display', 'Status card'],
    tags: ['layout', 'card', 'ui'],
    version: '1.0.0',
    author: 'Diia Design System',
  },
});

componentRegistry.register({
  id: 'success-banner',
  name: 'Success Banner',
  category: 'layout',
  description: 'Повідомлення про успіх',
  icon: '✅',
  props: {
    title: {
      type: 'string',
      required: true,
      description: 'Заголовок',
    },
    message: {
      type: 'string',
      required: true,
      description: 'Повідомлення',
    },
  },
  metadata: {
    documentation: 'https://design.diia.gov.ua/components/banner',
    examples: ['Payment success', 'Form submitted'],
    tags: ['layout', 'banner', 'success', 'ui'],
    version: '1.0.0',
    author: 'Diia Design System',
  },
});
