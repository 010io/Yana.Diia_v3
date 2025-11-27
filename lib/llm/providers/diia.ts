import axios from 'axios';

export interface DiiaAuthResponse {
  token: string;
  expiresIn: number;
}

export interface DiiaDocument {
  id: string;
  type: 'passport' | 'tax_id' | 'driver_license';
  status: 'valid' | 'invalid';
}

export class DiiaProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl = 'https://api.diia.gov.ua/v1', apiKey = process.env.DIIA_API_KEY || 'mock_key') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async authenticate(signature: string): Promise<DiiaAuthResponse> {
    if (this.apiKey === 'mock_key') {
      console.log('Using Mock Diia Auth');
      return { token: 'mock_diia_token_' + Date.now(), expiresIn: 3600 };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, { signature });
      return response.data;
    } catch (error) {
      console.error('Diia Auth Error:', error);
      throw new Error('Failed to authenticate with Diia');
    }
  }

  async getDocuments(token: string): Promise<DiiaDocument[]> {
    if (this.apiKey === 'mock_key') {
      return [
        { id: 'doc_1', type: 'passport', status: 'valid' },
        { id: 'doc_2', type: 'tax_id', status: 'valid' }
      ];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Diia Documents Error:', error);
      throw error;
    }
  }
}

export const diiaProvider = new DiiaProvider();
