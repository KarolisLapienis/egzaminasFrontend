import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Text,
  Paper,
} from "@mantine/core";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }
      const data = await response.json();
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <Container>
        <Title mt={50}>Register</Title>
        {error && <Text color="red">{error}</Text>}
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleRegister}>
            <TextInput
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mt="md"
            />
            <Button type="submit" fullWidth mt="xl">
              Register
            </Button>
            <Button
              variant="default"
              fullWidth
              mt="xl"
              onClick={handleBackToLogin}
            >
              Back to Login
            </Button>

            <Button
              variant="default"
              fullWidth
              mt="md"
              onClick={handleBackToHome}
            >
              Home
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default RegisterPage;
