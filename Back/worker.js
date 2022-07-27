const { exec, execFile } = require('child_process');
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');

//path.join(__dirname, `/uploads/dir${data.id}/${data.op}_${data.name}`);
const data = workerData;
/*
fs.stat(path.join(__dirname, `/uploads/dir${data.id}/${data.name}`), (err, stats)=>{
    if(err){
        console.log("stat error");
        console.log(err.message);
    }
    
});
*/
exec(`convert ${path.join(__dirname, `/uploads/dir${data.id}/${data.name}`)} -strip ${path.join(__dirname, `/uploads/dir${data.id}/${data.op}.ppm`)}`, (err)=>{
    if(err){
        console.log("here1");
        throw new Error(err.message);
    }
    exec(`${path.join(__dirname, 'manip.out')} ${path.join(__dirname, `/uploads/dir${data.id}/${data.op}.ppm`)} ${data.op} ${data.rad} ${data.id}`, (err, stdout, stderr)=>{
        console.log(stdout);
        console.log(stderr);
        if(err){
            console.log("here2");
            console.log(stdout);
            console.log(stderr);
            console.log(err.code);
            console.log(err.message);
            throw new Error(err.message);
        }
        console.log("here3");
        exec(`convert ${path.join(__dirname, `/uploads/dir${data.id}/"after_"${data.op}.ppm`)} ${path.join(__dirname, `/uploads/dir${data.id}/${data.op}_${data.name}`)}`, (err)=>{
            if(err){
                console.log("here4");
                throw new Error(err.message);
            }
        });
    });
});




