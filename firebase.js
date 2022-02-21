// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBAaMpYnbbJ_IrvSljK5jylUnMBfY_Fyu0',
  authDomain: 'insta-clone-c8464.firebaseapp.com',
  projectId: 'insta-clone-c8464',
  storageBucket: 'insta-clone-c8464.appspot.com',
  messagingSenderId: '962845942869',
  appId: '1:962845942869:web:c2b789d4db8ad23053a0dc',
  measurementId: 'G-EJXYEPMT28',
}

// Initialize Firebase
// const analytics = getAnalytics(app)
// const app = initializeApp(firebaseConfig)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }
