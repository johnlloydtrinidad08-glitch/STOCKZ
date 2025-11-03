import { db } from "./firebaseConfig.js";
import {
  collection, onSnapshot, query, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const salesList = document.getElementById("salesList");
const totalRevenueEl = document.getElementById("totalRevenue");

const q = query(collection(db, "transactions"), where("type", "==", "sale"));

onSnapshot(q, snapshot => {
  salesList.innerHTML = "";
  let totalRevenue = 0;
  snapshot.forEach(docSnap => {
    const s = docSnap.data();
    const date = s.timestamp?.toDate
      ? s.timestamp.toDate().toLocaleString()
      : "—";
    totalRevenue += s.totalAmount || 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${date}</td>
      <td>${s.productName}</td>
      <td>₱${s.price}</td>
      <td>₱${s.totalAmount}</td>
    `;
    salesList.appendChild(tr);
  });
  totalRevenueEl.textContent = `₱${totalRevenue.toLocaleString()}`;
});
