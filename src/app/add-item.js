// /app/admin/add-item.js
import { useState } from "react";

export default function AddItem() {
  const [itemDetails, setItemDetails] = useState({
    name: '',
    description: '',
    price: '',
    seller: '',
    image: '',
    batteryLife: '',
    age: '',
    size: '',
    material: '',
  });

  const handleChange = (e) => {
    setItemDetails({
      ...itemDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemDetails),
    });

    if (res.ok) {
      alert('Item added successfully!');
    } else {
      alert('Failed to add item');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render fields for item details */}
      <input type="text" name="name" placeholder="Item Name" onChange={handleChange} />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} />
      <input type="text" name="seller" placeholder="Seller" onChange={handleChange} />
      <input type="text" name="image" placeholder="Image URL" onChange={handleChange} />
      <input type="text" name="batteryLife" placeholder="Battery Life" onChange={handleChange} />
      <input type="number" name="age" placeholder="Age" onChange={handleChange} />
      <input type="text" name="size" placeholder="Size" onChange={handleChange} />
      <input type="text" name="material" placeholder="Material" onChange={handleChange} />
      <button type="submit">Add Item</button>
    </form>
  );
}
