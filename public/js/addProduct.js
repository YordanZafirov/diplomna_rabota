let user = JSON.parse(localStorage.user || null);
let loader = document.querySelector('.loader');

//checking if user is logged in or not
window.onload = () => {
    if (user) {
        if (!compareToken(user.authToken, user.email)) {
            location.replace('/login');
        }
    } else {
        location.replace('/login');
    }
}

//price inputs

const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
    if (discountPercentage.value > 100) {
        discountPercentage.value = 90;
    } else {
        let discount = actualPrice.value * discountPercentage.value / 100;
        sellPrice.value = (actualPrice.value - discount).toFixed(2);
    }
});

sellPrice.addEventListener('input', () => {
    let discount = (sellPrice.value / actualPrice.value) * 100;
    discountPercentage.value = Math.floor(discount);
    if (discountPercentage.value >= 100) {
        discountPercentage.value = 0;
    }
});

let uploadImages = document.querySelectorAll('.file-upload');
let imagePaths = []; // all uploaded images

uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let imageUrl;

        if (file.type.includes('image')) {
            //user uploaded an image
            fetch('/s3url').then(res => res.json())
                .then(url => {
                    fetch(url, {
                        method: 'PUT',
                        headers: new Headers({
                            'Content-Type': 'multipart/form-data'
                        }),
                        body: file
                    }).then(res => {
                        imageUrl = url.split('?')[0];
                        imagePaths[index] = imageUrl;
                        let label = document.querySelector(`label[for=${fileupload.id}]`);
                        label.style.backgroundImage = `url(${imageUrl})`;
                        let productImage = document.querySelector('.product-image');
                        productImage.style.backgroundImage = `url(${imageUrl})`;
                    })
                })
        } else {
            showAlert('Upload image only!')
        }
    })
})

//form submission

const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#short-des');
const des = document.querySelector('#des');

let sizes = []; //stores all sizes

const tags = document.querySelector('#tags');


// btns
const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

const storeSizes = () => {
    sizes = []; //to reset the array
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if (item.checked) {
            sizes.push(item.value);
        }
    })
}

const validateForm = () => {
    if (!productName.value.length) {
        return showAlert('Enter product name')
    } else if (shortLine.value.length < 10 || shortLine.value.length > 100) {
        return showAlert('Short description must be between 10 and 100 characters long')  // oprawi go towa we prost
    } else if (!des.value.length) {
        return showAlert('Enter detail description about the product');
    } else if (!imagePaths.length) {
        return showAlert('Upload at least one product image')
    } else if (!sizes.length) {
        return showAlert('Select at least one size');
    } else if (!actualPrice.value.length || !discountPercentage.value.length || !sellPrice.value.length) {
        return showAlert('You must add pricings');
    }  else if (!tags.value.length) {
        return showAlert('Enter few tags to help ranking your product in search');
    } 
    return true;
}

const productData = () =>{
    let tagArr = tags.value.split(',');
    tagArr.forEach((item, i)=> tagArr[i] = tagArr[i].trim())
    return data = {
        name: productName.value,
        shortDes: shortLine.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discountPercentage.value,
        sellPrice: sellPrice.value,
        tags: tagArr,
        email: user.email
    }
}

addProductBtn.addEventListener('click', () => {
    storeSizes();
    //validate form
    if (validateForm()) {
        loader.style.display = 'block'
        let data = productData();
        if(productId){
            data.id = productId
        }
        sendData('/add-product', data)
    }
})

//save draft btn
saveDraft.addEventListener('click', ()=>{
    // store sizes
    storeSizes();
    if(!productName.value.length){
        showAlert('Enter product name');
    } else { //dont validate the data
        let data = productData();
        data.draft = true;
        if(productId){
            data.id = productId
        }
        sendData('/add-product', data);
    }
})

const setFormsData = (data) =>{
    productName.value = data.name;
    shortLine.value = data.shortDes;
    des.value = data.des;
    actualPrice.value = data.actualPrice;
    discountPercentage.value = data.discount;
    sellPrice.value = data.sellPrice;
    tags.value = data.tags;

    //setup images
    imagePaths = data.images;
    imagePaths.forEach((url, i)=>{
    let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
    label.style.backgroundImage = `url(${url})`;
    let productImage = document.querySelector('.product-image');
    productImage.style.backgroundImage = `url(${url})`;
    })
    
    //setup sizes
    sizes =data.sizes;
    let sizesCheckbox = document.querySelectorAll('.size-checkbox');
    sizesCheckbox.forEach(item =>{
        if(sizes.includes(item.value)){
            item.setAttribute('checked', '');
        }
    })
}

const fetchProductData = () =>{

    fetch('/get-product', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({email: user.email, id: productId})
    })
    .then(res => res.json())
    .then(data =>{
        setFormsData(data);
    })
    .catch(err =>{
        location.replace('/seller')
    })
}

// existing product detail handler
let productId = null;
if(location.pathname != '/add-product'){
    productId =decodeURI(location.pathname.split('/').pop())

    let productDetail = JSON.parse(sessionStorage.tempProduct || null);
    
        fetchProductData();
}

