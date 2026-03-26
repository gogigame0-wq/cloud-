// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAVCAQkdBSX-XbLgHzJ9hPSEuxJKyDqdfg",
  authDomain: "cloud-ffdb8.firebaseapp.com",
  projectId: "cloud-ffdb8",
  storageBucket: "cloud-ffdb8.firebasestorage.app",
  messagingSenderId: "824157420567",
  appId: "1:824157420567:web:9c1f9c51bf934c4214b052"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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

// Google login
const provider = new GoogleAuthProvider();

googleBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Успешен вход:", result.user);
    })
    .catch(error => {
      console.error(error);
      authMsg.textContent = error.message;
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// Upload file
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Избери файл!");
    return;
  }

  if (!auth.currentUser) {
    alert("Трябва да си логнат!");
    return;
  }

  const storageRef = ref(storage, `${auth.currentUser.uid}/${file.name}`);

  uploadBytes(storageRef, file)
    .then(() => {
      alert("Файлът е качен!");
      loadFiles();
    })
    .catch(error => {
      console.error(error);
      alert(error.message);
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

// Auth state
onAuthStateChanged(auth, user => {
  if (user) {
    authContainer.style.display = 'none';
    userContainer.style.display = 'block';
    welcomeMsg.textContent = `Здравей, ${user.displayName}`;
    loadFiles();
  } else {
    authContainer.style.display = 'block';
    userContainer.style.display = 'none';
  }
});
