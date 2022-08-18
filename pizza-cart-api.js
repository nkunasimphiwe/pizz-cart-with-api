document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            init() {

                pizzaURL = 'https://pizza-cart-api.herokuapp.com/api/pizzas'
                
                axios
                    .get(pizzaURL)
                    .then((result) => {
                        const pizzalist = result.data.pizzas
                        this.pizzalists = pizzalist 
                    })
                    .then(() => {
                        return this.createCart()
                    })
                    .then((result) => {
                        this.cartId = result.data.cart_code
                    })
            },

            createCart() {

                return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)  
                   
            },
            
            showCards() {
              const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
            
            axios
                .get(url)
                .then((result) => {
                    this.cart = result.data;
                });
            
            },

            pizzaImage(pizza) {
                return `./image/${pizza.size}.jpg`
            },
        
            message : '',
            username : 'Simphiwe',
            pizzalists : [],
            cartId : '',
            cart : {total : 0},
            inputPayment: 0,
            paymentMessage: '',

            add(pizza) {
                
                
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
              
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(()=> {
                        this.message = "Pizza added to cart"
                        this.showCards();
                    })
                    .catch(err => alert(err));

            },
            remove(pizza) {
                
                
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
              
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                    .then(()=> {
                        this.message = "Pizza removed from cart"
                        this.showCards();
                    })
                    .catch(err => alert(err));

            },

            payment() {
                const params = {
                    cart_code: this.cartId,

                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                    .then(()=> {
                        if (!this.inputPayment) {
                            this.paymentMessage = 'Enter payment amount'
                        } else if (this.inputPayment >= this.cart.total) {
                            this.paymentMessage = 'Payment Succefful!!';
                            this.message = this.username + ' Completely Paid!!';
                        } else if (this.inputPayment < this.cart.total) {
                            this.paymentMessage = 'Payment Not Succefful...';
                        }
                        
                    })
                    .catch(err => alert(err));
            }
        }

    })
})