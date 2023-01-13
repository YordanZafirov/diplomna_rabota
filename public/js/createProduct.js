const createProduct = (data) =>{
    let productContainer = document.querySelector('.product-container');
    productContainer.innerHTML += `
    <div class="product-card">
       <div class="product-image">
       ${data.draft ? `<span class="tag">Draft</span>`: ''}
           <img src="${data.images[0] || 'img/noImage.jpg'}" class="product-thumb" alt="sundress">
           <button class="card-acton-btn edit-btn" onclick="location.href = '/add-product/${data.id}'"><i class="fa-solid fa-pencil"></i></button>
           <button class="card-acton-btn open-btn" onclick = "location.href ='/product/${data.id}'"><i class="fa-solid fa-arrow-rotate-left"></i></button>
           <button class="card-acton-btn delete-btn" onclick="openDeletePopup('${data.id}')"><i class="fa-solid fa-trash"></i></button>
       </div>
       <div class="product-info">
           <h2 class="product-brand">${data.name}</h2>
           <p class="product-short-des">${data.shortDes}</p>
           <span class="price">$${data.sellPrice}</span><span class="actual-price">$${data.actualPrice}</span>
       </div>
    </div>`
}

const openDeletePopup = (id) =>{
    let deleteAlert = document.querySelector('.delete-alert');
    deleteAlert.style.display = 'flex';

    let closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', ()=>{
        deleteAlert.style.display = null;
    })
    let deleteBtn = document.querySelector('.delete-button');
    deleteBtn.addEventListener('click', ()=> deleteItem(id))
}

const deleteItem = (id) =>{
    fetch('/delete-product', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: id})
    }).then(res =>res.json())
    .then(data =>{
        if(data == 'success'){
            location.reload();
        } else{
            showAlert('Some error has occured while deleting the product. Try Again')
        }
    })
}