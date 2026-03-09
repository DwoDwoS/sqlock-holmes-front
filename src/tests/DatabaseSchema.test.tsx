import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatabaseSchema } from '../components/investigation/DatabaseSchema';

describe('DatabaseSchema', () => {
  it('renders the static header title', () => {
    render(<DatabaseSchema />);
    expect(screen.getByText(/Sch[eé]ma de base de donn[eé]es/i)).toBeInTheDocument();
  });

  it('panel is open by default', () => {
    render(<DatabaseSchema />);
    expect(screen.getByRole('button', { name: /astuces sql/i })).toBeInTheDocument();
  });

  it('SQL tips content is visible by default', () => {
    render(<DatabaseSchema />);
    expect(screen.getByText('SELECT *')).toBeInTheDocument();
  });

  it('SQL tips content is hidden after toggling off', () => {
    render(<DatabaseSchema />);
    const tipsBtn = screen.getByRole('button', { name: /astuces sql/i });
    fireEvent.click(tipsBtn);
    expect(screen.queryByText('SELECT *')).not.toBeInTheDocument();
  });

  it('shows default schema label (Meurtre au Manoir) when no investigationId', () => {
    render(<DatabaseSchema />);
    expect(screen.getByText('Meurtre au Manoir')).toBeInTheDocument();
  });

  it('shows the correct table count badge for default schema', () => {
    render(<DatabaseSchema />);
    expect(screen.getByText('5 tables')).toBeInTheDocument();
  });

  it('shows correct label for investigation 1', () => {
    render(<DatabaseSchema investigationId={1} />);
    expect(screen.getByText('Le vol du musée')).toBeInTheDocument();
  });

  it('shows 4 tables for investigation 1', () => {
    render(<DatabaseSchema investigationId={1} />);
    expect(screen.getByText('4 tables')).toBeInTheDocument();
  });

  it('shows museum_employees table for investigation 1', () => {
    render(<DatabaseSchema investigationId={1} />);
    expect(screen.getByText('museum_employees')).toBeInTheDocument();
  });

  it('shows correct label for investigation 2', () => {
    render(<DatabaseSchema investigationId={2} />);
    expect(screen.getByText('Fraudes corporatives')).toBeInTheDocument();
  });

  it('shows 4 tables for investigation 2', () => {
    render(<DatabaseSchema investigationId={2} />);
    expect(screen.getByText('4 tables')).toBeInTheDocument();
  });

  it('shows financial_transactions table for investigation 2', () => {
    render(<DatabaseSchema investigationId={2} />);
    expect(screen.getByText('financial_transactions')).toBeInTheDocument();
  });

  it('first table is expanded by default and shows columns', () => {
    render(<DatabaseSchema investigationId={1} />);
    expect(screen.getByText('museum_employees')).toBeInTheDocument();
    expect(screen.getAllByText('name').length).toBeGreaterThanOrEqual(1);
  });

  it('collapses an expanded table on click', () => {
    render(<DatabaseSchema investigationId={1} />);
    const tableBtn = screen.getByRole('button', { name: /museum_employees/i });
    fireEvent.click(tableBtn);
    expect(screen.queryByText('Nom du visiteur filmé')).not.toBeInTheDocument();
  });

  it('opens a different table when clicking it', () => {
    render(<DatabaseSchema investigationId={1} />);
    fireEvent.click(screen.getByRole('button', { name: /visitors/i }));
    expect(screen.getByText('visit_date')).toBeInTheDocument();
  });

  it('shows SQL tips content after toggling back on', () => {
    render(<DatabaseSchema />);
    const tipsBtn = screen.getByRole('button', { name: /astuces sql/i });
    fireEvent.click(tipsBtn); // ferme
    fireEvent.click(tipsBtn); // rouvre
    expect(screen.getByText('SELECT *')).toBeInTheDocument();
    expect(screen.getByText('WHERE')).toBeInTheDocument();
    expect(screen.getByText('ORDER BY')).toBeInTheDocument();
  });

  it('hides SQL tips content after toggling off', () => {
    render(<DatabaseSchema />);
    const tipsBtn = screen.getByRole('button', { name: /astuces sql/i });
    fireEvent.click(tipsBtn);
    expect(screen.queryByText('SELECT *')).not.toBeInTheDocument();
  });
});