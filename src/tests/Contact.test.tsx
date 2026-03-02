import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import Contact from '../components/Contact';
import { contactService } from '../services/contactService';

// Mock the contact service
vi.mock('../services/contactService', () => ({
  contactService: {
    sendContactMessage: vi.fn(),
  },
}));

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'USER',
    },
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the contact page with title and subtitle', async () => {
    renderWithProviders(<Contact />);
    expect(await screen.findByText('Contactez-moi')).toBeInTheDocument();
  });

  it('renders all info cards', () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("Retour d'expérience")).toBeInTheDocument();
    expect(screen.getByText('Signaler un bug')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders the contact form with all fields', () => {
    renderWithProviders(<Contact />);
    
    expect(screen.getByLabelText(/Type de message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sujet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Envoyer le message/i })).toBeInTheDocument();
  });

  it('pre-fills name and email from user context', () => {
    renderWithProviders(<Contact />);
    
    const nameInput = screen.getByLabelText(/Nom/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    
    expect(nameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('test@example.com');
  });

  it('allows user to change form field values', () => {
    renderWithProviders(<Contact />);
    
    const subjectInput = screen.getByLabelText(/Sujet/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/Message/i) as HTMLTextAreaElement;
    
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message content' } });
    
    expect(subjectInput.value).toBe('Test Subject');
    expect(messageInput.value).toBe('Test message content');
  });

  it('changes placeholder text when bug type is selected', () => {
    renderWithProviders(<Contact />);
    
    const typeSelect = screen.getByLabelText(/Type de message/i);
    const messageInput = screen.getByLabelText(/Message/i) as HTMLTextAreaElement;
    
    // Initial placeholder for feedback
    expect(messageInput.placeholder).toContain('commentaires');
    
    // Change to bug
    fireEvent.change(typeSelect, { target: { value: 'bug' } });
    expect(messageInput.placeholder).toContain('bug');
  });

  it('submits form successfully and shows success message', async () => {
    (contactService.sendContactMessage as Mock).mockResolvedValue(undefined);
    
    renderWithProviders(<Contact />);
    
    const subjectInput = screen.getByLabelText(/Sujet/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Envoyer le message/i });
    
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(contactService.sendContactMessage).toHaveBeenCalledWith({
        name: 'testuser',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        type: 'feedback',
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Message envoyé avec succès/i)).toBeInTheDocument();
    });
  });

  it('shows error message when submission fails', async () => {
    (contactService.sendContactMessage as Mock).mockRejectedValue(new Error('Network error'));
    
    renderWithProviders(<Contact />);
    
    const subjectInput = screen.getByLabelText(/Sujet/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Envoyer le message/i });
    
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Une erreur s'est produite/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    (contactService.sendContactMessage as Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    renderWithProviders(<Contact />);
    
    const subjectInput = screen.getByLabelText(/Sujet/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Envoyer le message/i });
    
    fireEvent.change(subjectInput, { target: { value: 'Test' } });
    fireEvent.change(messageInput, { target: { value: 'Test' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('clears subject and message fields after successful submission', async () => {
    (contactService.sendContactMessage as Mock).mockResolvedValue(undefined);
    
    renderWithProviders(<Contact />);
    
    const subjectInput = screen.getByLabelText(/Sujet/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/Message/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /Envoyer le message/i });
    
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });

  it('keeps name and email filled after successful submission', async () => {
    (contactService.sendContactMessage as Mock).mockResolvedValue(undefined);
    
    renderWithProviders(<Contact />);
    
    const nameInput = screen.getByLabelText(/Nom/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const subjectInput = screen.getByLabelText(/Sujet/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Envoyer le message/i });
    
    fireEvent.change(subjectInput, { target: { value: 'Test' } });
    fireEvent.change(messageInput, { target: { value: 'Test' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput.value).toBe('testuser');
      expect(emailInput.value).toBe('test@example.com');
    });
  });

  it('has all three type options in the dropdown', () => {
    renderWithProviders(<Contact />);
    
    const typeSelect = screen.getByLabelText(/Type de message/i);
    const options = Array.from(typeSelect.querySelectorAll('option'));
    
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("Retour d'expérience");
    expect(options[1]).toHaveTextContent('Signaler un bug');
    expect(options[2]).toHaveTextContent('Question');
  });
});