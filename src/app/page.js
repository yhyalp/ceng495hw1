"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api")  // ✅ Correct API endpoint
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div>
      <h1>Welcome to the E-Commerce App</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
