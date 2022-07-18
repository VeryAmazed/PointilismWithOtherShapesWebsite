const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');



const app = express();
const upload = multer({dest: 'uploads/'});
app.use(express.json())
let id = 1;
const id_to_images = new Map();
/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/../Front/index.html'));

  });
  */

  // On first get request (on load), pass back an id to the user and store the image name and original name in a map corresponding to that id
  // On first post store everything, override previous instance, on second post modify and send back files and delete them
  // on window close (on unload) get rid of the id 
app.use(express.static(path.join(__dirname, '/../Front')));

app.get('/id', (req,res)=>{
    
    let retry = false;
    while(id_to_images.has(id)){
        id++;
        if(id > (1<<50)){
            
            if(retry){
                res.status(400).end();
                break;
            }else{
                id = 1;
                retry = true;
            }
            
        }
    }
    
    res.send({value: id});
    
});


app.post('/send', upload.single('image'), (req, res)=>{
    
    console.log(req.file, req.body);
    if((req.body).u_id == -1){
        res.status(400).end();
    }
    id_to_images.set((req.body).u_id, [req.file.originalname, req.file.filename]);
    console.log(id_to_images);
    res.status(200);
})

app.listen(8080);

