import { useState, useEffect } from "react";
import { Modal, TextInput, Text, Button, Group, Paper } from "@mantine/core";
import AdCard from "../Card/AdCard";

export default function CommentsModal({ ad, opened, close, onNewComment }) {
  const [text, setText] = useState(""); // State to store the comment input text
  const [message, setMessage] = useState(""); // State to store error or success message
  const [comments, setComments] = useState([]); // State to store comments

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/comments/ad/${ad._id}`
        );
  
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments.reverse());
        } else {
          setMessage("Failed to fetch comments");
        }
      } catch (error) {
        setMessage(`Failed to fetch comments: ${error.message}`);
      }
    };
    if (opened) {
      fetchComments();
    }
  }, [opened, ad._id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/ad/${ad._id}`
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments.reverse());
      } else {
        setMessage("Failed to fetch comments");
      }
    } catch (error) {
      setMessage(`Failed to fetch comments: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/ad/${ad._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Comment created successfully");
        setText(""); // Clear the text input after submitting
        fetchComments(); // Fetch comments after adding a new comment
        onNewComment(); // to re-render CommentsButton component with updated comment count
      } else {
        setMessage(`${data.error}`);
      }
    } catch (error) {
      setMessage(`Comment creation failed: ${error.message}`);
    }
  };

  return (
    <Modal opened={opened} onClose={close} size="lg">
      <AdCard ad={ad} modalOpen={true} />
      <Modal.Header mt="sm">
        <Modal.Title>{comments.length} Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <TextInput
            data-autofocus
            label="Your comment:"
            placeholder="Type your comment here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            type="submit"
            color="orange"
            variant="default"
            mt="sm"
            mb="lg"
          >
            Submit
          </Button>
          {message && (
            <Text mt="md" c={message.includes("failed") ? "red" : "green"}>
              {message}
            </Text>
          )}
        </form>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Paper key={comment._id} withBorder shadow="md" p="sm" mt="md">
              <Group>
                <div>
                  <Text size="xs" c="dimmed">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Text>
                  <Text size="sm" pt="xs">
                    {comment.user_id.name}:
                  </Text>
                </div>
              </Group>
              <Text pl="lg" pt="xs" size="sm">
                {comment.text}
              </Text>
            </Paper>
          ))
        ) : (
          <Text mt="xs" c="dimmed">
            No comments available.
          </Text>
        )}
      </Modal.Body>
    </Modal>
  );
}
