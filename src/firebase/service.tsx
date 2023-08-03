import firebase, { db } from "./config";

export const addDocument = (collection: string, data: any) => {
  const query = db.collection(collection);

  query.add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const removeDocumentsByConditions = async (
  collectionPath: string,
  conditions: any
) => {
  try {
    const collectionRef = firebase.firestore().collection(collectionPath);

    // Create a query with multiple conditions
    let query: any = collectionRef;
    conditions.forEach((condition: any) => {
      query = query.where(condition.field, condition.operator, condition.value);
    });

    // Get the documents matching the conditions
    const snapshot = await query.get();

    // Delete each document in the result set
    const batch = firebase.firestore().batch();
    snapshot.forEach((doc: any) => batch.delete(doc.ref));

    // Commit the batch to delete the documents
    await batch.commit();

    console.log(`Documents matching the conditions deleted successfully.`);
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
};

// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName: string) => {
  // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
  // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
  const name = displayName.split(" ").filter((word) => word);

  const length = name.length;
  let flagArray: boolean[] = [];
  let result: string[] = [];
  let stringArray: string[] = [];

  /**
   * khoi tao mang flag false
   * dung de danh dau xem gia tri
   * tai vi tri nay da duoc su dung
   * hay chua
   **/
  for (let i = 0; i < length; i++) {
    flagArray[i] = false;
  }

  const createKeywords = (name: string) => {
    const arrName: string[] = [];
    let curName = "";
    name.split("").forEach((letter) => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  function findPermutation(k: number) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(" "));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

  const keywords = stringArray.reduce((acc: string[], cur: string) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};
