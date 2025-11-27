import axios from 'axios';

export interface CompanyInfo {
  code: string;
  name: string;
  status: string;
  address: string;
}

export class OpenDataBotProvider {
  private apiKey: string;
  private baseUrl = 'https://opendatabot.com/api/v3';

  constructor(apiKey = process.env.OPENDATABOT_API_KEY || 'mock_key') {
    this.apiKey = apiKey;
  }

  async searchCompany(code: string): Promise<CompanyInfo | null> {
    if (this.apiKey === 'mock_key') {
      console.log('Using Mock OpenDataBot Search');
      if (code === '12345678') {
        return {
          code: '12345678',
          name: 'ТОВ "РОГА ТА КОПИТА"',
          status: 'active',
          address: 'м. Київ, вул. Хрещатик, 1'
        };
      }
      return null;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/company/${code}`, {
        params: { apiKey: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error('OpenDataBot Error:', error);
      return null;
    }
  }

  async getCourtDecisions(companyCode: string): Promise<any[]> {
    if (this.apiKey === 'mock_key') {
      return [
        { id: 'case_1', date: '2024-01-15', type: 'administrative', summary: 'Штраф за порушення податкового законодавства' }
      ];
    }
    // Real implementation would go here
    return [];
  }
}

export const openDataBotProvider = new OpenDataBotProvider();
