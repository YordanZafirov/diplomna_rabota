const createFooter = () =>{
    let footer = document.querySelector('footer')
    footer.innerHTML = `
    <div class="footer-content">
            <p class="logo">WarriorStyle</p>
            <div class="footer-ul-container">
                <ul class="category">
                <li class="category-title">All Product Categories</li>
                <li><a href ='/search/T-Shirt' class="footer-link">t-shirts</a></li>
                <li><a href ='/search/Sweatshirt' class="footer-link">sweatshirts</a></li>
                <li><a href ='/search/Shirt' class="footer-link">shirts</a></li>
                <li><a href ='/search/Jeans' class="footer-link">jeans</a></li>
                <li><a href ='/search/Shoes' class="footer-link">shoes</a></li>
                <li><a href ='/search/Casual' class="footer-link">casuals</a></li>
                <li><a href ='/search/Formal' class="footer-link">formals</a></li>
                <li><a href ='/search/Sport' class="footer-link">sports</a></li>
                </ul>
            </div>
        </div>
        <p class="footer-title">About me</p>
        <p class="info">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio, repellat.</p>
        <p class="info">support email - warriorstyle@gmail.com</p>
        <p class="info">phone number - 0891442342</p>
        <div class="footer-socials-cont">
            <div>
                <a href="#" class="soc">terms & services</a>
                <a href="#" class="soc">privacy page</a>
            </div>
            <div>
                <a href="#" class="soc">instagram</a>
                <a href="#" class="soc">facebook</a>
            </div>
        </div>
    
        <p class="footer-credit">WarriorStyle - The Best Clothing Store</p>
    `;
}

createFooter();