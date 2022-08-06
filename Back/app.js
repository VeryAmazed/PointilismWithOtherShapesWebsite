const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const {Worker} = require('worker_threads');
//const bodyParser = require('body-parser');


const app = express();
const upload = multer({dest: 'uploads/'});
const findRemoveSync = require('find-remove');
const rateLimit = require('express-rate-limit');

const sendLimiter = rateLimit({
    windowMS: 15*60*1000,
    max: 180,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

});

// setInterval takes a callback so we use .bind() to return a function while being able to give it the desired arguments
setInterval(findRemoveSync.bind(this, path.join(__dirname, '/uploads'), {dir: '*', files: ['*.*', '*'], age: {seconds: 1800}}), 1800000);
app.use(express.json());

// use rate limiter to stop ddos stuff
app.use(express.static(path.join(__dirname, '/../Front')));
app.use('/send', sendLimiter);

let id = ['0'];
const key = 'we1x*59';
const valid_operations = ["pointilism", "rectanglism", "trianglism", "hexagonism"];

app.get('/id', (req,res)=>{
    
    if(id[id.length-1] === '9'){
        id[id.length-1] = 'a';
    }else if(id[id.length-1] === 'z'){
        id.push('0');
    }else{
        id[id.length - 1] = String.fromCharCode(id[id.length-1].charCodeAt(0)+1);
    }
    console.log(id);
    
    console.log((id.join('')+key));
    res.send({value: (id.join('')+key)});
});


app.post('/send', upload.single('image'), (req, res, next)=>{
    const curr_id = req.body.u_id;
    console.log(req.file, req.body);
    let isValidOp = false;
    for(let i = 0; i < valid_operations.length; i++){
        if(req.body.operation === valid_operations[i]){
            isValidOp = true;
        }
    }

    const parsed = parseInt(req.body.radius, 10);
    console.log(parsed);
    //express error handling handles the case where any of these fields is undefined, including when the file is undefined
    if(!curr_id.endsWith(key)){
        const err = new Error("Invalid ID");
        next(err);
        return;
        
    }else if(req.file.size > 8*Math.pow(2,20)){ // 4 * 2^20, 4mb
        const err = new Error("File size too large");
        next(err);
        return;
    }else if(!isValidOp){
        const err = new Error("Not a supported operation");
        next(err);
        return;
    }else if(isNaN(parsed) || parsed < 0 || parsed > (1<<29)){
        const err = new Error("Radius is not valid");
        next(err);
        return;
    }

    let originalname = [];
    for(let i = 0; i < req.file.originalname.length; i++){
        if(req.file.originalname.charCodeAt(i) === 32){
            originalname.push('_');
        }else{
            originalname.push((req.file.originalname)[i]);
        }
    }
    const originalname_str = originalname.join('');
    console.log(originalname_str);
    // don't trust user data, it can be modified using inspect element
    // double check evrything here
    
    
    // check to make sure that the u_id exists
    // sanitize that their curr id actually exists, and that their operation is valid
    // check the file size
    // check to make sure the radius value is a number
    // check if these values are undefined
    
   
    
    // or don't delete and I'll use find-remove to clean stuff out every 30 minutes
    fs.mkdir(`uploads/dir${curr_id}`, (err)=>{
        // error if it already exists
        if(err){
            next(err);
            return;
            
        }
        fs.copyFile(`uploads/${req.file.filename}`, `uploads/dir${curr_id}/${originalname_str}`, (err)=>{
            // overrides dest
            if(err){
                next(err);
                return;
                
            }
            fs.unlink(`uploads/${req.file.filename}`, (err)=>{
                if(err){
                    next(err);
                    return;
                    
                }
                const data = {id: curr_id, name: originalname_str, op: req.body.operation, rad: req.body.radius};
                const worker = new Worker('./worker.js', {workerData: data});
                worker.on('error', (err)=>{
                    console.log("error occured in worker");
                    console.log(err.message);
                    next(err);
                    return;
                    //console.log(res.statusCode);
                    
                });
                worker.on('exit', ()=>{
                    res.status(200);
                    //console.log("we try to send a file");
                    res.sendFile(path.join(__dirname, `uploads/dir${curr_id}/${req.body.operation}_${originalname_str}`), (err)=>{
                        // add a try catch here
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
    
});

// cleaning up, use nodes setInterval and find-remove to get rid of random files in uploads that linger around

app.listen(8080);

