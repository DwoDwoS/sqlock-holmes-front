import api from '../api/api';

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'feedback' | 'bug';
}

export const contactService = {
  sendContactMessage: async (contactData: ContactRequest): Promise<void> => {
    await api.post('/contact', contactData);
  }
};