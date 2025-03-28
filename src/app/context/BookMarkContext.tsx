'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BookmarkContextType {
  bookmarks: string[];
  toggleBookmark: (contentId: string) => void;
  isBookmarked: (contentId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!session) {
        console.log("User not logged in");
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
      }
    };

    fetchBookmarks();
  }, [session]);

  const toggleBookmark = async (contentId: string) => {
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
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
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
