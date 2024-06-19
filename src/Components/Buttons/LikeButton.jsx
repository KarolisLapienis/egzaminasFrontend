import React, { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { AiFillLike } from "react-icons/ai";

export default function LikeButton({ adId }) {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchLikesCount();
    checkIfLiked();
  }, []);

  const fetchLikesCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/likes/ad/${adId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likes.length);
      } else {
        console.error(`Failed to fetch likes count`);
      }
    } catch (error) {
      console.error(`Failed to fetch likes count: ${error.message}`);
    }
  };

  const checkIfLiked = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/likes/ad/${adId}/isLiked`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
      } else {
        console.error(`Failed to check like status`);
      }
    } catch (error) {
      console.error(`Failed to check like status: ${error.message}`);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/likes/ad/${adId}`,
        {
          method: isLiked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setLikesCount((prevCount) => prevCount + (isLiked ? -1 : 1));
        setIsLiked(!isLiked);
      } else {
        console.error(`Failed to ${isLiked ? "unlike" : "like"} the ad`);
      }
    } catch (error) {
      console.error(
        `Failed to ${isLiked ? "unlike" : "like"} the ad: ${error.message}`,
      );
    }
  };

  return (
    <Button
      onClick={handleLikeToggle}
      size="sm"
      variant="outline"
      color={isLiked ? "red" : "darkgray"}
      rightSection={<AiFillLike />}
    >
      {likesCount}
    </Button>
  );
}
