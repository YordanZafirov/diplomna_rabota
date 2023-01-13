const setupSlidingEffect = () =>{
    const productContainers = [...document.querySelectorAll('.product-container')];
    const nextBtn = [...document.querySelectorAll('.next-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];
    
    productContainers.forEach((item, i)=>{
        let containerDimension = item.getBoundingClientRect();  //gets card rectangle values(left,right,top,bottom, width, height)
        let containerWidth = containerDimension.width;
    
        nextBtn[i].addEventListener('click', ()=>{
            item.scrollLeft += containerWidth
        })
        preBtn[i].addEventListener('click', ()=>{
            item.scrollLeft -= containerWidth
        })
    })
}

//fetch product cards
const getProducts = (tag) =>{
    return fetch('/get-product', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({tag: tag})
    })
    .then(res => res.json())
    .then(data => {
        return data;
    })
}

//create product slider
const createProductSlider = (data, parent, title) =>{
    let slideContainer = document.querySelector(`${parent}`);
    
    slideContainer.innerHTML += `
    <section class="product">
    <h2 class="product-category">${title}</h2>
    <button class="pre-btn"><i class="fa-solid fa-arrow-left"></i></button>
    <button class="next-btn"><i class="fa-solid fa-arrow-right"></i></button>
    ${createProductCard(data)}
    </section>
    `

    setupSlidingEffect();
}

const createProductCard = (data, parent) =>{
    // parent is for search
    let start = '<div class="product-container">'
    let middle = '' //will contain card HTML
    let end = '</div>'
    
    for(let i = 0; i < data.length; i++){
        if(data[i].id != decodeURI(location.pathname.split('/').pop())){
            middle += `
        <div class="product-card">
                <div class="product-image">
                    <span class="discount-tag">${data[i].discount}% off</span>
                    <img src="${data[i].images[0]}" class="product-thumb" alt="">
                </div>
                <div class="product-info" onclick = "location.href = '/product/${data[i].id}'">
                    <h2 class="product-brand">${data[i].name}</h2>
                    <p class="product-short-des">${data[i].shortDes}</p>
                    <span class="price">$${data[i].sellPrice}</span>
                    <span class="actual-price">$${data[i].actualPrice}</span>
                </div>
            </div>
        `
        }
    }

    if(parent){
        let cardContainer = document.querySelector(parent)
        cardContainer.innerHTML = start + middle + end;
    } else {
        return start + middle + end;
    }        
}

const add_product_to_cart_or_wishlist = (type, product) =>{
    let data = JSON.parse(sessionStorage.getItem(type));
    console.log(data);
    if(data == null){
        data = [];
    }
    product = {
        item: 1,
        name: product.name,
        id: product.id,
        sellPrice: product.sellPrice,
        size: size || null,
        shortDes: product.shortDes,
        image: product.images[0]
    }

    data.push(product);
    sessionStorage.setItem(type, JSON.stringify(data))
    return 'added'
}