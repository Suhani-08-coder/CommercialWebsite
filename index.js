// --- GLOBAL SCOPE FUNCTIONS ---
// Inhe window par isliye rakha hai taaki HTML se access ho sake (onclick trigger)
window.toggleMobileMenu = function() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('mobile-active');
        // Mobile par scroll lock karna
        document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : 'auto';
    } else {
        console.warn("Mobile menu element (navLinks) nahi mila.");
    }
};

window.openCartDrawer = function() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCartDrawer = function() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Switch & Basic Navbar Listeners
    // Inhe try-catch ya if check mein rakha hai taaki errors na aayein
    const themeBtn = document.getElementById('themeBtn');
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('cartOverlay');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const circle = document.querySelector('.color-circle');
            if (circle) {
                circle.style.transform = document.body.classList.contains('dark-mode') 
                    ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    // 2. Cart Toggle Logic (Navbar version)
    if (cartBtn) cartBtn.addEventListener('click', window.openCartDrawer);
    if (closeCart) closeCart.addEventListener('click', window.closeCartDrawer);
    if (overlay) overlay.addEventListener('click', window.closeCartDrawer);

    // 3. Size Selection Logic
    document.querySelectorAll('.size-box').forEach(box => {
        box.addEventListener('click', () => {
            document.querySelectorAll('.size-box').forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
        });
    });
});

// --- ADD TO CART ANIMATION & LOGIC ---
function addToCartAnimation() {
    const btn = document.querySelector('.add-to-cart-btn');
    if (!btn) return;

    const originalText = btn.innerText;
    
    btn.innerText = "ADDING...";
    btn.style.opacity = "0.7";
    
    // Animation Timeout
    setTimeout(() => {
        btn.innerText = "ADDED TO BAG";
        btn.style.background = "#2ecc71"; // Success Green
        btn.style.color = "#fff";
        
        // Execute actual cart logic
        addToCart();

        // Reset after 2 seconds
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = ""; // Global variable se auto pick karega
            btn.style.color = "";
            btn.style.opacity = "1";
        }, 2000);
    }, 1000); // 8000ms bahut zyada tha, 1000ms (1 sec) premium lagta hai
}

let cart = [];

function addToCart() {
    // Check karein ki page par product data available hai ya nahi
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    // Yahan ensure karein ki 'allProducts' variable aapke script mein upar defined ho
    if (typeof allProducts !== 'undefined' && allProducts[productId]) {
        const product = allProducts[productId];
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            img: product.images[0]
        });

        updateCartUI();
        window.openCartDrawer();
    } else {
        // Simple test case agar data na ho (sirf check karne ke liye)
        console.log("Product data missing, dummy item adding for test.");
    }
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const countSpan = document.getElementById('cartItemCount');
    const subtotalSpan = document.getElementById('cartSubtotal');
    const navCount = document.getElementById('navCartCount');
    
    if (countSpan) countSpan.innerText = cart.length;
    if (navCount) navCount.innerText = cart.length;
    
    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your bag is currently empty.</p>';
        if (subtotalSpan) subtotalSpan.innerText = "₹0";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const priceValue = parseInt(item.price.replace(/[₹,]/g, ''));
        total += priceValue;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                    <button onclick="removeItem(${index})" class="remove-item-btn">Remove</button>
                </div>
            </div>
        `;
    });

    if (subtotalSpan) subtotalSpan.innerText = "₹" + total.toLocaleString('en-IN');
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};