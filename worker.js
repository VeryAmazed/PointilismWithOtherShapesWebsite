const { exec, execFile } = require('child_process');
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const data = workerData;

// use ImageMagicks convert function to turn the image into a ppm
exec(`convert ${path.join(__dirname, `/uploads/dir${data.id}/${data.name}`)} -strip ${path.join(__dirname, `/uploads/dir${data.id}/${data.op}.ppm`)}`, (err)=>{
    // if anything goes wrong, we throw an error
    if(err){
        throw new Error(err.message);
    }
    // perform the image processing operation. node's exec function interprets a return value that is not 0 as an error so manip.out returns 1 if anything goes wrong
    exec(`${path.join(__dirname, 'manip.out')} ${path.join(__dirname, `/uploads/dir${data.id}/${data.op}.ppm`)} ${data.op} ${data.rad} ${data.id}`, (err, stdout, stderr)=>{
        if(err){
            throw new Error(err.message);
        }
        // convert the ppm file back into the original file format
        exec(`convert ${path.join(__dirname, `/uploads/dir${data.id}/"after_"${data.op}.ppm`)} ${path.join(__dirname, `/uploads/dir${data.id}/${data.op}_${data.name}`)}`, (err)=>{
            if(err){
                throw new Error(err.message);
            }
        });
    });
});




