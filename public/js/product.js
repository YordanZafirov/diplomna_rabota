const prodImg = document.querySelectorAll('.product-images img');
const prodImgSlide = document.querySelector('.image-sliders');

let activeImageSlide = 0;

prodImg.forEach((item, i) =>{
    item.addEventListener('click', ()=>{
        prodImg[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        prodImgSlide.style.backgroundImage = `url('${item.src}') `
        activeImageSlide = i;
    });
});

//toggle size buttons

const sizeBtns = document.querySelectorAll('.size-radio-btn');
let checkedBtn = 0;
let size;

sizeBtns.forEach((item, i)=>{
    item.addEventListener('click', ()=>{
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        checkedBtn = i;
        size = item.innerHTML;
    })
})

const setData = (data) =>{
    let title = document.querySelector('title');
    title.innerHTML += ` ${data.name}`;

    // setup the images
    prodImg.forEach((img, i)=>{
        if(data.images[0]){
            img.src = data.images[i];
        } else {
            img.style.display = 'none';
        }
    })
    prodImg[0].click();

    //setup size buttons
    sizeBtns.forEach(item =>{  //shows only the available sizes
        if(!data.sizes.includes(item.innerHTML)){
            item.style.display = 'none';
        }
    })

    //seтting up texts
    const name = document.querySelector('.product-brandd');
    const shortDes = document.querySelector('.product-short-des');
    const sellPrice = document.querySelector('.product-price');
    const actualPrice = document.querySelector('.product-actual-price');
    const discount = document.querySelector('.product-discount');
    const description = document.querySelector('.des')

    name.innerHTML = ` ${data.name}`;
    shortDes.innerHTML = ` ${data.shortDes}`;

    sellPrice.innerHTML = ` $${data.sellPrice}`;
    actualPrice.innerHTML = `$${data.actualPrice}`;
    discount.innerHTML = `${data.discount}%`;
    
    description.innerHTML = `${data.des}`;

    // wishlist and cart btn
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', ()=>{
        wishlistBtn.innerHTML = add_product_to_cart_or_wishlist('wishlist', data) 
    })
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.addEventListener('click', ()=>{
        cartBtn.innerHTML = add_product_to_cart_or_wishlist('cart', data)
    })
}

const fetchProductData = () =>{
    fetch('/get-product', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: productId})
    })
    .then(res => res.json())
    .then(data => {
        setData(data)
        getProducts(data.tags[1]).then(data => createProductSlider(data, '.container-for-card-slider', 'similar products'))
    })
    .catch(err => {
        location.replace('/404')
    })
}

let productId = null;
if(location.pathname != '/product'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData()
}