import React, { createContext, useContext, useCallback, useState } from 'react';

interface LeaderboardRefreshContextType {
  triggerRefresh: () => void;
  refreshToken: number;
}

const LeaderboardRefreshContext = createContext<LeaderboardRefreshContextType | undefined>(undefined);

export const LeaderboardRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshToken(prev => prev + 1);
  }, []);

  return (
    <LeaderboardRefreshContext.Provider value={{ triggerRefresh, refreshToken }}>
      {children}
    </LeaderboardRefreshContext.Provider>
  );
};

export const useLeaderboardRefresh = () => {
  const context = useContext(LeaderboardRefreshContext);
  if (!context) {
    throw new Error('useLeaderboardRefresh must be used within LeaderboardRefreshProvider');
  }
  return context;
};