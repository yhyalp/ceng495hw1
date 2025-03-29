"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const filteredItems = category ? items.filter(item => item.category === category) : items;

  return (
    <div>
      <h1>Welcome-- to the E-Commerce App</h1>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Vinyls">Vinyls</option>
        <option value="Antique Furniture">Antique Furniture</option>
        <option value="GPS Sport Watches">GPS Sport Watches</option>
        <option value="Running Shoes">Running Shoes</option>
      </select>
      <ul>
        {filteredItems.map((item) => (
          <li key={item._id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
