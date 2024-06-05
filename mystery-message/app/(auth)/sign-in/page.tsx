"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"


const SignInPage = () => {

  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )

  // return (
  //   <div>
  //     This is sign in page
  //   </div>
  // )
}

export default SignInPage
