import React, { useEffect, useState } from "react";
import styles from "./BlockUserPage.module.css";
import {
  Card,
  Button,
  Modal,
  Group,
  Text,
  Container,
  TextInput,
  Title,
} from "@mantine/core";

const BlockUserPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users.");
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;

    console.log("Deleting user with ID:", selectedUser);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/users/${selectedUser}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} - ${errorMessage}`
        );
      }
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUser)
      );
      setModalOpened(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user: " + error.message);
    }
  };

  const openModal = (userId) => {
    setSelectedUser(userId);
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
    setSelectedUser(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Container fluid>
        <Title align="center" mb="lg">
          Block Users
        </Title>
        <TextInput
          mb="lg"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {error && <p>{error}</p>}
        <div className={styles.usersList}>
          {filteredUsers.length === 0 ? (
            <p>No users available</p>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user._id} shadow="sm" padding="lg">
                <Text>
                  {user.name} ({user.email})
                </Text>
                <Button mt="sm" color="red" onClick={() => openModal(user._id)}>
                  Block
                </Button>
              </Card>
            ))
          )}
        </div>

        <Modal opened={modalOpened} onClose={closeModal} title="Confirm Block">
          <Text>Are you sure you want to block this user?</Text>
          <Group position="apart" mt="md">
            <Button variant="default" onClick={closeModal}>
              Cancel
            </Button>
            <Button color="red" onClick={handleBlockUser}>
              Block
            </Button>
          </Group>
        </Modal>
      </Container>
    </>
  );
};

export default BlockUserPage;
