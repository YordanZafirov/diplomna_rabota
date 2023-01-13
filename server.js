const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');


// firebase admin setup
let serviceAccount = require("./ecom-website-81990-firebase-adminsdk-g0lwp-ff11fd3703.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

//aws config
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

//aws parameters
const region = "eu-central-1";
const bucketName = "ecom-website1";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

//stripe keys 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

//init s3
const s3 = new aws.S3();

//generate image upload link
async function generateUrl() {
    let date = new Date();
    let id = parseInt(Math.random() * 10000000000);

    const imageName = `${id}${date.getTime()}.jpg`;

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300, //ms
        ContentType: 'image/jpeg'
    })
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}

//static path
let staticPath = path.join(__dirname, "public");

const app = express();



//middleware
app.use(express.static(staticPath));
app.use(express.json());

//routes
//home route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})

//signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
})

const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

app.post('/signup', (req, res) => {
    let {
        name,
        email,
        password,
        number,
        terms,
        notification
    } = req.body;

    //form validation
    if (name.length < 3) {
        return res.json({
            'alert': 'Name must be 3 characters long'
        });
    } else if (!email.length) {
        return res.json({
            'alert': 'Enter your email'
        });
    } else if (!mailformat.test(email)) {
        return res.json({
            'alert': 'Invalid email address'
        })
    } else if (password.length < 6) {
        return res.json({
            'alert': 'Password must be 6 characters or more'
        });
    } else if (!number.length) {
        return res.json({
            'alert': 'Enter your phone number'
        });
    } else if (!Number(number) || number.length != 10) {
        return res.json({
            'alert': 'Invalid phone number'
        });
    } else if (!terms) {
        return res.json({
            'alert': 'You must agree to our terms and conditions'
        });
    }

    //store user in db
    db.collection('users').doc(email).get()
        .then(user => {
            if (user.exists) {
                return res.json({
                    'alert': 'Email already exists'
                });
            } else {
                // encrypt the password before storing
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        db.collection('users').doc(email).set(req.body)
                            .then(data => {
                                res.json({
                                    name: req.body.name,
                                    email: req.body.email,
                                    seller: req.body.seller,
                                });
                            })
                    })
                })
            }
        })
})

// login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, "login.html"));
})

app.post('/login', (req, res) => {
    let {
        email,
        password
    } = req.body;

    if (!email.length || !password.length) {
        return res.json({
            'alert': 'Fill all the inputs'
        });
    }

    db.collection('users').doc(email).get()
        .then(user => {
            if (!user.exists) {
                //if email does not exist
                return res.json({
                    'alert': 'Email does not exist'
                });
            } else {
                bcrypt.compare(password, user.data().password, (err, result) => {
                    if (result) {
                        let data = user.data();
                        return res.json({
                            name: data.name,
                            email: data.email,
                            seller: data.seller
                        })
                    } else {
                        return res.json({
                            'alert': 'Password is incorrect'
                        });
                    }
                })
            }
        })
})

// seller route
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req, res) => {
    let {
        name,
        address,
        about,
        number,
        terms,
        legitInfo,
        email
    } = req.body;
    if (!name.length || !address.length || !about.length || number.length != 10 || !Number(number)) {
        return res.json({
            'alert': 'Information is invalid'
        });
    } else if (!terms || !legitInfo) {
        return res.json({
            'alert': 'You must agree to our terms and conditions'
        });
    } else {
        //update user's seller status
        db.collection('sellers').doc(email).set(req.body)
            .then(data => {
                db.collection('users').doc(email).update({
                    seller: true
                }).then(data => {
                    res.json(true);
                })
            })
    }

});

//add product
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
});

app.get('/add-product/:id', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
});

//get the upload link
app.get('/s3url', (req, res) => {
    generateUrl().then(url => res.json(url));
})

