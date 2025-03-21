import React from 'react'
import ContentShow from './(components)/ContentShow'

export default function page({ params }: { params: { cId: string } }) {
  return (
    <ContentShow cId={params.cId}/>
  )
}
