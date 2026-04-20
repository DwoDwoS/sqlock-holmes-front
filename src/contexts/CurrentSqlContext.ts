import { createContext } from 'react';

export interface CurrentSqlContextValue {
  getCurrentSql: () => string | null;
  setCurrentSql: (sql: string | null) => void;
}

export const CurrentSqlContext = createContext<CurrentSqlContextValue>({
  getCurrentSql: () => null,
  setCurrentSql: () => {},
});
