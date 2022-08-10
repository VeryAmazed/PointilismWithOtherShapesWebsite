#
This is the public fork of this repository. All the commits and changes I keep on the private version of this repository and I just update this every once in a while.

Small Project I made to learn about Frontend and Backend Programming. Uses HTML, CSS, JS, Node.js, C++. Website takes an image uploaded by the user and returns a reconstruction of that image out of a shape of the user's choosing giving it a pointillism like effect. Idea/how to recreate an image out of circles to look like pointillism was inspired by a project I did in a university CS course. 

How to Use:
Copy over the entire repository. The directory structure is very important.
You can either build the docker file:
- install docker
- go inside the repository you cloned this to
- run this, docker build -t {some name in all lowercase} .
- then run this, docker run --publish 8080:8080 {name you just used}
- enter, http://localhost:8080/, into your browser

or you can run it on your own computer (only works on linux):
- install node, must be at least version 14 since this uses worker threads
- make sure npm is initialised
- go inside the repository you cloned this to
- run, npm install
- compile the manip.cpp into a file called manip.out, you can use: g++ -std=c++17 -o ./manip.out ./manip.cpp
- to run the server, node app.js
