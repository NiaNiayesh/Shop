"use strict";

//Add hamburger menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

//Add cart Modal
const cartIcon = document.querySelector("#shopping-btn");
const modalCart = document.querySelector(".modal-cart");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector("#close-btn");

function showCartModal() {
  modalCart.classList.add("showCart");
  overlay.classList.add("showCart");
}
function closeCartModal() {
  modalCart.classList.remove("showCart");
  overlay.classList.remove("showCart");
}

overlay.addEventListener("click", closeCartModal);
cartIcon.addEventListener("click", showCartModal);
closeBtn.addEventListener("click", closeCartModal);

// Add search modal
const loginIcon = document.querySelector("#search-btn");
const modalSearch = document.querySelector(".modal-search");
const searchResults = document.querySelector('.search-results')
const searchResultProduct = document.querySelector(".search-result-product");
const searchInput = document.querySelector(".search-input");
const searchProductBtn = document.querySelector(".modal-search-btn");

function showSearchModal() {
  modalSearch.classList.add("showSearch");
  overlay.classList.add("showSearch");

}
function closeSearchModal() {
  modalSearch.classList.remove("showSearch");
  overlay.classList.remove("showSearch");
  searchResults.style.display = 'none'
  searchInput.value = ''
}
function searchProduct() {
  const productName = searchInput.value;

  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((products) => {
      const matchingProducts = products.filter((item) => {
        const productTitle = item.title.split(' ')[0].toLowerCase()
        return productTitle === productName
      })

      if(matchingProducts.length > 0){
        searchResults.style.display = 'block'
        searchResultProduct.innerHTML = ''

        matchingProducts.forEach((item) => {
          const productDiv = document.createElement("div");
          productDiv.classList.add("result-product");

          const productImgDiv = document.createElement("div");
          productImgDiv.classList.add("result-product-img");

          const productImg = document.createElement("img");
          productImg.src = item.image;
          productImgDiv.appendChild(productImg);

          const productDetailsDiv = document.createElement("div");
          productDetailsDiv.classList.add("result-product-details");

          const productTitleLink = document.createElement("a");
          productTitleLink.classList.add("result-product-title");
          productTitleLink.setAttribute('href','#')
          productTitleLink.innerHTML = item.title;
          productDetailsDiv.appendChild(productTitleLink);

          const productPrice = document.createElement("p");
          productPrice.classList.add("result-product-price");
          productPrice.textContent = `$${item.price}`;
          productDetailsDiv.appendChild(productPrice);

          productDiv.appendChild(productImgDiv);
          productDiv.appendChild(productDetailsDiv);

          searchResultProduct.appendChild(productDiv);
        })
      }else{
        searchResultProduct.innerHTML = ''
        searchResults.style.display = 'block'
        const nonProductText = document.createElement('p')
        nonProductText.classList.add('non-product')
        nonProductText.innerHTML = 'No product found!'

        searchResultProduct.appendChild(nonProductText)
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

overlay.addEventListener("click", closeSearchModal);
loginIcon.addEventListener("click", showSearchModal);
searchProductBtn.addEventListener("click", searchProduct);
searchInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter'){
    searchProduct()
  }
})

//Add product to cart
const shopCount = document.querySelector(".shop-count");
const cartProductContainer = document.querySelector(".cart-container");
const totalPriceElement = document.querySelector(".total-price");
const modalCartFooter = document.querySelector(".modal-cart-footer");
const modalCartEmptyContent = document.querySelector(".empty-cart");

let cartCount = localStorage.getItem("cartCount");

if (cartCount) {
  shopCount.innerHTML = cartCount;
}

let cartItemsArray = [];
const storedCartItems = localStorage.getItem("cartItems");

if (storedCartItems) {
  cartItemsArray = JSON.parse(storedCartItems);
  renderCartItems(cartItemsArray);
  calcTotalPrice(cartItemsArray);
  if (cartItemsArray.length === 0) {
    modalCartEmptyContent.style.display = "block";
    modalCartFooter.style.display = "none";
  } else {
    modalCartEmptyContent.style.display = "none";
    modalCartFooter.style.display = "block";
  }
}
// Save products to local storage
function saveCartItemsToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItemsArray));
}

