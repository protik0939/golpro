import React from 'react'
import ContentShow from './(components)/ContentShow'

export type paramsType = Promise<{ cId: string }>;

export default async function page(props: { params: paramsType }) {
  const { cId } = await props.params;
  return (
    <ContentShow cId={cId} />
  )
}
