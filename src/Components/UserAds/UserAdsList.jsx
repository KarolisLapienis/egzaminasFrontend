import React, { useEffect, useState, useCallback } from "react";
import AdCard from "../Card/AdCard";
import {
  Container,
  Title,
  TextInput,
  Button,
  Loader,
  Notification,
} from "@mantine/core";
import styles from "./UserAdsList.module.css";
import EditAdModal from "./EditAdModal";

const UserAdsList = ({ selectedCategory }) => {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAd, setEditingAd] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchUserAds = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userId = user ? user._id : null;

    if (!token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/ads/user/${userId}`,
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
        setError("Failed to fetch user ads");
      }
    } catch (error) {
      setError("Error fetching user ads");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserAds();
  }, [fetchUserAds]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSave = async (updatedAd) => {
    setAds((prevAds) =>
      prevAds.map((ad) => (ad._id === updatedAd._id ? updatedAd : ad))
    );

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/ads/${updatedAd._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedAd),
        }
      );
      if (!response.ok) {
        console.error("Failed to update ad:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating ad:", error);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setEditingAd(null);
  };

  const handleConfirmEdit = (updatedAd) => {
    handleSave(updatedAd);
    handleModalClose();
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
    <>
      <Container fluid>
        <Title align="center" mb="lg">
          My Ads
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
                  <AdCard ad={ad} onSave={handleSave} />
                  <Button onClick={() => handleEdit(ad)} variant="outline">
                    Edit
                  </Button>
                </div>
              ))
            ) : (
              <p>No ads found</p>
            )}
          </div>
        )}
        {showEditModal && editingAd && (
          <EditAdModal
            ad={editingAd}
            onSave={handleSave}
            onClose={handleModalClose}
            onConfirmEdit={handleConfirmEdit}
            showEditModal={showEditModal}
          />
        )}
      </Container>
    </>
  );
};

export default UserAdsList;
