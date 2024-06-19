import React, { useEffect, useState, useCallback } from "react";
import AdCard from "../Card/AdCard";
import {
  Container,
  Title,
  TextInput,
  Loader,
  Notification,
} from "@mantine/core";
import styles from "./FavoriteAdsList.module.css";

const FavoriteAdsList = ({ selectedCategory }) => {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoriteAds = useCallback(async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user._id : null;

    try {
      const response = await fetch(
        `http://localhost:5000/api/ads/favorites/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAds(data.ads);
      } else {
        setError("Failed to fetch favorite ads");
      }
    } catch (error) {
      setError("Error fetching favorite ads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavoriteAds();
  }, [fetchFavoriteAds]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredAds = ads.filter((ad) => {
    const matchesSearchQuery = ad.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? String(ad.category_id._id) === String(selectedCategory)
      : true;
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <Container fluid>
      <Title align="center" mb="lg">
        Favorite Ads
      </Title>
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className={styles.search}
      />
      {loading ? (
        <Loader />
      ) : error ? (
        <Notification color="red" onClose={() => setError(null)}>
          {error}
        </Notification>
      ) : (
        <div className={styles.adsList}>
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
              <div key={ad._id}>
                <AdCard ad={ad} />
              </div>
            ))
          ) : (
            <p>No ads found</p>
          )}
        </div>
      )}
    </Container>
  );
};

export default FavoriteAdsList;
