// =========================
// Firebase imports
// =========================
import { db } from "./firebaseConfig.js";
import {
  collection,
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
const productListSection = document.querySelector(".product-list"); // existing section in your HTML

// =========================
// Load and listen for updates
// =========================
function loadDashboardData() {
  onSnapshot(collection(db, KEY_PRODUCTS), snapshot => {
    let productCount = 0;
    let totalQuantity = 0;

    const existingItems = productListSection.querySelectorAll(".product-item");
    existingItems.forEach(el => el.remove());

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      productCount++;
      totalQuantity += Number(data.qty || 0);

      const div = document.createElement("div");
      div.classList.add("product-item");
      div.innerHTML = `
        <img src="${data.image || 'https://via.placeholder.com/60'}" alt="Product">
        <div>
          <p><strong>${data.name}</strong></p>
          <p>Qty: ${data.qty} • ₱${Number(data.price || 0).toLocaleString()}</p>
        </div>
      `;
      productListSection.appendChild(div);
    });

    numProducts.textContent = productCount;
    totalQty.textContent = totalQuantity.toLocaleString();
  });

  onSnapshot(collection(db, KEY_CATEGORIES), snapshot => {
    numCategories.textContent = snapshot.size;
  });
}

// =========================
// Initialize
// =========================
window.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
});
