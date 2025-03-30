import React from 'react'
import Bookmarks from './(Components)/Bookmarks'


export async function generateMetadata(){
  return {
    title: 'Bookmarks | GolPro',
    description: 'GolPro is a platform for stories, audiobooks, podcasts, and more.',
    keywords: 'GolPro, story, ebook, audiobooks, podcasts, music, entertainment',
    openGraph: {
      images: [
        {
          url: '/src/app/assets/golproseo.webp',
          width: 1200,
          height: 627,
          alt: 'GolPro',
        },
      ],
    },
  };
}

export default function page() {
    return (
        <div className="pt-20">
            <Bookmarks />
        </div>
    )
}
