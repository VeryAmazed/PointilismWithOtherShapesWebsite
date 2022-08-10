const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const {Worker} = require('worker_threads');

const app = express();
const upload = multer({dest: 'uploads/'});
const findRemoveSync = require('find-remove');
const rateLimit = require('express-rate-limit');

// rudimentary rate-limiter to avoid people spamming the server
const sendLimiter = rateLimit({
    windowMS: 15*60*1000,
    max: 180,
    // will not lie, don't know what these do
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

});

// periodically clean up the uploads folder of files and folders that were not removed due to errors occuring during the post request handling
// setInterval takes a callback so we use .bind() to return a function while being able to give it the desired arguments
setInterval(findRemoveSync.bind(this, path.join(__dirname, '/uploads'), {dir: '*', files: ['*.*', '*'], age: {seconds: 1800}}), 1800000);
app.use(express.json());

// use rate limiter to stop ddos stuff
app.use(express.static(path.join(__dirname, '/Front')));
app.use('/send', sendLimiter);
// each post requests gets its own unique id
let id = ['0'];
const valid_operations = ["pointilism", "rectanglism", "trianglism", "hexagonism"];
// helper function that generates the next unique id
function getNextId(){
    if(id[id.length-1] === '9'){
        id[id.length-1] = 'a';
    }else if(id[id.length-1] === 'z'){
        id.push('0');
    }else{
        id[id.length - 1] = String.fromCharCode(id[id.length-1].charCodeAt(0)+1);
    }
    return id.join('');
}

app.post('/send', upload.single('image'), (req, res, next)=>{
    const curr_id = getNextId();
    
    // goes through and sees if the operation argument sent in the request is a valid one
    let isValidOp = false;
    for(let i = 0; i < valid_operations.length; i++){
        if(req.body.operation === valid_operations[i]){
            isValidOp = true;
        }
    }
    // convert the radius argument into an integer
    const parsed = parseInt(req.body.radius, 10);
    
    // fail requests were the image sent is over 8mb
    if(req.file.size > 8*Math.pow(2,20)){ // 8 * 2^20, 8mb
        const err = new Error("File size too large");
        next(err);
        return;
    }
    // check if the operation argument is valid
    else if(!isValidOp){
        const err = new Error("Not a supported operation");
        next(err);
        return;
    }
    // make sure the radius argument is valid, is a number, isn't too large, and isn't negative
    else if(isNaN(parsed) || parsed < 0 || parsed > 141){
        const err = new Error("Radius is not valid");
        next(err);
        return;
    }

    // handle filenames with spaces in them
    let originalname = [];
    for(let i = 0; i < req.file.originalname.length; i++){
        if(req.file.originalname.charCodeAt(i) === 32){
            originalname.push('_');
        }else{
            originalname.push((req.file.originalname)[i]);
        }
    }
    const originalname_str = originalname.join('');
    
    // make a unique directory for each seperate request
    fs.mkdir(`uploads/dir${curr_id}`, (err)=>{
        // use express default error handling and fail the request (end the method) if there is an error
        if(err){
            next(err);
            return;
        }
        // copy the image file into the directory and rename it
        fs.copyFile(`uploads/${req.file.filename}`, `uploads/dir${curr_id}/${originalname_str}`, (err)=>{
            // overrides dest
            if(err){
                next(err);
                return;
            }
            // delete the original image file after it is copied over
            fs.unlink(`uploads/${req.file.filename}`, (err)=>{
                if(err){
                    next(err);
                    return;
                }
                // create a new thread where the image processing takes place
                const data = {id: curr_id, name: originalname_str, op: req.body.operation, rad: req.body.radius};
                const worker = new Worker('./worker.js', {workerData: data});
                worker.on('error', (err)=>{
                    next(err);
                    return;
                });
                // means image processing was succesful
                worker.on('exit', ()=>{
                    res.status(200);
                    // send the file back to the user
                    res.sendFile(path.join(__dirname, `uploads/dir${curr_id}/${req.body.operation}_${originalname_str}`), (err)=>{
                        // remove the directory made for this post request, try, catch block here because in express 4.0, express doesn't automatically handle errors in async functions
                        try{
                            fs.rmSync(`uploads/dir${curr_id}`, {force: true, recursive: true});
                        }catch(err){
                            next(err);
                        }
                    });
                    
                })
                
            });
        });
    });
    
});

app.listen(8080);

