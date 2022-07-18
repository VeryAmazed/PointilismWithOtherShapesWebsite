const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { nextTick } = require('process');
const e = require('express');

const app = express();
const upload = multer({dest: 'uploads/'});
app.use(express.json())
/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/../Front/index.html'));

  });
  */

  //On first post request, pass back an id to the user and store the image name and original name in a map corresponding to that id
app.use(express.static(path.join(__dirname, '/../Front')));
app.post('/', upload.single('image'), (req, res)=>{
    let code = 200;
    // ok to rename. If second post is called during the first post, it'll be thrown in the callback queue after the first post
    fs.rename(`uploads/${req.file.filename}`, `uploads/${req.file.originalname}`, (error) =>{
        if(error){
            console.log(error);
            code = 400;
        }
    })
    
   
    console.log(req.file, req.body);
    if(code == 200){
        console.log(path.join(__dirname, `uploads/${req.file.originalname}`));
        res.sendFile(path.join(__dirname, `uploads/${req.file.originalname}`), (err)=>{
            if(err){
                next(err);
                res.status(400).end();
            }
        });
    }else{
        res.status(400).end();
    }
    
})

app.listen(8080);

