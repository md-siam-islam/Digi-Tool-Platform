// Badge color map// 

const badgeColors = {
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
};

let allProduct = []
let cart = JSON.parse(localStorage.getItem("cart")) || []
let currentProduct = null;
let balance = parseFloat(localStorage.getItem("balance")) || 0;

window.onload = () => {
    document.getElementById("mainBalance").innerText = `$${balance}`;
}


fetch("carddetails.json")
    .then(res => res.json())
    .then(products => {
        allProduct = products
        renderProducts(products)
    })

const renderProducts = (products) => {
    const container = document.getElementById("card-container");

    products.forEach(product => {
        const badgeClass = badgeColors[product.badgeColor] || "bg-gray-100 text-gray-600";

        const featuresHTML = product.features.map(feature => `<li class="flex items-center gap-2 text-gray-600 text-sm"><span class="text-purple-500">➺</span> ${feature}</li>`).join("");

        const card = `
            <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 relative">
              
              <!-- Badge -->
              <span class="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}">
                ${product.badge}
              </span>

              <!-- Icon -->
              <div class="text-3xl">${product.icon}</div>

              <!-- Title & Description -->
              <div>
                <h2 class="text-lg font-bold text-gray-800">${product.title}</h2>
                <p class="text-sm text-gray-500 mt-1">${product.description}</p>
              </div>

              <!-- Price -->
              <div class="text-2xl font-bold text-gray-900">
                $${product.price}
                <span class="text-sm font-normal text-gray-400">/${product.pricingType}</span>
              </div>

              <!-- Features -->
              <ul class="flex flex-col gap-1">
                ${featuresHTML}
              </ul>

              <!-- Button -->
              <button data-id="${product.id}" onclick="buttonClickHandler(this)" class="mt-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-full transition">
                ${product.cta}
              </button>

            </div>
        `;

        container.innerHTML += card;
    })

}

const buttonClickHandler = (button) => {

    const productId = button.getAttribute("data-id");
    currentProduct = allProduct.find(p => p.id == productId)
    // alert(`You clicked on ${ClickedProduct.title} for product ID: ${button.getAttribute("data-id")}`);
    document.getElementById("modal-title").innerText = currentProduct.title;
    document.getElementById("modal-description").innerText = currentProduct.description;
    document.getElementById("modal-price").innerText = `$${currentProduct.price} / ${currentProduct.pricingType}`;
    document.getElementById("my_modal_4").showModal()

    document.getElementById("addToCartBtn").onclick = () => {
        AddToCart(currentProduct)
        document.getElementById("my_modal_4").close()
    }
}

const updateCartCount = () => {
    const cartItemCountEl = document.getElementById("cart-item-count");
    cartItemCountEl.textContent = cart.length;
}

const AddToCart = (product) => {


    if (cart.find(p => p.id === product.id)) {
        alert("Product already in cart")
    } else {
        cart.push(product)
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
    renderCart()
}



const renderCart = () => {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const emptyMsg = document.getElementById("empty-msg");

    container.innerHTML = ""

    if (cart.length === 0) {
        emptyMsg.classList.remove("hidden")
        totalEl.innerText = "$0"
        return;
    }
    emptyMsg.classList.add("hidden")

    let total = 0;

    cart.forEach(item => {
        total += item.price

        const row = document.createElement("div");
        row.className = "flex items-center gap-4 py-4";

        row.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
        ${item.icon}
      </div>

      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-800">${item.title}</p>
        <p class="text-sm text-gray-400">$${item.price}</p>
      </div>

      <button 
        onclick="removeItem(${item.id})"
        class="text-xs text-red-500 hover:text-red-700 font-medium transition">
        Remove
      </button>
      `;
        container.appendChild(row)
    })

    totalEl.textContent = `$${total}`;

}

const removeItem = (id) => {
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
    renderCart();
}

const AddMoneybutton = () => {
    document.getElementById("addMoneyBtn").onclick = () => {
        document.getElementById("my_modal_3").showModal()
    }
}

const handleAddMoney = () => {

    const ManiBalance = document.getElementById("mainBalance");
    const input = document.getElementById("amount-input")
    const money = parseFloat(input.value);

    if (!money|| money <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    if(money > 200){
        alert("Maximum addable amount is $200");
        return;
    }

    balance += money;
    ManiBalance.innerText = `$${balance}`;
      localStorage.setItem("balance", balance);
    input.value = "";
    document.getElementById("my_modal_3").close()
}

function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  balance -= cart.reduce((s,p) => s + p.price, 0);
  document.getElementById("mainBalance").innerText = `$${balance}`;
  localStorage.setItem("balance", balance);
  const names = cart.map(p => p.title).join(", ");
  alert(`Order placed!\nItems: ${names}\nTotal: $${cart.reduce((s, p) => s + p.price, 0)}`);

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart))
    const container = document.getElementById("cart-items");
    container.innerHTML = "";
    updateCartCount()
    renderCart();
}

function showTab(tab) {
    const btnProducts = document.getElementById("btn-products");
    const btnCart = document.getElementById("btn-cart");

    if (tab === "products") {
        btnProducts.className = "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-purple-600 text-white";
        btnCart.className = "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 text-gray-400";
        document.getElementById("card-container").classList.remove("hidden");
        document.querySelector("section").classList.add("hidden");
    } else {
        btnCart.className = "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-purple-600 text-white";
        btnProducts.className = "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 text-gray-400";
        document.getElementById("card-container").classList.add("hidden");
        document.querySelector("section").classList.remove("hidden");
    }
}

renderCart();
updateCartCount()
AddMoneybutton()