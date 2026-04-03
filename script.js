// Badge color map// 

const badgeColors = {
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
};

let allProduct = []
let currentProduct = null;


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

const AddToCart = (product) => {
    console.log("Buy Now Product",product);
} 

// renderProducts()