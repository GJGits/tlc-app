const http = require("http");
const app = require("./app");
// set port from environment variable and if it is not set choose one
const port = 3000;
const server = http.createServer(app);
server.listen(port, "0.0.0.0");
