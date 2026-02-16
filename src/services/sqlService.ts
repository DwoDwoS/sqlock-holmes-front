import api from '../api/api';

export interface ExecuteSQLRequest {
  investigationId: number;
  sql: string;
}

export interface ExecuteSQLResponse {
  columns?: string[];
  rows?: unknown[];
  affectedRows?: number;
  error?: string;
}

export class SQLService {
  static async executeSQL(payload: ExecuteSQLRequest): Promise<ExecuteSQLResponse> {
    const response = await api.post('/sql/execute', payload);
    return response.data;
  }
}