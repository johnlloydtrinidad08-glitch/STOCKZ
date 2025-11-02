// =========================
// Firebase imports
// =========================
import { db } from "./firebaseConfig.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// =========================
// Firestore Key
// =========================
const KEY_HISTORY = "history";

// =========================
// DOM Element
// =========================
const historyList = document.getElementById("historyList");

// =========================
// Load History (Realtime)
// =========================
function loadHistory() {
  const q = query(collection(db, KEY_HISTORY), orderBy("date", "desc"));
  onSnapshot(q, snapshot => {
    historyList.innerHTML = "";

    if (snapshot.empty) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="3" style="text-align:center;">No history records yet</td>`;
      historyList.appendChild(tr);
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const tr = document.createElement("tr");
      const dateStr = new Date(data.date).toLocaleString();
      tr.innerHTML = `
        <td>${dateStr}</td>
        <td>${data.productName}</td>
        <td>${data.event}</td>
      `;
      historyList.appendChild(tr);
    });
  });
}

// =========================
// Initialize
// =========================
window.addEventListener("DOMContentLoaded", loadHistory);
