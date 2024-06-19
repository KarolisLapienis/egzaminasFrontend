/** @format */

import React, { useState } from "react";
import { Modal, TextInput, Button } from "@mantine/core";

const EditAdModal = ({ ad, onSave, onClose, onConfirmEdit, showEditModal }) => {
  const [editedAd, setEditedAd] = useState(ad);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAd({ ...editedAd, [name]: value });
  };

  const handleSaveChanges = () => {
    onSave(editedAd);
    onConfirmEdit(editedAd);
    onClose();
  };

  return (
    <Modal title="Edit Ad" opened={showEditModal} onClose={onClose}>
      <TextInput
        label="Price"
        name="price"
        value={editedAd.price}
        onChange={handleChange}
      />
      <TextInput
        label="Description"
        name="description"
        value={editedAd.description}
        onChange={handleChange}
      />
      <Button onClick={handleSaveChanges} variant="outline">
        Save Changes
      </Button>
      <Button onClick={onClose} variant="outline">
        Cancel
      </Button>
    </Modal>
  );
};

export default EditAdModal;
