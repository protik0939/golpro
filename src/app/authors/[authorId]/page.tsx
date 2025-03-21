import React from 'react'
import AuthorPage from './(components)/AuthorPage'

export default function page({ params }: { params: { authorId: string } }) {
  return (
    <div className='pt-20'>
      <AuthorPage authorId={params.authorId} />
    </div>
  )
}
