"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch user session only on the client
  const session = typeof window !== "undefined" ? useSession() : null;

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  useEffect(() => {
    if (session?.data) {
      setUser(session.data.user);
    }
  }, [session]);

  const filteredItems = category ? items.filter(item => item.category === category) : items;

  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ccc" }}>
        <h2>E-Commerce App</h2>
        <div>
          {user ? (
            <>
              <span>Welcome, {user.username}!</span> &nbsp;
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

      {/* Category Filter */}
      <h1>Welcome to the E-Commerce App</h1>
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
          <li key={item._id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
