import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
const Navbar = () => {
    const { data: session } = useSession()
    const user:User = session?.user as User

  return (
    <nav>
    <div></div>
    </nav>
  )
}

export default Navbar