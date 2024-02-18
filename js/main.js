"use strict";

//Add slider to main page
const sliderImg = document.querySelector(".img-slider");
const prevBtn = document.querySelector("#slider-prev-btn");
const nextBtn = document.querySelector("#slider-next-btn");
const dots = document.querySelectorAll(".dot");

let imageArray = ["./img/1.jpg", "./img/2.jpg", "./img/4.jpg"];
let imgIndex = 0;

function prevImage() {
  imgIndex--;
  if (imgIndex < 0) {
    imgIndex = imageArray.length - 1;
  }
  showSlide(imgIndex);
}

function nextImage() {
  imgIndex++;
  if (imgIndex >= imageArray.length) {
    imgIndex = 0;
  }
  showSlide(imgIndex);
}

function showSlide(index) {
  sliderImg.src = imageArray[index];
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add("dot-active");
    } else {
      dot.classList.remove("dot-active");
    }
  });
}
setInterval(nextImage, 5000);
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    showSlide(i);
  });
});

//Fetch product from fakeapi
const productCon = document.querySelector(".products-container");
const productsArray = [];

fetch("https://fakestoreapi.com/products")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error: " + response.status);
    }
  })
  .then((products) => {
    products.map((item) => {
      const product = {
        id: item.id,
        title: item.title.split(" ").slice(0, 3).join(" "),
        price: item.price,
        description: item.description,
        image: item.image,
      };
      productsArray.push(product);
    });
    productsArray.map((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      const productImg = document.createElement("img");
      productImg.setAttribute("src", product.image);
      const productTitle = document.createElement("h2");
      productTitle.classList.add("product-title");
      productTitle.innerHTML = product.title;
      const productPrice = document.createElement("p");
      productPrice.innerHTML = `$${product.price}`;
      const productBtn = document.createElement("div");
      productBtn.classList.add("product-btn");
      const addToCartBtn = document.createElement("span");
      addToCartBtn.classList.add("material-symbols-outlined");
      addToCartBtn.setAttribute("id", "add-shopping-btn");
      addToCartBtn.setAttribute("data-id", product.id);
      addToCartBtn.innerHTML = "add_shopping_cart";
      const favoriteBtn = document.createElement("span");
      favoriteBtn.classList.add("material-symbols-outlined");
      favoriteBtn.setAttribute("id", "favorite-btn");
      favoriteBtn.innerHTML = "favorite";
      const productTagA = document.createElement("a");
      productTagA.classList.add("product-detail");
      productTagA.setAttribute("href", "./productDetails.html");
      productTagA.setAttribute("data-id", product.id);
      productTagA.innerHTML = "View Product";

      productDiv.append(
        productImg,
        productTitle,
        productPrice,
        productBtn,
        productTagA
      );
      productBtn.append(addToCartBtn, favoriteBtn);
      productCon.append(productDiv);
    });

    //Show product details
    const productItems = document.querySelectorAll(".product-detail");

    productItems.forEach((item) => {
      item.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        localStorage.setItem("selectedProductId", productId);
      });
    });

    //Add product to cart
    const shopCount = document.querySelector(".shop-count");
    const addToCartBtn = document.querySelectorAll("#add-shopping-btn");
    const cartProductContainer = document.querySelector(".cart-container");
    const totalPriceElement = document.querySelector(".total-price");
    const modalCartFooter = document.querySelector(".modal-cart-footer");
    const modalCartEmptyContent = document.querySelector(".empty-cart");

    let cartItemsArray = [];
    let cartCount = 0;

    addToCartBtn.forEach((button) => {
      button.addEventListener("click", function () {
        const storedCartItems = localStorage.getItem("cartItemsArray");
        if (storedCartItems) {
          cartItemsArray = JSON.parse(storedCartItems);
        }

        const productCartId = this.getAttribute("data-id");
        localStorage.setItem("productCartId", productCartId);

        fetch(`https://fakestoreapi.com/products/${productCartId}`)
          .then((response) => response.json())
          .then((product) => {
            const existingCartItem = cartItemsArray.find(
              (item) => item.id === product.id
            );
            if (existingCartItem) {
              existingCartItem.quantity++;
            } else {
              const cartItem = {
                id: product.id,
                name: product.title.split(" ").slice(0, 3).join(" "),
                price: product.price,
                img: product.image,
                quantity: 1,
              };
              cartItemsArray.push(cartItem);
            }
            renderCartItems(cartItemsArray);
            saveCartItemsToLocalStorage();
            calcTotalPrice(cartItemsArray);

            modalCartEmptyContent.style.display = "none";
            modalCartFooter.style.display = "block";
            cartCount++;
            shopCount.innerHTML = cartCount;
            localStorage.setItem("cartCount", cartCount);
          })
          .catch((error) => {
            console.error(error);
          });

        // Save products to localstorage
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

            cartProductDiv.append(
              cartPImgDiv,
              cartProductDetail,
              cartProductRemove
            );
            cartPImgDiv.append(cartPImg);
            cartProductDetail.append(
              cartTagA,
              cartProductPrice,
              detailsQuantity
            );
            detailsQuantity.append(minusBtn, detailsInput, plusBtn);
            minusBtn.append(minusSpan);
            plusBtn.append(plusSpan);
            cartProductRemove.append(cartProductSpan);
            cartProductContainer.append(cartProductDiv);
          });
        }

        //Remove product from cart
        function removeProductFromCart(productId) {
          const index = cartItemsArray.findIndex(
            (item) => item.id === productId
          );
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
          const index = cartItemsArray.findIndex(
            (item) => item.id === productId
          );
          if (index !== -1) {
            cartItemsArray[index].quantity++;
            saveCartItemsToLocalStorage();
            renderCartItems(cartItemsArray);
            calcTotalPrice(cartItemsArray);

            cartCount++
            shopCount.innerHTML = cartCount
            localStorage.setItem('cartCount',cartCount)

          }
        }
        //Minus btn quantity
        function decreaseQuantity(productId) {
          const index = cartItemsArray.findIndex(
            (item) => item.id === productId
          );
          if (index !== -1) {
            if (cartItemsArray[index].quantity > 1) {
              cartItemsArray[index].quantity--;
              saveCartItemsToLocalStorage();
              renderCartItems(cartItemsArray);
              calcTotalPrice(cartItemsArray);

              cartCount--
              shopCount.innerHTML = cartCount
              localStorage.setItem('cartCount',cartCount)
         
            }
          }
        }
      });
    });
  });
