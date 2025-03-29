"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      <button>Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price} <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
