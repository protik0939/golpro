import React from 'react'
import AuthorPage from './(components)/AuthorPage'

export type paramsType = Promise<{ authorId: string }>;

export default async function page(props: { params: paramsType }) {
  const { authorId } = await props.params;
  return (
    <div className='pt-20'>
      <AuthorPage authorId={authorId} />
    </div>
  )
}
