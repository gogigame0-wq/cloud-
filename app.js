// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMsg = document.getElementById('auth-msg');
const userContainer = document.getElementById('user-container');
const authContainer = document.getElementById('auth-container');
const welcomeMsg = document.getElementById('welcome-msg');
const fileList = document.getElementById('file-list');

// Auth
signupBtn.addEventListener('click', () => {
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(() => authMsg.textContent = "Регистрация успешна!")
    .catch(err => authMsg.textContent = err.message);
});

loginBtn.addEventListener('click', () => {
  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .catch(err => authMsg.textContent = err.message);
});

logoutBtn.addEventListener('click', () => signOut(auth));

// File upload
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) return alert("Избери файл!");
  const storageRef = ref(storage, `${auth.currentUser.uid}/${file.name}`);
  uploadBytes(storageRef, file).then(() => {
    loadFiles();
    alert("Файлът е качен!");
  });
});

// Load files
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
    welcomeMsg.textContent = `Здравей, ${user.email}`;
    loadFiles();
  } else {
    authContainer.style.display = 'block';
    userContainer.style.display = 'none';
  }
});
