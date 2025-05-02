const form = document.getElementById('productForm');
const cartSection = document.getElementById('cart');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
cartSection.innerHTML = '';
cart.forEach((product, index) => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
    <h3>${product.name}</h3>
    <p>Precio: $${product.price.toFixed(2)}</p>
    <button onclick="removeItem(${index})">Eliminar</button>
    `;

    cartSection.appendChild(card);
});
}

function addProduct(e) {
e.preventDefault();
const name = document.getElementById('productName').value.trim();
const price = parseFloat(document.getElementById('productPrice').value);

if (!name || isNaN(price)) return;

const newProduct = { name, price };
cart.push(newProduct);
localStorage.setItem('cart', JSON.stringify(cart));
renderCart();
form.reset();
}

function removeItem(index) {
cart.splice(index, 1);
localStorage.setItem('cart', JSON.stringify(cart));
renderCart();
}

form.addEventListener('submit', addProduct);
renderCart();

const clearCartBtn = document.getElementById('clearCartBtn');

clearCartBtn.addEventListener('click', () => {
if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
}
});