//add product
app.post('/add-product', (req, res) => {
    let {
        name,
        shortDes,
        des,
        images,
        sizes,
        actualPrice,
        discount,
        sellPrice,
        tags,
        terms,
        email,
        draft,
        id
    } = req.body;

    //validation
    if (!draft) {
        if (!name.length) {
            return res.json({
                'alert': 'Enter product name'
            });
        } else if (shortDes.length < 10 || shortDes.length > 100) {
            return res.json({
                'alert': 'Short description must be between 10 and 100 characters long'
            });
        } else if (!des.length) {
            return res.json({
                'alert': 'Enter detail description about the product'
            });
        } else if (!images.length) {
            return res.json({
                'alert': 'Upload at least one product image'
            });
        } else if (!sizes.length) {
            return res.json({
                'alert': 'Select at least one size'
            });
        } else if (!actualPrice.length || !discount.length || !sellPrice.length) {
            return res.json({
                'alert': 'You must add pricings'
            });
        } else if (!tags.length) {
            return res.json({
                'alert': 'Enter few tags to help ranking your product in search'
            });
        } 
    }

    //add product
    let docName = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random()* 5000)}` : id;
    db.collection('products').doc(docName).set(req.body)
        .then(data => {
            res.json({
                'product': name
            });
        })
        .catch(err => {
            return res.json({
                'alert': 'Some error occured. Try again'
            });
        })
})

// get products
app.post('/get-product', (req, res) => {
    let {
        email,
        id,
        tag
    } = req.body;

    if (id) {
        docRef = db.collection('products').doc(id);
    } else if (tag) {
        docRef = db.collection('products').where('tags', 'array-contains', tag);
    } else {
        docRef = db.collection('products').where('email', '==', email);
    }

    docRef.get()
        .then(products => {
            if (products.empty) {
                return res.json('No products');
            }
            let productArr = [];
            if (id) {
                return res.json(products.data());
            } else {
                products.forEach(item => {
                    let data = item.data();
                    data.id = item.id;
                    productArr.push(data);
                })
                res.json(productArr);
            }
        })
})

app.post('/delete-product', (req, res) => {
    let {
        id
    } = req.body;

    db.collection('products').doc(id).delete()
        .then(data => {
            res.json('success');
        }).catch(err => {
            res.json('err');
        })
})

//products page
app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})

app.get('/search/:key', (req, res) => {
    res.sendFile(path.join(staticPath, "search.html"));
})

app.get('/cart', (req, res) => {
    res.sendFile(path.join(staticPath, 'cart.html'));
})

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(staticPath, 'checkout.html'));
})

app.post('/order', async (req, res) => {
    const {
        order,
        email,
        address
    } = req.body;

    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: order.map(element =>{
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                           name: element.name
                        },
                        unit_amount: element.sellPrice * 100
                    },
                    quantity: element.item
                }
            }),
            success_url: `http://localhost:3000/success.html`,
            cancel_url: `http://localhost:3000/cancel.html`
        })
        
        res.status(303).json({url: session.url})
    } catch(e){
        res.status(500).json({error: e.message})
    }
    

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const mailOption = {
        from: 'warriorstyle123@gmail.com',
        to: email,
        subject: 'WarriorStyle: Order Placed',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
   </head>
   <style>
       body{
        min-height: 90vh;
        background: #f5f5f5;
        font-family: sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .heading{
        text-align: center;
        font-size: 40px;
        width: 50%;
        display: block;
        line-height: 50px;
        margin: 30px auto 60px;
      }
    .  heading span{
        font-weight: 300;
      }
      p{
        text-align: center;
        font-size: 27px;
        width: 50%;
        display: block;
        line-height: 50px;
        margin: 30px auto 60px;
      }
    </style>
    <body>

    <div>
        <h1 class="heading">Dear ${email.split('@')[0]}, <span>Your order is successfully placed</span></h1>
        <p> If you like to change your order or cancel it, please respond to this email. </p>
    </div>
    
</body>
</html>
        `
    }

    // let docName = email + Math.floor(Math.random() * 313141432);
    // db.collection('order').doc(docName).set(req.body)
    //     .then(data=>{
    //         transporter.sendMail(mailOption, (err, info)=>{
    //            if(err){
    //                res.json({'alert': 'Some error occured. Try again'})
    //            } else {
    //                res.json({'alert': 'Your order is placed'})
    //            }
    //         })
    //     })
})

app.get('/success', (req, res) => {
    res.sendFile(path.join(staticPath, "success.html"));
});

app.get('/cancel', (req, res) => {
    res.sendFile(path.join(staticPath, "cancel.html"));
});

//404 route
app.get('/404', (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
});


app.use((req, res) => {
    res.redirect('/404');
});

app.listen(3000);