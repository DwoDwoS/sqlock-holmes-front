import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { contactService } from '../services/contactService';
import type { ContactRequest } from '../services/contactService';
import api from '../api/api';

// Mock the API module
vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('contactService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendContactMessage', () => {
    it('should send contact message successfully with feedback type', async () => {
      const contactData: ContactRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Great app!',
        message: 'I love using this application.',
        type: 'feedback',
      };

      (api.post as Mock).mockResolvedValue({ data: {} });

      await contactService.sendContactMessage(contactData);

      expect(api.post).toHaveBeenCalledWith('/contact', contactData);
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    it('should send contact message successfully with bug type', async () => {
      const contactData: ContactRequest = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Bug Report',
        message: 'I found a bug in the login page.',
        type: 'bug',
      };

      (api.post as Mock).mockResolvedValue({ data: {} });

      await contactService.sendContactMessage(contactData);

      expect(api.post).toHaveBeenCalledWith('/contact', contactData);
    });

    it('should send contact message successfully with question type', async () => {
      const contactData: ContactRequest = {
        name: 'Alice Brown',
        email: 'alice@example.com',
        subject: 'How to use?',
        message: 'Can you explain how to create an investigation?',
        type: 'question',
      };

      (api.post as Mock).mockResolvedValue({ data: {} });

      await contactService.sendContactMessage(contactData);

      expect(api.post).toHaveBeenCalledWith('/contact', contactData);
    });

    it('should throw error when API call fails', async () => {
      const contactData: ContactRequest = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        type: 'feedback',
      };

      const mockError = new Error('Network error');
      (api.post as Mock).mockRejectedValue(mockError);

      await expect(contactService.sendContactMessage(contactData)).rejects.toThrow('Network error');
    });

    it('should throw error when server returns error', async () => {
      const contactData: ContactRequest = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        type: 'feedback',
      };

      const mockError = new Error('Server error');
      (api.post as Mock).mockRejectedValue(mockError);

      await expect(contactService.sendContactMessage(contactData)).rejects.toThrow('Server error');
    });

    it('should handle all required fields in contact data', async () => {
      const contactData: ContactRequest = {
        name: 'Complete User',
        email: 'complete@example.com',
        subject: 'Complete Subject',
        message: 'Complete message with all fields',
        type: 'bug',
      };

      (api.post as Mock).mockResolvedValue({ data: {} });

      await contactService.sendContactMessage(contactData);

      const callArgs = (api.post as Mock).mock.calls[0][1];
      expect(callArgs).toHaveProperty('name', 'Complete User');
      expect(callArgs).toHaveProperty('email', 'complete@example.com');
      expect(callArgs).toHaveProperty('subject', 'Complete Subject');
      expect(callArgs).toHaveProperty('message', 'Complete message with all fields');
      expect(callArgs).toHaveProperty('type', 'bug');
    });
  });
});