// create small product cards

const createSmallCard = (data) =>{
    return `
    <div class="sm-product">
         <img src="${data.image}" alt="" class="sm-product-img">
         <div class="sm-text">
             <div class="sm-product-name">${data.name}</div>
             <div class="sm-des">${data.shortDes}</div>
         </div>
         <div class="item-counter">
            <button class="counter-btn decrease">-</button>
            <p class="item-count">${data.item}</p>
            <button class="counter-btn increase">+</button>
         </div>
            <p class="sm-price" data-price = "${data.sellPrice}">$${(data.sellPrice * data.item).toFixed(2)}</p>
            <button class="sm-delete-btn"><i class="fa-solid fa-xmark"></i></button>
    </div>
    `
}
let totalBill = 0;

const setProducts = (name) =>{
    const element = document.querySelector(`.${name}`);
    let data = JSON.parse(sessionStorage.getItem(name));
    if(data == null){
        element.innerHTML = `<img src="img/empty-cart.png" alt="" class="empty-img">` || null;
    } else {
        for(let i = 0; i < data.length; i++){
            element.innerHTML += createSmallCard(data[i]);
            if(name == 'cart'){
                totalBill += Number(data[i].sellPrice * data[i].item);
            }
        }
        updateBill();
    }
    setupEvents(name)
}

const updateBill = ()=>{
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML = `$${totalBill.toFixed(2) }`;
}

let quantity = 0;
let finalBill = 0;

const setupEvents = (name)=>{
    //setup counter event
    const counterMinus = document.querySelectorAll(`.${name} .decrease`);
    const counterPlus = document.querySelectorAll(`.${name} .increase`);
    const counts = document.querySelectorAll(`.${name} .item-count`);
    const price = document.querySelectorAll(`.${name} .sm-price`);
    const deleteBtn = document.querySelectorAll(`.${name} .sm-delete-btn`);

    let product = JSON.parse(sessionStorage.getItem(name));

    counts.forEach((item, i)=>{
        let cost = Number(price[i].getAttribute('data-price'));

        counterMinus[i].addEventListener('click', ()=>{
            if(item.innerHTML > 1){
                item.innerHTML--;
                totalBill -=cost;
                if(name == 'cart'){ updateBill(); }
                price[i].innerHTML = `$${(item.innerHTML * cost).toFixed(2)}`;
                product[i].item = item.innerHTML;
                sessionStorage.setItem(name, JSON.stringify(product));
            }
        })
        counterPlus[i].addEventListener('click', ()=>{
            if(item.innerHTML < 9){
                item.innerHTML++;
                totalBill += cost;
                if(name == 'cart'){ updateBill(); }
                price[i].innerHTML = `$${(item.innerHTML * cost).toFixed(2)}`;
                product[i].item = item.innerHTML;
                sessionStorage.setItem(name, JSON.stringify(product));
            }
        })  
    })
    deleteBtn.forEach((item, i)=>{
        item.addEventListener('click', ()=>{
            product = product.filter((data, index)=> index != i);
            sessionStorage.setItem(name, JSON.stringify(product))
            
            if(sessionStorage.cart == '[]' || sessionStorage.cart == undefined){
                sessionStorage.clear();
            }
            location.reload();
        })
    }) 
}


setProducts('cart')
setProducts('wishlist')