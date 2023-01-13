let loader = document.querySelector('.loader');
let user = JSON.parse(localStorage.user || null);

const becomeSellerElement = document.querySelector('.become-seller');
const productListingElement = document.querySelector('.product-listing');
const applyForm = document.querySelector('.apply-form');
const showApplyFormBtn = document.querySelector('#apply-btn');

window.onload = () =>{
    if(user){  
        if(compareToken(user.authToken, user.email)){
            if(!user.seller){
                location.replace('/login');
            }else {
                setupProduct();
            }           
        }else {
            location.replace('/login');
        }
    } else {
        location.replace('/login');
    }
}

const setupProduct = () =>{
    fetch('/get-product', {
        method: 'post',
        headers: new Headers({"Content-type": "application/json"}),
        body: JSON.stringify({email: user.email})
    })
    .then(res => res.json())
    .then(data => {
        loader.style.display = null;
        if(data == 'No products'){
            let emptySvg = document.querySelector('.no-product-image');
            emptySvg.classList.remove('hide');
        } else {
            data.forEach(product => createProduct(product))
        }
    });
}