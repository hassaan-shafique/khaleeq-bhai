import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyChj1id_x0glKIUWJJtbKTNPEXJ9vr-wJ0',
  authDomain: 'AIzaSyChj1id_x0glKIUWJJtbKTNPEXJ9vr-wJ0',
  projectId: 'khurshid-chashmay-wala',
  storageBucket: 'khurshid-chashmay-wala.appspot.com',
  messagingSenderId: '49879103094',
  appId: '1:49879103094:web:2711112a7ac7a4c4c79157',
  measurementId: 'G-4JXB80L2B9'
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const analytics = getAnalytics(app)

//init service
export { db }
export { app }
