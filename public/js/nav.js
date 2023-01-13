function createNav() {
    let nav = document.querySelector('.navbar').innerHTML += `
    <div class="nav">
            <img src="../img/logo.jpg" class = "brand-logo" alt="">
            <div class="nav-item">
                <div class="search">
                    <input type="text" class = "search-box" placeholder="Search brand, product, etc...">
                    <button class = "search-btn">Search</button>
                </div>
                <a>
                   <img src="../img/profile.png" id = "user-img" alt="">
                   <div class = "login-logout-popup hide">
                     <p class = "account-info"> Hello, name! </p>
                     <button class = "btn" id = "user-btn"> Log out </button>
                   </div>
                </a>
                <a href = "/cart"><img src="../img/cart.png" alt=""></a>
            </div>
        </div>
        <ul class = "links-container">
            <li class = "link-item"><a href="/" class="link">home</a></li>
            <li class = "link-item"><a href ='/search/Women' class="link">women</a></li>
            <li class = "link-item"><a href ='/search/Men' class="link">men</a></li>
            <li class = "link-item"><a href ='/search/Kids' class="link">kids</a></li>
            <li class = "link-item"><a href ='/search/Accessories' class="link">accessories</a></li>
            <li class = "link-item"><a href="/seller" class="link create-product">Create product</a></li>
        </ul>
    `;
}
createNav();

//nav popup
const userImg = document.querySelector('#user-img');
const userPopUp = document.querySelector('.login-logout-popup');
const popUpText = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');
const createProductLink = document.querySelector('.create-product');

userImg.addEventListener('click', ()=>{
    userPopUp.classList.toggle('hide')
});

window.onload= () => {
    let user = JSON.parse(localStorage.user || null);
    if(user != null){
        //user is logged in
        popUpText.innerHTML = `Hello, ${user.name}`;
        actionBtn.innerHTML = 'Log out';
        actionBtn.addEventListener('click', ()=>{
            localStorage.clear();
            location.reload()
        })
        
        if(user.seller == false || user.seller == undefined){
            createProductLink.style.display = 'none'
        }
    } else {
        //user is logged out
        createProductLink.style.display = 'none'
        popUpText.innerHTML = 'Log in to place order';
        actionBtn.innerHTML = 'Log in';
        actionBtn.addEventListener('click', ()=>{
            location.href = '/login';
        })
    }
}

//search box

const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box');

searchBtn.addEventListener('click', ()=>{
    if(searchBox.value.length){
        location.href = `/search/${searchBox.value}`
    }
})
