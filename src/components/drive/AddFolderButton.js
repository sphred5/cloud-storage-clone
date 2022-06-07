import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {useAuth} from '../../contexts/AuthContext'

const AddFolderButton = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const {currentUser} = useAuth();

  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  function handleSubmit(e){
    e.preventDefault();

    addDoc(db.folders, {
      name : name,
      // parentId,
      userId : currentUser.uid,
      // path,
      createdAt:db.getCurrentTimeStamp
    })

    // Create folder in database
    setName("");
    closeModal();

  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size='small'>
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={e => { setName(e.target.value) }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddFolderButton;
