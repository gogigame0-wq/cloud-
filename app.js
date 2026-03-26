// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAVCAQkdBSX-XbLgHzJ9hPSEuxJKyDqdfg",
  authDomain: "cloud-ffdb8.firebaseapp.com",
  projectId: "cloud-ffdb8",
  storageBucket: "cloud-ffdb8.firebasestorage.app",
  messagingSenderId: "824157420567",
  appId: "1:824157420567:web:9c1f9c51bf934c4214b052",
  measurementId: "G-C4ZY2SBVEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage();

// Elements
const googleBtn = document.getElementById('google-btn');
const logoutBtn = document.getElementById('logout-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const authMsg = document.getElementById('auth-msg');
const userContainer = document.getElementById('user-container');
const authContainer = document.getElementById('auth-container');
const welcomeMsg = document.getElementById('welcome-msg');
const fileList = document.getElementById('file-list');

// Google Sign-In
const provider = new GoogleAuthProvider();
googleBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Google login successful:", result.user);
    })
    .catch(error => {
      console.error("Google login error:", error.message);
      authMsg.textContent = error.message;
    });
});

// Logout
logoutBtn.addEventListener('click', () => signOut(auth));

// Upload file
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) return alert("Избери файл!");
  const storageRef = ref(storage, `${auth.currentUser.uid}/${file.name}`);
  uploadBytes(storageRef, file).then(() => {
    loadFiles();
    alert("Файлът е качен!");
  });
});

// Load user files
function loadFiles() {
  const listRef = ref(storage, auth.currentUser.uid);
  listAll(listRef).then(res => {
    fileList.innerHTML = '';
    res.items.forEach(itemRef => {
      getDownloadURL(itemRef).then(url => {
        const li = document.createElement('li');
        li.innerHTML = `${itemRef.name} <a href="${url}" target="_blank">Изтегли</a>`;
        fileList.appendChild(li);
      });
    });
  });
}

// Monitor auth state
onAuthStateChanged(auth, user => {
  if (user) {
    authContainer.style.display = 'none';
    userContainer.style.display = 'block';
    welcomeMsg.textContent = `Здравей, ${user.displayName || user.email}`;
    loadFiles();
  } else {
    authContainer.style.display = 'block';
    userContainer.style.display = 'none';
  }
});
