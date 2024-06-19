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

function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleBackToRegister = () => {
    navigate("/register");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      const { user, token } = data;
      if (!user) {
        throw new Error("User data is missing in response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); 
      
      if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error", error);
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <>
      <Container>
        <Title mt={50}>Login</Title>
        {error && <Text color="red">{error}</Text>}
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleLogin}>
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
              Login
            </Button>
            <Button
              variant="default"
              fullWidth
              mt="xl"
              onClick={handleBackToHome}
            >
              Home
            </Button>
            <Button
              variant="default"
              fullWidth
              mt="md"
              onClick={handleBackToRegister}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default LoginPage;
