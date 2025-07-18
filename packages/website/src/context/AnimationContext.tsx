import React, { createContext, useContext, useState } from 'react';

interface AnimationContextType {
  skipAnimations: boolean;
  setSkipAnimations: (skip: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skipAnimations, setSkipAnimations] = useState(false);

  return (
    <AnimationContext.Provider value={{ skipAnimations, setSkipAnimations }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}; 