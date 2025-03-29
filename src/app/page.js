"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session:", session);
  }, [session]);

  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ccc" }}>
        <h2>E-Commerce App</h2>
        <div>
          {status === "loading" ? (
            <p>Loading...</p>
          ) : session ? (
            <>
              <span>Welcome, {session.user?.name || session.user?.email}!</span> &nbsp;
              <button onClick={() => signOut()} style={{ marginLeft: "10px" }}>Sign Out</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/register")}>Register</button> &nbsp;
              <button onClick={() => signIn()}>Sign In</button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
