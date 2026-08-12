let quantityInput = document.querySelector(".cart-qty input");

const minusBtn = document.querySelector(".cart-qty button:first-child");
const plusBtn = document.querySelector(".cart-qty button:last-child");

minusBtn.addEventListener("click", () => {

    let qty = parseInt(quantityInput.value);

    if (qty > 1) {

        quantityInput.value = qty - 1;

    }

});

plusBtn.addEventListener("click", () => {

    let qty = parseInt(quantityInput.value);

    quantityInput.value = qty + 1;

});