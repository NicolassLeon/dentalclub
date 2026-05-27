document.addEventListener('DOMContentLoaded', () => {
    
    const formatter = new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    });

    const priceElements = document.querySelectorAll('.product-price');
    priceElements.forEach(element => {
        const basePrice = Number(element.getAttribute('data-price'));
        if (!isNaN(basePrice)) {
            element.textContent = formatter.format(basePrice);
        }
    });

    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        const productCards = document.querySelectorAll('.product-card');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const track = document.querySelector('.carousel-track');
    if(track) {
        const items = document.querySelectorAll('.carousel-item');
        const btnPrev = document.querySelector('.carousel-prev');
        const btnNext = document.querySelector('.carousel-next');
        let currentIndex = 0;

        function updateCarousel() {
            track.scrollTo({
                left: track.clientWidth * currentIndex,
                behavior: 'smooth'
            });
        }

        function nextSlide() {
            currentIndex++;
            if (currentIndex >= items.length) {
                currentIndex = 0;
            }
            updateCarousel();
        }

        function prevSlide() {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = items.length - 1;
            }
            updateCarousel();
        }

        btnNext.addEventListener('click', nextSlide);
        btnPrev.addEventListener('click', prevSlide);

        setInterval(nextSlide, 30000);
    }

    let cart = JSON.parse(localStorage.getItem('dentalclub_cart')) || [];
    const cartCountElement = document.getElementById('cart-count');

    function updateCartCount() {
        if(cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = Number(card.getAttribute('data-price'));
            const img = card.getAttribute('data-img');

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            localStorage.setItem('dentalclub_cart', JSON.stringify(cart));
            updateCartCount();
            
            const originalText = btn.textContent;
            btn.textContent = '¡Agregado!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        });
    });

    updateCartCount();

    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartContainer) {
        function renderCart() {
            cartContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartContainer.innerHTML = '<p style="text-align:center; margin-top: 2rem;">Tu carrito está vacío.</p>';
                cartTotalElement.textContent = formatter.format(0);
                return;
            }

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const itemHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; padding: 1rem 0;">
                        <img src="${item.img}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: contain; border-radius: 8px; background-color: #fff;">
                        <div style="flex-grow: 1; padding: 0 1rem;">
                            <h4 style="margin-bottom: 0.5rem; color: var(--text-main);">${item.name}</h4>
                            <p style="color: var(--primary-color); font-weight: bold;">${formatter.format(item.price)}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <span>Cant: ${item.quantity}</span>
                            <button class="remove-btn" data-index="${index}" style="background: #e74c3c; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">Eliminar</button>
                        </div>
                    </div>
                `;
                cartContainer.innerHTML += itemHTML;
            });

            cartTotalElement.textContent = formatter.format(total);

            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    cart.splice(idx, 1);
                    localStorage.setItem('dentalclub_cart', JSON.stringify(cart));
                    renderCart();
                    updateCartCount();
                });
            });
        }
        
        renderCart();
    }
});