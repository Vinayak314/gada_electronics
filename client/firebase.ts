import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Firebase config (shared with test-frontend)
const firebaseConfig = {
  apiKey: "AIzaSyDRXzrj9g7IlfkWjiswSfusNHeeHyVddxs",
  authDomain: "gada-electronics-be704.firebaseapp.com",
  projectId: "gada-electronics-be704",
  storageBucket: "gada-electronics-be704.firebasestorage.app",
  messagingSenderId: "46453106106",
  appId: "1:46453106106:web:be2f14c54019de94c1a983",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export default app
