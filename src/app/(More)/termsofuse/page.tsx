import React from 'react'
import TermsOfUse from './(components)/TermsOfUse';


export async function generateMetadata(){
  return {
    title: 'Terms Of Use | GolPro',
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
            <TermsOfUse />
        </div>
    );
}
