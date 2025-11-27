import axios from 'axios';

export interface RegistryRecord {
  id: string;
  registry: 'land' | 'business' | 'vehicles';
  data: any;
}

export class NaisProvider {
  private endpoint: string;

  constructor(endpoint = process.env.NAIS_ENDPOINT || 'https://nais.gov.ua/api/mock') {
    this.endpoint = endpoint;
  }

  async checkRegistry(registry: string, query: string): Promise<RegistryRecord[]> {
    if (this.endpoint.includes('mock')) {
      console.log(`Checking Mock NAIS Registry: ${registry} for ${query}`);
      return [
        {
          id: 'rec_1',
          registry: registry as any,
          data: { owner: 'Іванов Іван', status: 'active', details: 'Mock Data from NAIS' }
        }
      ];
    }

    try {
      // Hypothetical NAIS API structure
      const response = await axios.post(`${this.endpoint}/search`, { registry, query });
      return response.data;
    } catch (error) {
      console.error('NAIS API Error:', error);
      throw error;
    }
  }
}

export const naisProvider = new NaisProvider();
