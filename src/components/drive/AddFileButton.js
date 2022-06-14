import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../../firebase';
import { query, doc, updateDoc, where, getDocs, addDoc } from 'firebase/firestore';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { v4 as uuIdV4 } from "uuid";
import { Toast } from 'react-bootstrap';
import { ProgressBar } from 'react-bootstrap';

const AddFileButton = ({ currentFolder }) => {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();
  const storage = getStorage();

  function handleUpload(e) {
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;
    const id = uuIdV4()

    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles, { id: id, name: file.name, progress: 0, error: false }
    ]);


    const filePath = currentFolder === ROOT_FOLDER ?
      `${currentFolder.path
        .map(folder => folder.id).join('/')}/${file.name}`
      : `${currentFolder.path
        .map(folder => folder.id).join('/')}/${currentFolder.name}/${file.name}`;
    const storageRef = ref(storage, `/files/${currentUser.uid}/${filePath}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress }
            }
            return uploadFile
          })
        })
      },
      (error) => {
        setUploadingFiles(prevUploadingFiles => {

          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true }
            }
            return uploadFile;
          })
        })
      },
       () => {

        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.filter(uploadFile => {
            return uploadFile.id !== id
          })
        })

        getDownloadURL(uploadTask.snapshot.ref)
        .then(async (url) => {
          const q = query(db.files, 
              where("name", "==", file.name), 
              where("userId", "==", currentUser.uid), 
              where("folderId", "==", currentFolder.id)
            );
            await getDocs(q)
            .then(existingFiles => {
              const existingFile = existingFiles.docs[0]
              if(existingFile){
                updateDoc(existingFile.ref, {url : url})   
              }else {
                addDoc(
                  db.files,
                  {
                    url: url,
                    name: file.name,
                    createdAt: db.getCurrentTimeStamp,
                    folderId: currentFolder.id,
                    userId: currentUser.uid,
                  }
                )
              }
            })
        });
   
      }
    );
  };


  return (
    <>
      <label className="btn btn-outline-success brn-sm m-0 me-2">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{
            opacity: 0,
            position: 'absolute',
            left: '-999999px'
          }}></input>
      </label>
      {uploadingFiles.length > 0 &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              maxWidth: '250px'
            }}
          >
            {uploadingFiles.map(file => (
              <Toast key={file.id} onClose={() => {
                setUploadingFiles(prevUploadingFiles => {
                  return prevUploadingFiles.filter(uploadFile => {
                    return uploadFile.id !== file.id;
                  })
                })
              }}>
                <Toast.Header
                  className="text-truncate w-100 d-block"
                  closeButton={file.error}
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress}
                    label={
                      file.error ? "Error" : `${Math.round(file.progress)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )
      }
    </>
  )
}

export default AddFileButton