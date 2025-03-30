import React from 'react'
import AboutUs from './(components)/AboutUs'


export async function generateMetadata(){
  return {
    title: 'About Us | GolPro',
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
        <div className='pt-16 w-full flex items-center justify-center'>
            <AboutUs />
        </div>
    )
}
