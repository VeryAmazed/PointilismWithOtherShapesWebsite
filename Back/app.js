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

// use rate limiter to stop ddos stuff

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
    // don't trust user data, it can be modified using inspect element
    // double check evrything here
    const curr_id = req.body.u_id;
    console.log(req.file, req.body);
    // check to make sure that the u_id exists
    // sanitize that their curr id actually exists, and that their operation is valid
    // check the file size
    // check to make sure the radius value is a number
    if(curr_id === -1){
        res.status(400);
    }
    // create a new directory every time user uploads a file
    
    // also instead of storyng arrays in the map, it's better to create a class or an object
    id_to_images.set(curr_id, [req.file.originalname, req.file.filename]);
    
    // create unique directory
    // move the file in
    // start the worker thread
    // rename the file
    // convert to ppm with arbitrary name with - strip // do it in 2 commands
    // run operation
    // convert back to jpg with name operation_(filename).jpg
    // if anything happens during this, just throw an error
    // otherwise check for the exit event i think
    // then send the file back and delete the directory

    // modify the images in here
    // use -strip when converting file types to get rid of comments in ppm file
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
            // delete dir in sendFile callback function
            console.log("File sent");
            console.log(path.join(__dirname, `uploads/${id_to_images.get(curr_id)[2]}`));
        }
        
    });
    
    
});

app.listen(8080);

