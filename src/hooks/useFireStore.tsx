import React, { useState } from "react";
import { db } from "../firebase/config";
import { AuthContext } from "../context/authProvider";

const useFirestore = (collection: any, condition: any) => {
  const [documents, setDocuments] = useState([]);
  const sound: HTMLAudioElement = new Audio();
  sound.src = "public/audio/noti.mp3";
  const { uid } = React.useContext(AuthContext);

  React.useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createdAt");
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        // reset documents data
        setDocuments([]);
        return;
      }

      collectionRef = collectionRef.where(
        condition.fieldName,
        condition.operator,
        condition.compareValue
      );
    }

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents: any = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (
        collection === "messages" &&
        documents[documents.length - 1].uid !== uid
      ) {
        sound.load();
        sound.play();
      }
      setDocuments(documents);
    });

    return unsubscribe;
  }, [collection, condition]);

  return documents;
};

export default useFirestore;
