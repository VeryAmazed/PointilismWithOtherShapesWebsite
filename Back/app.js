const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const {Worker} = require('worker_threads');
//const bodyParser = require('body-parser');


const app = express();
const upload = multer({dest: 'uploads/'});

app.use(express.json());
//app.use(bodyParser.json());
let id = 1;
const idSet = new Set();

// use rate limiter to stop ddos stuff

app.use(express.static(path.join(__dirname, '/../Front')));
// right now assigned ids are not unique, everyone is getting 1 for som reason
app.get('/id', (req,res)=>{
    console.log(idSet);
    
    console.log(1<<30);
    while(idSet.has(id)){
        id++;
        if(id > (1<<30)){
            
            id = 1;
                
        }
    }
    idSet.add(id);
    console.log(id);
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
    // check if these values are undefined
    if(curr_id === -1){
        res.status(400);
    }
    // create a new directory every time user uploads a file
    
    
    // create unique directory
    // move the file in
    // or don't delete and I'll use find-remove to clean stuff out every 30 minutes
    fs.mkdir(`uploads/dir${curr_id}`, (err)=>{
        // error if it already exists
        if(err){
            // delete file and delete id from map
            res.status(400);
        }
        fs.copyFile(`uploads/${req.file.filename}`, `uploads/dir${curr_id}/${req.file.originalname}`, (err)=>{
            // overrides dest
            if(err){
                // delete file, directory and id thingy from map
                res.status(400);
            }
            fs.unlink(`uploads/${req.file.filename}`, (err)=>{
                if(err){
                    // delete directory and id thingy
                    res.status(400);
                }
                const data = {id: curr_id, name: req.file.originalname, op: req.body.operation, rad: req.body.radius};
                const worker = new Worker('./worker.js', {workerData: data});
                worker.on('error', (err)=>{
                    console.log("error occured in worker");
                    console.log(err.message);
                    res.status(400);
                });
                worker.on('exit', ()=>{
                    res.status(200);
                    console.log("we try to send a file");
                    res.sendFile(path.join(__dirname, `uploads/dir${curr_id}/${req.body.operation}_${req.file.originalname}`));
                    // delete stuff
                })
                
            });
        });
    });

    // start the worker thread
    // rename the file
    // convert to ppm with arbitrary name with - strip // do it in 2 commands
    // run operation
    // convert back to jpg with name operation_(filename).jpg
    // if anything happens during this, just throw an error
    // otherwise check for the exit event i think
    // then send the file back and delete the directory

    /*
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
    */
    
});
// we do need a post to handle removing set elements
app.listen(8080);

