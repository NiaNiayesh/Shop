"use strict";

//Show product details
document.addEventListener("DOMContentLoaded", function () {
  const selectedProductId = localStorage.getItem("selectedProductId");

  fetch(`https://fakestoreapi.com/products/${selectedProductId}`)
    .then((response) => response.json())
    .then((product) => {
      const productDetail = document.querySelector(".product-details");

      const detailCol1 = document.createElement("div");
      detailCol1.classList.add("details-col1");
      const detailCol1Img = document.createElement("img");
      detailCol1Img.setAttribute("src", product.image);
      const detailCol2 = document.createElement("div");
      detailCol2.classList.add("details-col2");
      const col2Header = document.createElement("div");
      col2Header.classList.add("col2-header");
      const detailH1 = document.createElement("h1");
      detailH1.innerHTML = product.title;
      const productRating = document.createElement("div");
      productRating.classList.add("product-rating");
      const rateSpan = document.createElement("span");
      rateSpan.classList.add("rate");
      const spanTag = document.createElement("span");
      spanTag.classList.add("material-symbols-outlined");
      spanTag.innerHTML = "star";
      rateSpan.innerHTML = product.rating.rate;
      const ratingSpan = document.createElement("span");
      ratingSpan.classList.add("ratings");
      ratingSpan.innerHTML = `${product.rating.count} Ratings`;
      const col2Detail = document.createElement("div");
      col2Detail.classList.add("col2-details");
      const col2Price = document.createElement("p");
      col2Price.classList.add("details-price");
      col2Price.innerHTML = `$${product.price}`;
      const detailsQuantity = document.createElement("div");
      detailsQuantity.classList.add("details-guantity");
      const minusBtn = document.createElement("button");
      minusBtn.classList.add("minus");
      minusBtn.addEventListener("click", minusQuantity);
      const minusSpan = document.createElement("span");
      minusSpan.classList.add("material-symbols-outlined");
      minusSpan.innerHTML = "remove";
      const detailsInput = document.createElement("input");
      detailsInput.setAttribute("type", "text");
      detailsInput.setAttribute("value", "1");
      detailsInput.setAttribute("min", "1");
      const plusBtn = document.createElement("button");
      plusBtn.classList.add("plus");
      plusBtn.addEventListener("click", plusQuantity);
      const plusSpan = document.createElement("span");
      plusSpan.classList.add("material-symbols-outlined");
      plusSpan.innerHTML = "add";
      const detailDescription = document.createElement("div");
      detailDescription.classList.add("details-description");
      const descriptionTitle = document.createElement("h4");
      descriptionTitle.innerHTML = "Description";
      const descriptionText = document.createElement("p");
      descriptionText.innerHTML = product.description;
      const buyNowBtn = document.createElement("button");
      buyNowBtn.classList.add("buy-now-btn");
      buyNowBtn.setAttribute("type", "submit");
      buyNowBtn.innerHTML = "Buy Now";

      
      // Plus quantity
      let quantity = parseInt(detailsInput.value);
      function plusQuantity(){
        quantity++;
        detailsInput.value = quantity;
      }
      //Minus quantity
      function minusQuantity(){
        if (quantity > 1) {
          quantity--;
          detailsInput.value = quantity;
        }
      }

      productDetail.append(detailCol1, detailCol2);
      detailCol1.append(detailCol1Img);
      detailCol2.append(col2Header,col2Detail);
      col2Header.append(detailH1,productRating);
      productRating.append(rateSpan,ratingSpan);
      rateSpan.append(spanTag);
      col2Detail.append(col2Price,detailsQuantity,detailDescription,buyNowBtn);
      detailsQuantity.append(minusBtn,detailsInput,plusBtn);
      minusBtn.append(minusSpan);
      plusBtn.append(plusSpan);
      detailDescription.append(descriptionTitle,descriptionText);
    })
    .catch((error) => {
      console.error(error);
    });
});
