import React, { useEffect } from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router'

export default () => {
  const { width, height } = useWindowSize()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => router.push('/dashboard'), 3000);
  })
  return (
    <Confetti
      width={width}
      height={height}
      color='#00FF00'
      recycle={false}
    />
  )
}