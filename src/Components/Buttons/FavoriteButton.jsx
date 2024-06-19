import React, { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { AiFillStar } from "react-icons/ai";

export default function FavoriteButton({ buttonText, adId }) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    checkIfFavorited();
  }, []);

  const checkIfFavorited = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/favorites/ad/${adId}/isFavorited`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      } else {
        console.error(`Failed to check favorite status`);
      }
    } catch (error) {
      console.error(`Failed to check favorite status: ${error.message}`);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/favorites/ad/${adId}`,
        {
          method: isFavorited ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setIsFavorited(!isFavorited);
      } else {
        console.error(
          `Failessssd to ${isFavorited ? "unfavorite" : "favorite"} the ad ${
            response.status
          }`,
        );
      }
    } catch (error) {
      console.error(
        `Failed to ${isFavorited ? "unfavorite" : "favorite"} the ad: ${
          error.message
        }`,
      );
    }
  };

  return (
    <Button
      onClick={handleFavoriteToggle}
      size="sm"
      variant="outline"
      color={isFavorited ? "orange" : "darkgray"}
      rightSection={<AiFillStar />}
    >
      {buttonText}
    </Button>
  );
}
