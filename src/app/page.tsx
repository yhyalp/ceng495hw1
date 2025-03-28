import { useEffect, useState } from 'react';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the items from the API route
    const fetchItems = async () => {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data);
    };
    
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Items for Sale</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>{item.price}</p>
            <p>Category: {item.category}</p>
            <img src={item.image} alt={item.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
