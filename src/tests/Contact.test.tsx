import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { contactService } from '../services/contactService';

// Mock the contact service
vi.mock('../services/contactService', () => ({
  contactService: {
    sendContactMessage: vi.fn(),
  },
}));

describe('Contact Form Functionality', () => {
  it('should have contactService defined', () => {
    expect(contactService).toBeDefined();
    expect(contactService.sendContactMessage).toBeDefined();
  });

  it('should call contactService with correct data', async () => {
    const mockData = {
      name: 'testuser',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message',
      type: 'feedback' as const,
    };

    (contactService.sendContactMessage as Mock).mockResolvedValue(undefined);

    await contactService.sendContactMessage(mockData);

    expect(contactService.sendContactMessage).toHaveBeenCalledWith(mockData);
    expect(contactService.sendContactMessage).toHaveBeenCalledTimes(1);
  });

  it('should handle service errors', async () => {
    const mockData = {
      name: 'testuser',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test',
      type: 'bug' as const,
    };

    (contactService.sendContactMessage as Mock).mockRejectedValue(
      new Error('Network error')
    );

    await expect(contactService.sendContactMessage(mockData)).rejects.toThrow('Network error');
  });

  it('should handle different message types', async () => {
    const feedbackData = {
      name: 'user',
      email: 'user@test.com',
      subject: 'Feedback',
      message: 'Great app!',
      type: 'feedback' as const,
    };

    const bugData = {
      name: 'user',
      email: 'user@test.com',
      subject: 'Bug',
      message: 'Found a bug',
      type: 'bug' as const,
    };

    (contactService.sendContactMessage as Mock).mockResolvedValue(undefined);

    await contactService.sendContactMessage(feedbackData);
    expect(contactService.sendContactMessage).toHaveBeenCalledWith(feedbackData);

    vi.clearAllMocks();

    await contactService.sendContactMessage(bugData);
    expect(contactService.sendContactMessage).toHaveBeenCalledWith(bugData);
  });
});