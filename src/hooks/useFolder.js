import { useReducer, useEffect } from "react";
import { doc, getDoc, where, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folders"
}

export const ROOT_FOLDER = { name: 'Root', id: null, path: [] }

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      }

    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder
      }
      case ACTIONS.SET_CHILD_FOLDERS:
        return {
          ...state,
          childFolders: payload.childFolders
        }
    default:
      return state
  }
}

export function useFolder(folderId = null, folder = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: []
  });

  const {currentUser} = useAuth();

  useEffect(() => {
    dispatch({
      type: ACTIONS.SELECT_FOLDER,
      payload: {
        folderId, folder
      }
    })
  }, [folderId, folder]);

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER }
      })
    }

    const fetchDoc = async () => {

      const docRef = doc(db.folders, folderId);
      try {
        const docSnap = await getDoc(docRef);
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: db.formatDoc(docSnap) }
        })

      } catch {
        return dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER }
        })
      }
    }

    fetchDoc();
  }, [folderId]);

  useEffect(() => {
    return onSnapshot(
      query(db.folders,
        where("parentId", "==", folderId),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt")
        ),
        (snapshot) => {
          dispatch({
            type: ACTIONS.SET_CHILD_FOLDERS,
            payload: {childFolders: snapshot.docs.map(db.formatDoc)}
          })
        }  
    )   
  }, [folderId, currentUser])
  return state;
}