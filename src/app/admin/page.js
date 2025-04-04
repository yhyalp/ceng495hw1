"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    seller: "",
    category: "",
    attributes: {},
  });

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    isAdmin: false,
  });

  const categories = {
    "GPS Sport Watches": ["batteryLife"],
    "Antique Furniture": ["age", "material"],
    "Vinyls": ["age"],
    "Running Shoes": ["size", "material"],
  };

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  if (status === "loading") return <p>Loading...</p>;

  if (!session?.user?.isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  function handleAttributeChange(attr, value) {
    setNewItem((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: value },
    }));
  }

  async function addItem() {
    const response = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    const data = await response.json();
    setItems([...items, data]);
  }

  async function removeItem(id) {
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    setItems(items.filter((item) => item._id !== id));
  }

  async function addUser() {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    setUsers([...users, data]);
  }

  async function removeUser(id) {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  
    if (response.ok) {
      setUsers(users.filter((user) => user._id !== id));
    } else {
      console.error("Failed to delete user:", await response.json());
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Section for Adding Items */}
      <h2>Add Item</h2>
      <input type="text" placeholder="Name" onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
      <textarea placeholder="Description" onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
      <input type="number" placeholder="Price" onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
      <input type="text" placeholder="Seller" onChange={(e) => setNewItem({ ...newItem, seller: e.target.value })} />
      
      <select onChange={(e) => setNewItem({ ...newItem, category: e.target.value, attributes: {} })}>
        <option value="">Select Category</option>
        {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {categories[newItem.category]?.map((attr) => (
        <input
          key={attr}
          type="text"
          placeholder={attr}
          onChange={(e) => handleAttributeChange(attr, e.target.value)}
        />
      ))}

      <button onClick={addItem}>Add Item</button>

      <h2>Existing Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price} - {item.category}
            <button onClick={() => removeItem(item._id)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Section for Managing Users */}
      <h2>Add User</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <label>
        Admin:
        <input
          type="checkbox"
          onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
        />
      </label>
      <button onClick={addUser}>Add User</button>

      <h2>Existing Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={user._id || index}>  {/**/}
            {user.username} {user.isAdmin ? "(Admin)" : ""}
            <button onClick={() => removeUser(user._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
