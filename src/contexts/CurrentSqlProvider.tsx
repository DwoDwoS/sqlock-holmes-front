import React, { useMemo, useRef, type ReactNode } from 'react';
import { CurrentSqlContext, type CurrentSqlContextValue } from './CurrentSqlContext';

interface Props {
  children: ReactNode;
}

export const CurrentSqlProvider: React.FC<Props> = ({ children }) => {
  const ref = useRef<string | null>(null);

  const value = useMemo<CurrentSqlContextValue>(
    () => ({
      getCurrentSql: () => ref.current,
      setCurrentSql: (sql) => {
        ref.current = sql;
      },
    }),
    [],
  );

  return (
    <CurrentSqlContext.Provider value={value}>
      {children}
    </CurrentSqlContext.Provider>
  );
};