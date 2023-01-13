window.onload = () =>{
    if(!localStorage.user){
        location.replace('/login')
    }
}


const placeOrderBtn = document.querySelector('.place-order-btn');
placeOrderBtn.addEventListener('click', ()=>{
    let address = getAddress();

        if(address){
            fetch('/order', {
                method: 'post',
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify({
                    order: JSON.parse(sessionStorage.cart),
                    email: JSON.parse(localStorage.user).email,
                    address: address
                })
            }).then(response => response.json()).then(data => window.location = data.url)
            .then(data =>{
                delete sessionStorage.cart
            })
        }
})

const getAddress = () =>{
    let address = document.querySelector('#address').value
    let street = document.querySelector('#street').value
    let city = document.querySelector('#city').value
    let state = document.querySelector('#state').value
    let pincode = document.querySelector('#pincode').value
    let landmark = document.querySelector('#landmark').value

    if(!address.length || !street.length || !city.length || !state.length || !pincode.length || !landmark.length){
        showAlert('Fill all the inputs')
    } else {
        return { address, street, city, state, pincode, landmark};
    }
}