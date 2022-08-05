
const express = require('express')
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const port = 8080

let threshold = 0.9;
let labelsToInclude = ["identity_attack", "insult", "threat"];

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  const app = express();

  app.get('/', (req, res) => {
    const { exec } = require("child_process");
    console.log(req.query.text)
      exec("python3 detoxifyme.py "+req.query.text, (error, stdout, stderr) => {
       res.send(stdout)
      });
  })
  
 
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}





