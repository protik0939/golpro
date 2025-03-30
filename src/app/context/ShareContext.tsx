'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the context value
interface ShareContextType {
  sharedContent: { title: string; url: string } | null;
  shareStatus: string;
  handleShareClick: (title: string, url: string) => void;
}

interface ShareProviderProps {
  children: ReactNode;
}

// Create a context with default values
const ShareContext = createContext<ShareContextType | undefined>(undefined);

export const ShareProvider: React.FC<ShareProviderProps> = ({ children }) => {
  const [sharedContent, setSharedContent] = useState<{ title: string; url: string } | null>(null);
  const [shareStatus, setShareStatus] = useState<string>('');

  // Function to handle sharing content
  const handleShareClick = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
        setSharedContent({ title, url });
        setShareStatus('Content shared successfully!');
      } catch (error) {
        setShareStatus('Failed to share content.');
        console.error("Sharing failed", error);
      }
    } else {
      setShareStatus('Web Share API is not supported.');
      console.log("Web Share API is not supported");
    }
  };

  return (
    <ShareContext.Provider value={{ sharedContent, shareStatus, handleShareClick }}>
      {children}
    </ShareContext.Provider>
  );
};

// Custom hook to use ShareContext
export const useShare = (): ShareContextType => {
  const context = useContext(ShareContext);
  if (!context) {
    throw new Error('useShare must be used within a ShareProvider');
  }
  return context;
};
