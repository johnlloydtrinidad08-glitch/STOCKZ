(function () {
  const input = document.getElementById("globalSearch");
  if (!input) return; 

  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function norm(s) {
    return (s || "").toString().toLowerCase().trim();
  }

  function applyFilter(query) {
    const q = norm(query);

    document.querySelectorAll("#productList tr").forEach(row => {
      const text = row.textContent ? row.textContent : "";
      row.style.display = q === "" || norm(text).includes(q) ? "" : "none";
    });

    document.querySelectorAll("#historyList tr").forEach(row => {
      const text = row.textContent ? row.textContent : "";
      row.style.display = q === "" || norm(text).includes(q) ? "" : "none";
    });

    document.querySelectorAll(".product-item").forEach(card => {
      const text = card.textContent ? card.textContent : "";
      card.style.display = q === "" || norm(text).includes(q) ? "" : "none";
    });

    const hasTable = document.querySelector("#productList, #historyList, .product-item");
    if (hasTable) {
      const anyVisible = [...document.querySelectorAll("#productList tr, #historyList tr, .product-item")]
        .some(el => el.style.display !== "none");
      const productList = document.getElementById("productList");
      const historyList = document.getElementById("historyList");
      if (productList) {
        if (![...productList.querySelectorAll("tr")].some(r => r.style.display !== "none")) {
          if (!productList.querySelector(".no-results")) {
            const tr = document.createElement("tr");
            tr.className = "no-results";
            tr.innerHTML = `<td colspan="7" style="text-align:center;color:#666">No matching products</td>`;
            productList.appendChild(tr);
          }
        } else {
          const nr = productList.querySelector(".no-results");
          if (nr) nr.remove();
        }
      }
      if (historyList) {
        if (![...historyList.querySelectorAll("tr")].some(r => r.style.display !== "none")) {
          if (!historyList.querySelector(".no-results")) {
            const tr = document.createElement("tr");
            tr.className = "no-results";
            tr.innerHTML = `<td colspan="3" style="text-align:center;color:#666">No matching history records</td>`;
            historyList.appendChild(tr);
          }
        } else {
          const nr = historyList.querySelector(".no-results");
          if (nr) nr.remove();
        }
      }
    }
  }

  const debouncedFilter = debounce(e => applyFilter(e.target.value), 120);

  input.addEventListener("input", debouncedFilter);

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilter(input.value);
    }
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      input.value = "";
      applyFilter("");
    }
  });

})();
