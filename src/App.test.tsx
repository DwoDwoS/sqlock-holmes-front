import { render, screen } from '@testing-library/react';
import App from './App';

test('renders heading and initial count button', () => {
  render(<App />);
  expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
  const btn = screen.getByRole('button', { name: /count is 0/i });
  expect(btn).toBeInTheDocument();
});