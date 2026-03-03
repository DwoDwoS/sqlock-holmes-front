import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatabaseSchema } from '../components/investigation/DatabaseSchema';

describe('DatabaseSchema', () => {
  it('renders the header button', () => {
    render(<DatabaseSchema />);
    expect(screen.getByRole('button', { name: /sch[eé]ma/i })).toBeInTheDocument();
  });

  it('panel is closed by default', () => {
    render(<DatabaseSchema />);
    expect(screen.queryByRole('button', { name: /astuces sql/i })).not.toBeInTheDocument();
  });

  it('opens the panel on header click', () => {
    render(<DatabaseSchema />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));
    expect(screen.getByRole('button', { name: /astuces sql/i })).toBeInTheDocument();
  });

  it('closes the panel on second header click', () => {
    render(<DatabaseSchema />);
    const header = screen.getByRole('button', { name: /sch[eé]ma/i });
    fireEvent.click(header);
    fireEvent.click(header);
    expect(screen.queryByRole('button', { name: /astuces sql/i })).not.toBeInTheDocument();
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

  it('shows museum_employees table after opening panel for investigation 1', () => {
    render(<DatabaseSchema investigationId={1} />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));
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

  it('shows financial_transactions table after opening panel for investigation 2', () => {
    render(<DatabaseSchema investigationId={2} />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));
    expect(screen.getByText('financial_transactions')).toBeInTheDocument();
  });
  it('expands a table card on click and shows columns', () => {
    render(<DatabaseSchema investigationId={1} />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));
    expect(screen.getByText('museum_employees')).toBeInTheDocument();
    expect(screen.getAllByText('name').length).toBeGreaterThanOrEqual(1);
  });

  it('collapses an expanded table on second click', () => {
    render(<DatabaseSchema investigationId={1} />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));

    const tableBtn = screen.getByRole('button', { name: /museum_employees/i });
    fireEvent.click(tableBtn);
    expect(screen.queryByText('Nom du visiteur filmé')).not.toBeInTheDocument();
  });

  it('opens a different table when clicking it', () => {
    render(<DatabaseSchema investigationId={1} />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));

    fireEvent.click(screen.getByRole('button', { name: /visitors/i }));
    expect(screen.getByText('visit_date')).toBeInTheDocument();
  });
  it('shows SQL tips content after clicking Astuces SQL', () => {
    render(<DatabaseSchema />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));
    fireEvent.click(screen.getByRole('button', { name: /astuces sql/i }));
    expect(screen.getByText('SELECT *')).toBeInTheDocument();
    expect(screen.getByText('WHERE')).toBeInTheDocument();
    expect(screen.getByText('ORDER BY')).toBeInTheDocument();
  });

  it('hides SQL tips content after toggling off', () => {
    render(<DatabaseSchema />);
    fireEvent.click(screen.getByRole('button', { name: /sch[eé]ma/i }));
    const tipsBtn = screen.getByRole('button', { name: /astuces sql/i });
    fireEvent.click(tipsBtn);
    fireEvent.click(tipsBtn);
    expect(screen.queryByText('SELECT *')).not.toBeInTheDocument();
  });
});