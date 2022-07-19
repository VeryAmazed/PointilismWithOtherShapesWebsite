const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

//const bodyParser = require('body-parser');


const app = express();
const upload = multer({dest: 'uploads/'});
app.use(express.json());
//app.use(bodyParser.json());
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
    const curr_id = req.body.u_id;
    console.log(req.file, req.body);
    if(curr_id === -1){
        res.status(400);
    }
    id_to_images.set(curr_id, [req.file.originalname, req.file.filename]);
    
    
    // modify the images in here
    // temp stand in code
    fs.copyFile(`uploads/${id_to_images.get(curr_id)[1]}`, `uploads/after_${req.body.operation}${curr_id}.jpg`, (err)=>{
        if(err){
            console.log(err);
            res.status(400);
        }else{
            id_to_images.get(curr_id).push(`after_${req.body.operation}${curr_id}.jpg`);
            console.log(id_to_images);
            res.status(200);
            res.sendFile(path.join(__dirname, `uploads/${id_to_images.get(curr_id)[2]}`));
            console.log("File sent");
            console.log(path.join(__dirname, `uploads/${id_to_images.get(curr_id)[2]}`));
        }
        
    });
    
    
});
/*
app.post('/retrieve', (req, res)=>{
    console.log("recieved");
    //const curr_id = req.body.u_id;
    const curr_id = 1;
    //console.log(req.body);
    //console.log(curr_id);
    console.log(id_to_images.get(curr_id));
    if(id_to_images.get(curr_id).length !== 3){
        console.log("bad");
        res.status(400);
    }else{
        res.sendFile(path.join(__dirname, `uploads/${id_to_images.get(curr_id)[2]}`));
    }
    
});
*/

app.listen(8080);

