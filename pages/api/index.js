import { useEffect, useState } from 'react';

function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    }
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Welcome to the E-commerce Store</h1>
      <div>
        <h2>Items for Sale</h2>
        <ul>
          {items.map(item => (
            <li key={item._id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>{item.price}</p>
              <p>Category: {item.category}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;

