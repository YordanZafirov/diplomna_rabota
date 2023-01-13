let char = `123abcde.fmnopqlABCDE@FJKLMNOPQRSTUVWXYZ456789stuvwxyz0!#$%&ijkrgh'*+-/=?^${'`'}{|}~`;

const generateToken = (key) =>{
    let token = '';
    for(let i = 0; i < key.length; i++){
        let index = char.indexOf(key[i]) || char.length / 2;
        let randomIndex = Math.floor(Math.random() * index);
        token += char[randomIndex] + char[index - randomIndex]; 
    }
    return token;
}

const compareToken = (token, key) => {
    let string = '';
    for (let i = 0; i < token.length; i += 2) {
        let index1 = char.indexOf(token[i]);
        let index2 = char.indexOf(token[i+1]);
        string += char[index1 + index2];
    }

    if(string === key){
        return true;
    }
    return false;
}



// send data function
const sendData = (path, data) => {
    fetch(path, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(response => {
            processData(response);
        })
}

const processData = (data) => {
    console.log(data);
    loader.style.display = null;
    if (data.alert) {
        showAlert(data.alert);
    } else if (data.name) {
        //create authToken
        data.authToken = generateToken(data.email);
        localStorage.user = JSON.stringify(data);
        location.replace('/')
    } else if(data == true){
        //seller's page
        let user = JSON.parse(localStorage.user)
        user.seller = true;
        localStorage.user = JSON.stringify(user);
        location.reload()
    } else if(data.product){
        location.href = '/seller'
    }
}

//alert func
const showAlert = (msg, type) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    let alertImg = document.querySelector('.alert-img')
    alertMsg.innerHTML = msg;

    if(type == 'success'){
        alertImg.src = `img/success.png`
        alertMsg.style.color = `#0ab50a`;
    } else {
        alertImg.src = `img/error-icon.png`
        alertMsg.style.color = null;
    }


    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
    return false;
}