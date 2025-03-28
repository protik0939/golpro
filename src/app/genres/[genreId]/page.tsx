import React from 'react'
import AGenre from './(components)/AGenre'

export type paramsType = Promise<{ genreId: string }>;

export default async function page(props: { params: paramsType }) {

  const { genreId } = await props.params;

  return (
    <div className="pt-20">
      <AGenre genreId={genreId} />
    </div>
  )
}
