import { useNotifications } from './useNotifications';

export const useConfirm = () => {
  const { showConfirm } = useNotifications();
  return showConfirm;
};