// Generate cart products
function renderCartItems(cartItemsArray) {
  cartProductContainer.innerHTML = "";
  cartItemsArray.forEach((item) => {
    const cartProductDiv = document.createElement("div");
    cartProductDiv.classList.add("cart-product");
    cartProductDiv.setAttribute("data-productCart-id", item.id);
    const cartPImgDiv = document.createElement("div");
    cartPImgDiv.classList.add("cart-product-img");
    const cartPImg = document.createElement("img");
    cartPImg.setAttribute("src", item.img);
    const cartProductDetail = document.createElement("div");
    cartProductDetail.classList.add("cart-product-detail");
    const cartTagA = document.createElement("a");
    cartTagA.classList.add("cart-product-title");
    cartTagA.setAttribute("href", "#");
    cartTagA.innerHTML = item.name;
    const cartProductPrice = document.createElement("p");
    cartProductPrice.classList.add("cart-product-price");
    cartProductPrice.innerHTML = `$${item.price}`;
    const detailsQuantity = document.createElement("div");
    detailsQuantity.classList.add("details-guantity");
    const minusBtn = document.createElement("button");
    minusBtn.classList.add("minus");
    minusBtn.addEventListener("click", function () {
      decreaseQuantity(item.id);
    });
    const minusSpan = document.createElement("span");
    minusSpan.classList.add("material-symbols-outlined");
    minusSpan.innerHTML = "remove";
    const detailsInput = document.createElement("input");
    detailsInput.setAttribute("type", "text");
    detailsInput.setAttribute("value", "1");
    detailsInput.setAttribute("min", "1");
    detailsInput.value = item.quantity;
    const plusBtn = document.createElement("button");
    plusBtn.classList.add("plus");
    plusBtn.addEventListener("click", function () {
      increaseQuantity(item.id);
    });
    const plusSpan = document.createElement("span");
    plusSpan.classList.add("material-symbols-outlined");
    plusSpan.innerHTML = "add";
    const cartProductRemove = document.createElement("div");
    cartProductRemove.classList.add("cart-product-remove");
    const cartProductSpan = document.createElement("span");
    cartProductSpan.classList.add("material-symbols-outlined");
    cartProductSpan.setAttribute("id", "delete-btn");
    cartProductSpan.innerHTML = "delete";
    cartProductSpan.addEventListener("click", function () {
      const productId = item.id;
      removeProductFromCart(productId);
    });

    cartProductDiv.append(cartPImgDiv, cartProductDetail, cartProductRemove);
    cartPImgDiv.append(cartPImg);
    cartProductDetail.append(cartTagA, cartProductPrice, detailsQuantity);
    detailsQuantity.append(minusBtn, detailsInput, plusBtn);
    minusBtn.append(minusSpan);
    plusBtn.append(plusSpan);
    cartProductRemove.append(cartProductSpan);
    cartProductContainer.append(cartProductDiv);
    //}
  });
}

//Remove product from cart
function removeProductFromCart(productId) {
  const index = cartItemsArray.findIndex((item) => item.id === productId);

  if (index !== -1) {
    const removeQuantity = cartItemsArray[index].quantity;
    cartItemsArray.splice(index, 1);
    saveCartItemsToLocalStorage();
    renderCartItems(cartItemsArray);
    calcTotalPrice(cartItemsArray);

    cartCount -= removeQuantity;
    shopCount.innerHTML = cartCount;
    localStorage.setItem("cartCount", cartCount);

    if (cartCount === 0) {
      modalCartEmptyContent.style.display = "block";
      modalCartFooter.style.display = "none";
    }
  }
}
//Calc total price
function calcTotalPrice(cartItemsArray) {
  let totalPrice = 0;
  cartItemsArray.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  totalPriceElement.innerHTML = `$${totalPrice}`;
}
//Plus btn quantity
function increaseQuantity(productId) {
  const index = cartItemsArray.findIndex((item) => item.id === productId);

  if (index !== -1) {
    cartItemsArray[index].quantity++;
    saveCartItemsToLocalStorage();
    renderCartItems(cartItemsArray);
    calcTotalPrice(cartItemsArray);

    cartCount++;
    shopCount.innerHTML = cartCount;
    localStorage.setItem("cartCount", cartCount);
  }
}
//Minus btn quantity
function decreaseQuantity(productId) {
  const index = cartItemsArray.findIndex((item) => item.id === productId);
  if (index !== -1) {
    if (cartItemsArray[index].quantity > 1) {
      cartItemsArray[index].quantity--;
      saveCartItemsToLocalStorage();
      renderCartItems(cartItemsArray);
      calcTotalPrice(cartItemsArray);

      cartCount--;
      shopCount.innerHTML = cartCount;
      localStorage.setItem("cartCount", cartCount);
    }
  }
}
