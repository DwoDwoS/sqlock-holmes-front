import { createContext } from 'react';
import type { NotificationContextValue } from '../types/notifications';

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);