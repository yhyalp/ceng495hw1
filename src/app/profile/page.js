"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userAttributes, setUserAttributes] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [items, setItems] = useState({});
  const [averageRating, setAverageRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch user data
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setUserAttributes(data))
        .catch((error) => console.error("Error fetching user data:", error));

      // Fetch and filter ratings for the current user
      fetch("/api/ratings")
        .then((res) => res.json())
        .then((data) => {
          console.log("Ratings data:", data); // Check the structure of the response
          
          // Check if the response is an array
          if (Array.isArray(data)) {
            const userRatings = data.filter((r) => r.userId._id === session.user.id);
            setRatings(userRatings);
            // Calculate average rating
            const totalRating = userRatings.reduce((acc, rating) => acc + rating.rating, 0);
            const avgRating = userRatings.length > 0 ? totalRating / userRatings.length : null;
            setAverageRating(avgRating);
          } else {
            console.error("Ratings data is not an array:", data);
          }
        })
        .catch((error) => console.error("Error fetching ratings:", error));

      // Fetch user's reviews and items
      fetch("/api/reviews")
        .then((res) => res.json())
        .then((data) => {
          const userReviews = data.filter((r) => r.userId._id === session.user.id);
          setReviews(userReviews);

          // Fetch items once ratings are available too
          const ratedItemIds = ratings.map((r) => r.itemId);
          const reviewedItemIds = userReviews.map((r) => r.itemId);
          const allItemIds = [...new Set([...ratedItemIds, ...reviewedItemIds])];
          fetchItems(allItemIds);
        })
        .catch((error) => console.error("Error fetching reviews:", error));
    } else {
      router.push("/");
    }
  }, [status, session, router]);

  function fetchItems(itemIds) {
    Promise.all(
      itemIds.map((id) => fetch(`/api/items/${id}`).then((res) => res.json()))
    )
      .then((itemsData) => {
        const itemMap = {};
        itemsData.forEach((item) => {
          itemMap[item._id] = item;
        });
        setItems((prev) => ({ ...prev, ...itemMap }));
      })
      .catch((error) => console.error("Error fetching item details:", error));
  }

  if (status === "loading" || !userAttributes) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div>
      <h1>
  {userAttributes?.username ||
    (reviews[0]?.userId?.username || ratings[0]?.userId?.username) ||
    "User"}'s Profile
</h1>

      {/* Display Average Rating */}
      <h3>Average Rating Given:</h3>
      <p>{averageRating !== null ? averageRating : "No ratings submitted yet."}</p>

      {/* Display Individual Ratings with Usernames */}
      <h3>Ratings Given:</h3>
      {ratings.length > 0 ? (
        <ul>
          {ratings.map((rating, index) => (
            <li key={index}>
            <strong>Item:</strong> {items[rating.itemId]?.name || "Loading..."} - 
            <strong>Rating:</strong> {rating.rating}/10
          </li>
          ))}
        </ul>
      ) : (
        <p>No ratings submitted yet.</p>
      )}

      {/* Display Reviews with Usernames */}
      <h3>Reviews:</h3>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, index) => {
            const item = items[review.itemId];
            return (
              <li key={index}>
                <strong>Item:</strong> {item ? item.name : "Loading..."} -  
                <strong> Reviewed by:</strong> {review.userId.username} -  
                <strong> Review:</strong> {review.text}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No reviews submitted yet.</p>
      )}
    </div>
  );
}
