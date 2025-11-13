import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// References
const modalAddSupplier = document.getElementById("modalAddSupplier");
const btnAddSupplier = document.getElementById("btnAddSupplier");
const saveAddSupplier = document.getElementById("saveAddSupplier");
const cancelAddSupplier = document.getElementById("cancelAddSupplier");
const supplierTableBody = document.getElementById("supplierTableBody");
const searchSupplier = document.getElementById("searchSupplier");

const suppliersRef = collection(db, "suppliers");

// ---------- Modal Show/Hide ----------
btnAddSupplier.addEventListener("click", () => {
  modalAddSupplier.setAttribute("aria-hidden", "false");
});

cancelAddSupplier.addEventListener("click", () => {
  modalAddSupplier.setAttribute("aria-hidden", "true");
});

// ---------- Save Supplier ----------
saveAddSupplier.addEventListener("click", async () => {
  const name = document.getElementById("supplierName").value.trim();
  const contactPerson = document.getElementById("supplierContact").value.trim();
  const phone = document.getElementById("supplierPhone").value.trim();
  const email = document.getElementById("supplierEmail").value.trim();
  const address = document.getElementById("supplierAddress").value.trim();
  const notes = document.getElementById("supplierNotes").value.trim();

  // ✅ Validation
  if (!name || !contactPerson || !phone || !email || !address) {
    alert("Please fill in all required fields before saving.");
    return;
  }

  try {
    await addDoc(suppliersRef, {
      name,
      contactPerson,
      phone,
      email,
      address,
      notes,
      createdAt: new Date()
    });
    alert("Supplier added successfully!");

    // Clear fields
    document.getElementById("supplierName").value = "";
    document.getElementById("supplierContact").value = "";
    document.getElementById("supplierPhone").value = "";
    document.getElementById("supplierEmail").value = "";
    document.getElementById("supplierAddress").value = "";
    document.getElementById("supplierNotes").value = "";

    modalAddSupplier.setAttribute("aria-hidden", "true");
  } catch (err) {
    console.error("Error adding supplier:", err);
    alert("❌ Failed to add supplier. Please try again.");
  }
});

// ---------- Display Suppliers ----------
const q = query(suppliersRef, orderBy("name"));
onSnapshot(q, (snapshot) => {
  supplierTableBody.innerHTML = "";
  snapshot.forEach((doc) => {
    const s = doc.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.contactPerson}</td>
      <td>${s.phone}</td>
      <td>${s.email}</td>
      <td>${s.address}</td>
      <td>${s.notes || ""}</td>
    `;

    supplierTableBody.appendChild(row);
  });
});

// ---------- Search Filter ----------
searchSupplier.addEventListener("keyup", (e) => {
  const term = e.target.value.toLowerCase();
  const rows = supplierTableBody.getElementsByTagName("tr");
  Array.from(rows).forEach((row) => {
    const nameCell = row.cells[0]?.textContent.toLowerCase() || "";
    row.style.display = nameCell.includes(term) ? "" : "none";
  });
});
