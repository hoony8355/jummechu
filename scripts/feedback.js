// scripts/feedback.js

// Firebase 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjekG3-2VMX2ZizSJhmP6xgLzayams2Hs",
  authDomain: "jummechu-d945c.firebaseapp.com",
  databaseURL: "https://jummechu-d945c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jummechu-d945c",
  storageBucket: "jummechu-d945c.firebasestorage.app",
  messagingSenderId: "766248309823",
  appId: "1:766248309823:web:d6f0f67ac3972f809c548a",
  measurementId: "G-XMSL7S078W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const feedbackForm = document.getElementById("feedback-form");
const reviewList = document.getElementById("review-list");
let latestMenu = "";

// 추천 메뉴명 공유
window.setRecommendedMenu = function(menu) {
  latestMenu = menu;
};

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  const date = new Date().toISOString();

  const feedbackRef = ref(db, "feedback");
  await push(feedbackRef, {
    menu: latestMenu,
    rating: parseInt(rating),
    comment,
    date
  });

  feedbackForm.reset();
  alert("후기가 저장되었습니다!");
});

function loadReviews() {
  const feedbackRef = ref(db, "feedback");
  onValue(feedbackRef, (snapshot) => {
    const data = snapshot.val();
    const sorted = Object.values(data || {}).sort((a, b) => new Date(b.date) - new Date(a.date));
    reviewList.innerHTML = "";
    sorted.slice(0, 10).forEach(entry => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>⭐ ${entry.rating}점</strong> | <em>추천 메뉴: ${entry.menu}</em><br/>
        "${entry.comment}"<br/>
        <small>${new Date(entry.date).toLocaleDateString()}</small>
      `;
      reviewList.appendChild(li);
    });
  });
}

window.addEventListener("DOMContentLoaded", loadReviews);
