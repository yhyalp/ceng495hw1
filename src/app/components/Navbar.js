"use client";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav>
      <h1>E-Commerce App</h1>
      {session ? (
        <>
          <p>Welcome, {session.user.username}</p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}
