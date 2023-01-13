const searchKey = decodeURI(location.pathname.split('/').pop());

const searchSpanElement = document.querySelector('#search-key');
searchSpanElement.innerText = searchKey;

getProducts(searchKey).then(data => createProductCard(data, '.card-container'))