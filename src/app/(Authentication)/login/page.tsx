import React from 'react'
import Login from './(components)/Login'

export async function generateMetadata(){
  return {
    title: 'Log in | GolPro',
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
        <div>
            <Login />
        </div>
    )
}
