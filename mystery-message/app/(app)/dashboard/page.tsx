"use client"
import { useSession, signIn, signOut } from "next-auth/react"


const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <>
      {
        session ? (
          <>
            Signed in as {session?.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : <p>You are not signed in</p>
      }
    </>
  );
};

export default DashboardPage