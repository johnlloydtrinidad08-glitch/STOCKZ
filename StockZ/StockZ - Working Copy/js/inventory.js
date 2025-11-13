// =========================
// Firebase imports
// =========================
import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// =========================
// Firestore Collection Keys
// =========================
const KEY_PRODUCTS = "products";
const KEY_CATEGORIES = "categories";

// =========================
// DOM Elements
// =========================
const productList = document.getElementById("productList");
const modalAddProduct = document.getElementById("modalAddProduct");
const modalUpdateProduct = document.getElementById("modalUpdateProduct");
const modalAddCategory = document.getElementById("modalAddCategory");
const modalConfirm = document.getElementById("modalConfirm");

// Buttons
const btnAddProduct = document.getElementById("btnAddProduct");
const btnAddCategory = document.getElementById("btnAddCategory");
const saveAddProduct = document.getElementById("saveAddProduct");
const saveCategory = document.getElementById("saveCategory");
const saveUpdateProduct = document.getElementById("saveUpdateProduct");

// Inputs (Add)
const productName = document.getElementById("productName");
const productQty = document.getElementById("productQty");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productImage = document.getElementById("productImage");

// Inputs (Update)
const updateId = document.getElementById("updateId");
const updateName = document.getElementById("updateName");
const updateQty = document.getElementById("updateQty");
const updatePrice = document.getElementById("updatePrice");
const updateCategory = document.getElementById("updateCategory");
const updateStatus = document.getElementById("updateStatus");
const updateImage = document.getElementById("updateImage");

// =========================
// Utility functions
// =========================
function openModal(modal) {
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".close-modal").forEach(btn => {
  btn.addEventListener("click", e => {
    closeModal(btn.closest(".modal"));
  });
});

// =========================
// Load Categories
// =========================
async function loadCategories() {
  productCategory.innerHTML = "";
  updateCategory.innerHTML = "";
  const snap = await getDocs(collection(db, KEY_CATEGORIES));
  snap.forEach(docSnap => {
    const opt = document.createElement("option");
    opt.value = docSnap.data().name;
    opt.textContent = docSnap.data().name;
    productCategory.appendChild(opt.cloneNode(true));
    updateCategory.appendChild(opt);
  });
}

// =========================
// Load Products 
// =========================
function loadProducts() {
  const q = collection(db, KEY_PRODUCTS);
  onSnapshot(q, snapshot => {
    productList.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      renderProductRow({ id: docSnap.id, ...data });
    });
  });
}

function renderProductRow(product) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><img src="${product.image || 'https://via.placeholder.com/50'}" class="tbl-img"></td>
    <td>${product.name}</td>
    <td>₱${Number(product.price || 0).toLocaleString()}</td>
    <td>${product.qty}</td>
    <td>${product.category}</td>
    <td><span class="badge ${product.status === "In Stock" ? "success" : "danger"}">${product.status}</span></td>
    <td>
      <div class="dropdown">
        <button class="action-btn">Action ▾</button>
        <ul class="dropdown-menu">
          <li class="update-product" data-id="${product.id}">Update</li>
          <li class="delete-product" data-id="${product.id}">Delete</li>
        </ul>
      </div>
    </td>
  `;
  productList.appendChild(tr);
}

// =========================
// Dropdown behavior
// =========================
document.addEventListener("click", e => {
  document.querySelectorAll(".dropdown.open").forEach(d => d.classList.remove("open"));

  if (e.target.classList.contains("action-btn")) {
    e.stopPropagation();
    e.target.closest(".dropdown").classList.toggle("open");
  }

  if (e.target.classList.contains("update-product")) {
    const id = e.target.dataset.id;
    openUpdateModal(id);
  }

  if (e.target.classList.contains("delete-product")) {
    const id = e.target.dataset.id;
    confirmDelete(id);
  }
});

// =========================
// Add Product
// =========================
saveAddProduct.addEventListener("click", async () => {
  const name = productName.value.trim();
  const qty = parseInt(productQty.value);
  const price = parseFloat(productPrice.value);
  const category = productCategory.value;
  const image = productImage.value.trim();

  if (!name) return alert("Enter product name.");

  await addDoc(collection(db, KEY_PRODUCTS), {
    name,
    qty,
    price,
    category,
    image,
    status: qty > 0 ? "In Stock" : "Out of Stock"
  });

  closeModal(modalAddProduct);
});

// =========================
// Add Category
// =========================
saveCategory.addEventListener("click", async () => {
  const catName = document.getElementById("newCategory").value.trim();
  if (!catName) return alert("Enter category name.");

  await addDoc(collection(db, KEY_CATEGORIES), { name: catName });
  closeModal(modalAddCategory);
  loadCategories();
});

// =========================
// Update Product
// =========================
async function openUpdateModal(id) {
  const snap = await getDocs(collection(db, KEY_PRODUCTS));
  snap.forEach(docSnap => {
    if (docSnap.id === id) {
      const data = docSnap.data();
      updateId.value = id;
      updateName.value = data.name;
      updateQty.value = data.qty;
      updatePrice.value = data.price;
      updateCategory.value = data.category;
      updateStatus.value = data.status;
      updateImage.value = data.image;
    }
  });
  openModal(modalUpdateProduct);
}

saveUpdateProduct.addEventListener("click", async () => {
  const id = updateId.value;
  if (!id) return;

  const ref = doc(db, KEY_PRODUCTS, id);
  const newQty = parseInt(updateQty.value);
const newStatus = newQty > 0 ? "In Stock" : "Out of Stock";

await updateDoc(ref, {
  name: updateName.value,
  qty: newQty,
  price: parseFloat(updatePrice.value),
  category: updateCategory.value,
  status: newStatus,
  image: updateImage.value
});

  closeModal(modalUpdateProduct);
});

// =========================
// Delete Product
// =========================
function confirmDelete(id) {
  openModal(modalConfirm);
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  confirmYes.onclick = async () => {
    await deleteDoc(doc(db, KEY_PRODUCTS, id));
    closeModal(modalConfirm);
  };

  confirmNo.onclick = () => closeModal(modalConfirm);
}

// =========================
// Button handlers
// =========================
btnAddProduct.addEventListener("click", () => openModal(modalAddProduct));
btnAddCategory.addEventListener("click", () => openModal(modalAddCategory));

// =========================
// Initialize
// =========================
window.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadProducts();
});






