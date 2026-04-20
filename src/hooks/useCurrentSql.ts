import { useContext } from 'react';
import { CurrentSqlContext } from '../contexts/CurrentSqlContext';

export const useCurrentSql = () => useContext(CurrentSqlContext);
