import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

let auth = null;
let googleProvider = null;
let currentUser = null;

// Initialize Firebase Auth dynamically if configured
export async function initFirebase() {
  if (isFirebaseConfigured()) {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js');
      const { 
        getAuth, 
        signInWithPopup, 
        signInAnonymously, 
        GoogleAuthProvider, 
        onAuthStateChanged 
      } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');

      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();

      onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser = user;
          console.log('[Firebase Auth] Active user:', user.displayName || user.uid, 'isAnonymous:', user.isAnonymous);
          localStorage.setItem('cheyyar_firebase_user', JSON.stringify({
            uid: user.uid,
            displayName: user.displayName || 'Explorer',
            email: user.email,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous
          }));
        } else {
          currentUser = null;
          localStorage.removeItem('cheyyar_firebase_user');
        }
      });

      console.log('✅ [Firebase Auth] Successfully connected to Firebase Project:', firebaseConfig.projectId);
      return { success: true, auth };
    } catch (err) {
      console.warn('⚠️ [Firebase Auth] Initialization warning:', err.message);
      return { success: false, error: err };
    }
  } else {
    console.log('ℹ️ [Firebase Auth] Firebase config has placeholder keys. Local guest mode active. Update public/firebase-config.js to connect your real Firebase project.');
    return { success: false, placeholder: true };
  }
}

// Google Login
export async function loginWithGoogle() {
  if (auth && googleProvider) {
    try {
      const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        user: result.user,
        name: result.user.displayName || 'Explorer'
      };
    } catch (err) {
      console.error('[Firebase Auth] Google login failed:', err);
      throw err;
    }
  } else {
    // Graceful fallback for local development before Firebase keys are pasted
    console.log('[Firebase Auth] Simulating Google login (local mode)');
    const mockUser = {
      uid: 'google_user_' + Math.random().toString(36).substring(2, 9),
      displayName: 'Cheyyar Explorer',
      isAnonymous: false
    };
    return { success: true, user: mockUser, name: mockUser.displayName };
  }
}

// Anonymous Login
export async function loginAnonymously() {
  if (auth) {
    try {
      const { signInAnonymously } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
      const result = await signInAnonymously(auth);
      return {
        success: true,
        user: result.user,
        name: 'Guest_' + result.user.uid.substring(0, 5)
      };
    } catch (err) {
      console.error('[Firebase Auth] Anonymous login failed:', err);
      throw err;
    }
  } else {
    // Graceful fallback
    const mockUser = {
      uid: 'anon_' + Math.random().toString(36).substring(2, 9),
      displayName: 'Guest_' + Math.floor(1000 + Math.random() * 9000),
      isAnonymous: true
    };
    return { success: true, user: mockUser, name: mockUser.displayName };
  }
}

// Initialize on page load
initFirebase();
