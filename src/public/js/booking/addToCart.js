const addToCartBTNElement = document.querySelector('.cart-btn');

const debounce = (func, wait, immediate) => {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


const ClickAddToCartBtn = async () => {
    const CustomerID = '676428113c01571292ae5b9d'; // customerID tạm thời
    const selectedTicketsArray = JSON.parse(localStorage.getItem('selectedTickets') || '[]');

    try {
        // Send update request to the backend API
        const response = await fetch('/api/shopping-cart/' + CustomerID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: selectedTicketsArray,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update shopping cart');
        }

        const updatedCart = await response.json();
        console.log('Shopping cart updated:', updatedCart);
    } catch (error) {
        console.error('Error updating shopping cart:', error);
    }
};

const debouncedClickAddToCartBtn = debounce(ClickAddToCartBtn, 3000);

addToCartBTNElement.addEventListener('click', debouncedClickAddToCartBtn);