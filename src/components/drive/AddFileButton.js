import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import {useAuth} from '../../contexts/AuthContext';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../../firebase';
import { addDoc } from 'firebase/firestore';
import { ROOT_FOLDER } from '../../hooks/useFolder';

const AddFileButton = ({currentFolder}) => {
    const {currentUser} = useAuth();
    const storage = getStorage();

    function handleUpload(e) {
        const file = e.target.files[0];
        if (currentFolder == null || file == null) return;


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
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                addDoc(db.files,
                    {
                        url : downloadURL,
                        name : file.name,
                        createdAt : db.getCurrentTimeStamp,
                        folderId: currentFolder.id,
                        userId : currentUser.uid
                    }
                )
             
              });
            }
          );
        };

    
    return (
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
    )
}

export default AddFileButton