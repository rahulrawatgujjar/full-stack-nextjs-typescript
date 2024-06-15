"use client"
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";


const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col gap-2 sm:flex-row items-center justify-between">
        <a className="text-xl font-bold" href="#">Mystery Message</a>
        {
          session ?
            (
              <>
                <span className="mr-4">Hello, {user.username}</span>
                <Button className="w-full sm:w-auto" onClick={() => signOut()}>Log Out</Button>
              </>
            ) :
            (
              <Link href="/sign-in">
                <Button>Login</Button>
              </Link>
            )
        }
      </div>
    </nav>
  )
}

export default Navbar
