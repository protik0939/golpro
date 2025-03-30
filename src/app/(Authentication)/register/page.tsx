import React from 'react'
import Register from './(components)/Register'

export async function generateMetadata(){
    return {
      title: 'Register | GolPro',
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
        <Register />
    )
}
