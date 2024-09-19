import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import "firebase/auth";


// import { collections } from "@mui/icons-material";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyChj1id_x0glKIUWJJtbKTNPEXJ9vr-wJ0",
  authDomain: "AIzaSyChj1id_x0glKIUWJJtbKTNPEXJ9vr-wJ0",
  projectId: "khurshid-chashmay-wala",
  storageBucket: "khurshid-chashmay-wala.appspot.com",
  messagingSenderId: "49879103094",
  appId: "1:49879103094:web:2711112a7ac7a4c4c79157",
  measurementId: "G-4JXB80L2B9",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const analytics = getAnalytics(app);

//init service
export { db }; 
export {app};


//collection ref
// const colRef = collection(db,"inventory");

//get collection data

// getDocs (colRef)
// .then ((snapshot) => {
//     console.log(snapshot.docs)
// })
