//Server side code.
//To build a local version of the website on docker, run ./docker_build.sh then ./run_docker.sh 
//Open localhost:8080.
//To test without docker, run `node app.js`. Then open localhost:3000.

//To kill a docker image:
//docker ps (lists containers)
//docker kill <containerID>
//docker system prune -a
//Then you can build it again: run ./docker_build.sh then ./run_docker.sh 

//Neccessary imports
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs');
const path = require('path');

//Allow the frontend to access /public and /uploads when fetching data.
app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({extended: false}));


//Send our index.html file when we load the website.
app.get("/", function (req, res) {
    //console.log("in /")
    res.sendFile(process.cwd() + "/index.html");
});

//3000 is our default port. This is masked as 8080 when we run app.js in docker.
const port = 3000;
const host = "0.0.0.0";
app.listen(port, host, () => console.log(`Harlan's website listening on port 
${port}! (If running in docker, use port 8080)`));