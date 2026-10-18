// ==============================================================================
// Namma Cheyyar — Firebase Configuration
// ==============================================================================
// உங்க பழைய Firebase ப்ராஜெக்ட்டின் config விவரங்களை இங்கே Paste செய்யவும்.
// Firebase Console -> Project Settings -> General -> Your apps -> Web app -> Config
// ==============================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyA1fTOCSYtLd8m9bhZkgGKFzj-Dh2YDkO0",
  authDomain: "cheyyar-3d.firebaseapp.com",
  databaseURL: "https://cheyyar-3d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cheyyar-3d",
  storageBucket: "cheyyar-3d.firebasestorage.app",
  messagingSenderId: "884742180730",
  appId: "1:884742180730:web:89d031667e7a7b1de650c3",
  measurementId: "G-36W7QVTVCY"
};

// Check if credentials have been filled in by user
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("YOUR_") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("YOUR_")
  );
}
