'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BookmarkContextType {
  bookmarks: string[];
  toggleBookmark: (contentId: string) => void;
  isBookmarked: (contentId: string) => boolean;
  isLoading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);  // Adding loading state
  const { data: session, status } = useSession();

  useEffect(() => {
    // Fetch bookmarks when session is available
    const fetchBookmarks = async () => {
      if (!session) {
        console.log("User not logged in");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/bookmark/bookmarkget", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setBookmarks(data.contentIds || []);
        } else {
          console.error("Error fetching bookmarks:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchBookmarks();
    }
  }, [session, status]);  // Ensure it re-fetches when session or status changes

  const toggleBookmark = async (contentId: string) => {
    if (!session) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await fetch('/api/bookmark/bookmarkpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId }),
      });

      const data = await response.json();
      if (response.ok) {
        setBookmarks((prev) =>
          prev.includes(contentId) ? prev.filter((id) => id !== contentId) : [...prev, contentId]
        );
      } else {
        console.error('Error toggling bookmark:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isBookmarked = (contentId: string) => bookmarks.includes(contentId);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, isLoading }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};
