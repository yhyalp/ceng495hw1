"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userId, setUserId] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched item:", data);
        setItem(data);
      });

    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch reviews, status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched reviews:", data);
        setReviews(data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setUserId(data?.user?.id));
  }, [id]);

  async function submitRating() {
    if (!userId) {
      alert("You must be logged in to rate.");
      return;
    }

    const response = await fetch(`/api/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id, userId, rating: rating }),
    });

    if (!response.ok) {
      alert("Error submitting rating. Please try again.");
      return;
    }

    alert("Rating submitted successfully.");
    refreshItemData();
  }

  async function submitReview() {
    if (!userId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const response = await fetch(`/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id, userId, text: review }),
    });

    if (!response.ok) {
      alert("Error submitting review. Please try again.");
      return;
    }

    alert("Review submitted successfully.");
    refreshItemData();
  }

  function refreshItemData() {
    fetch(`/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data));
  }

  const filteredReviews = reviews.filter((r) => item?.reviews?.includes(r._id));

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Price: ${item.price}</p>
      <p>Seller: {item.seller}</p>
      <p>Category: {item.category}</p>
      <p>Average Rating: {item.averageRating ? item.averageRating.toFixed(1) : "No ratings yet"}</p>

      {/* */}
      <h3>Attributes:</h3>
      <ul>
        {item.batteryLife && item.category === "GPS Sport Watches" && (
          <li>Battery Life: {item.batteryLife} hours</li>
        )}
        {item.age && ["Antique Furniture", "Vinyls"].includes(item.category) && (
          <li>Age: {item.age} years</li>
        )}
        {item.size && item.category === "Running Shoes" && (
          <li>Size: {item.size}</li>
        )}
        {item.material && ["Antique Furniture", "Running Shoes"].includes(item.category) && (
          <li>Material: {item.material}</li>
        )}
        {/* */}
        {item.attributes &&
          Object.keys(item.attributes).map((key) => (
            <li key={key}>
              {key}: {item.attributes[key]}
            </li>
          ))}
      </ul>

      <h3>Rate this item:</h3>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[...Array(10)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <button onClick={submitRating}>Submit Rating</button>

      <h3>Write a Review:</h3>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
      />
      <button onClick={submitReview}>Submit Review</button>

      <h3>Reviews:</h3>
      <ul>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <li key={r._id}>
              <p>{r.text}</p>
            </li>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </ul>
    </div>
  );
}
