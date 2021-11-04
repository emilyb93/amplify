import { db, firebase } from "../../firebase/config";
import RequestLocationData from "../../utils/RequestLocationData";

export const uploadAd = async (
  setUploadingAd,
  title,
  body,
  media,
  setError
) => {
  //Checks if the title/body are adequate length. If not - changes error state and returns from function.
  if (title.length < 5 || body.length < 20) {
    setError(true);
    return;
  }

  setError(false);

  //Starts uploading ad.
  setUploadingAd(true);

  //Getting geolocation
  const { geohash, lat, long } = await RequestLocationData();

  //Getting userId
  const uid = await firebase.auth().currentUser.uid;

  //Setting up the endpoint for the data
  const endpoint = `/${media.type}/${Date.now()}`;

  //Setting a url variable for if there is media.
  let url = "none";

  //If there's media - "blob" it and store it at the specified endpoint. Use getDownloadUrl to get the endpoint for the firestore.
  if (media.uri) {
    const uri = media.uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    await firebase.storage().ref().child(endpoint).put(blob);
    url = await firebase.storage().ref(endpoint).getDownloadURL();
  }

  //Create and upload firestore object.
  const adObject = {
    title,
    body,
    type: media.type,
    url,
    geohash,
    lat,
    long,
    userId: uid,
    created: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("ads").add(adObject);

  setUploadingAd(false);
};
