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
let id = ['0'];
const key = 'we1x*59';


// use rate limiter to stop ddos stuff

app.use(express.static(path.join(__dirname, '/../Front')));

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
    const curr_id = req.body.u_id;
    console.log(req.file, req.body);
    // check to make sure that the u_id exists
    // sanitize that their curr id actually exists, and that their operation is valid
    // check the file size
    // check to make sure the radius value is a number
    // check if these values are undefined
    
    // maybe, if the id isn't in the set we just add it into the set
    if(!curr_id.endsWith(key)){
        const err = new Error("Invalid ID");
        next(err);
        return;
    }
    
    // or don't delete and I'll use find-remove to clean stuff out every 30 minutes
    fs.mkdir(`uploads/dir${curr_id}`, {recursive: true}, (err)=>{
        // error if it already exists
        if(err){
            next(err);
            
        }
        fs.copyFile(`uploads/${req.file.filename}`, `uploads/dir${curr_id}/${originalname_str}`, (err)=>{
            // overrides dest
            if(err){
                next(err);
                
            }
            fs.unlink(`uploads/${req.file.filename}`, (err)=>{
                if(err){
                    next(err);
                    
                }
                const data = {id: curr_id, name: originalname_str, op: req.body.operation, rad: req.body.radius};
                const worker = new Worker('./worker.js', {workerData: data});
                worker.on('error', (err)=>{
                    console.log("error occured in worker");
                    console.log(err.message);
                    next(err);
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

