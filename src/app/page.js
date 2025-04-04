"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();
  const user = session?.user ?? null;

  useEffect(() => {
    fetch("/api/items")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const filteredItems = category
    ? items.filter((item) => item.category === category)
    : items;

  return (
    <div>
      {/* Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h2>Akcay E-Commerce App</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {status === "loading" ? (
            <p>Loading...</p>
          ) : user ? (
            <>
              <span>
                Welcome, <Link href="/profile">{user.username || user.email}</Link>
              </span>
              {/* Show Admin Page Button if isAdmin is true */}
              {user.isAdmin && (
                <button onClick={() => router.push("/admin")}>Admin Page</button>
              )}
              <button onClick={() => signOut()}>Sign Out</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/register")}>Register</button>
              <button onClick={() => signIn()}>Sign In</button>
            </>
          )}
        </div>
      </nav>

      {/* Category Filter */}
      <h1>Welcome to Akcay E-Commerce App</h1>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Vinyls">Vinyls</option>
        <option value="Antique Furniture">Antique Furniture</option>
        <option value="GPS Sport Watches">GPS Sport Watches</option>
        <option value="Running Shoes">Running Shoes</option>
      </select>

      {/* Items List */}
      <ul>
        {filteredItems.map((item) => (
          <li key={item._id}>
            <Link href={`/items/${item._id}`}>
              {item.name} - ${item.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
