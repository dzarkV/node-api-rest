import http from 'http';

const app = require('./app')

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Listening on localhost:${server.port}`);

// const server = Bun.serve({
//     app,
//     fetch(request) {
//         return new Response("Welcome to Bun!");
//     },
//     port: port,
//   });
  