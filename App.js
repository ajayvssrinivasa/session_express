const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 3000;
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const sessionTime = 1000*60*60*24
app.use(sessions({
    secret: "fefeefefefefe",
    saveUninitialized: true,
    cookie:{maxAge:sessionTime},
    resave: false
}))
app.use(cookieParser())

app.get("/",(req, res)=>{
    res.render('regester');
})
app.get("/login",(req, res)=>{
    res.render('login');
})
app.post('/regdata',(req, res)=>{
    const password = 'aaaa';
    console.log(req.body.password)
    const hashPassword = bcrypt.hashSync(req.body.password, saltRounds)
    // console.log(hashPassword)
    // console.log(bcrypt.compareSync(password, hashPassword))
    if(bcrypt.compareSync(password, hashPassword)){
        res.send("Password matching")
    }
    else{
        res.send("password doesn't match")
    }
})
app.post('/postdata1',(req, res)=>{

    let data = JSON.parse(fs.readFileSync('login.json'));
    const hashPassword = bcrypt.hashSync(req.body.password, saltRounds)
    let reg_data = {email:req.body.email, password:hashPassword, id: data.length + 1};
    data.push(reg_data);
    fs.writeFileSync('login.json', JSON.stringify(data));
    // if(bcrypt.compareSync(password, hashPassword)){
    //     res.send("Password matching")
    // }
    // else{
    //     res.send("password doesn't match")
    // }
    res.redirect("/login")
//     fs.readFile('./post.json',(err,data)=>{
//         let postData=[];
//         if(err) throw err;
//         postData=JSON.parse(data)
//const hashpassword= bcrypt.hashSync(req.body.password, saltRounds)
//         postData.posts.push({
//             title:req.body.title,
//             body:hashpassword,
//             id:postData.posts.length+1
//         })
//         fs.writeFileSync('./post.json',JSON.stringify(postData),(err)=>{
//             if(err) throw err;
//         })
//     })
//     res,redirect('/')
// })
})
app.post("/postdata",(req, res)=>{
    let data1 = fs.readFileSync('login.json');
    let data = JSON.parse(data1);
    // console.log(data)
    let login_data = data.filter(dt=> dt.email === req.body.email);
    // console.log(login_data);
    if(login_data[0]){
        if(bcrypt.compareSync(req.body.password, login_data[0].password)){
            let session = req.session;
            session.email = req.body.email;
                res.redirect('/dashboard')
            }
            else{
                res.redirect('/login')
            }
}
else{
    res.send("Invalid Email")
}
})
// app.post("/postdata",(req, res)=>{
//     let data1 = fs.readFileSync('login.json');
//     let data = JSON.parse(data1);
//     console.log(data)
//     let login_data = data.filter(dt=> dt.email === req.body.email);
//     if(login_data.length>0){
//     if(req.body.email === login_data[0].email && req.body.password === login_data[0].password){
//         let session = req.session;
//         session.email = req.body.email;
//         res.redirect("/dashboard")
//     }
//     else{
//         res.send("Invalid username and password")
//     }
// }
// else{
//     res.redirect('/login')
// }
// })
app.get("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("/login");
})
app.get("/dashboard", (req, res)=>{
    let session = req.session;
    if(session.email){
        res.render("dashboard",{email:session.email});
    }
    else{
        res.redirect("/login");
    }
})

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Working on ${port}`);
})