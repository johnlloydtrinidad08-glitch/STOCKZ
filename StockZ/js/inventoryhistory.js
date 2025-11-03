import { db } from "./firebaseConfig.js";
import {
  collection, onSnapshot, orderBy, query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const historyList = document.getElementById("historyList");
const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));

onSnapshot(q, snapshot => {
  historyList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    const date = d.timestamp?.toDate
      ? d.timestamp.toDate().toLocaleString()
      : "—";
    const change =
      d.type === "sale"
        ? `Sold -${Math.abs(d.quantityChange)}`
        : d.type === "add"
        ? `Added +${Math.abs(d.quantityChange)}`
        : d.type === "update"
        ? `Updated`
        : "Deleted";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${date}</td>
      <td>${d.productName || "(Unnamed Product)"}</td>
      <td>${change}</td>
    `;
    historyList.appendChild(tr);
  });
});




