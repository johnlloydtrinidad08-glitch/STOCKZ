// =========================
// Firebase imports
// =========================
import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// =========================
// Firestore keys
// =========================
const KEY_PRODUCTS = "products";
const KEY_CATEGORIES = "categories";

// =========================
// DOM elements
// =========================
const numProducts = document.getElementById("numProducts");
const numCategories = document.getElementById("numCategories");
const totalQty = document.getElementById("totalQty");

// =========================
// Load and listen for updates
// =========================
function loadDashboardData() {
  // Realtime update for products
  onSnapshot(collection(db, KEY_PRODUCTS), snapshot => {
    let productCount = 0;
    let totalQuantity = 0;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      productCount++;
      totalQuantity += Number(data.qty || 0);
    });

    numProducts.textContent = productCount;
    totalQty.textContent = totalQuantity.toLocaleString();
  });

  // Realtime update for categories
  onSnapshot(collection(db, KEY_CATEGORIES), snapshot => {
    let categoryCount = snapshot.size;
    numCategories.textContent = categoryCount;
  });
}

// =========================
// Initialize
// =========================
window.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
});
