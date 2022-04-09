/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify. Get and fastify.post below
 */

 const express = require("express");
 const cors = require("cors");
 const app = express();
 const { createProxyMiddleware } = require("http-proxy-middleware");

 const PORT = process.env.PORT || 3000;
 
 app.use(cors());
 app.use(express.static('build'))
 
 app.use("/api", createProxyMiddleware({
   target: "https://property.spatialest.com",
   pathRewrite: {
     "^/api/search": "/co/elpaso/data/search", // rewrite path
     "^/api/propertycard": "/co/elpaso/data/propertycard",
   },
   changeOrigin: true,
 }));
 
 // Run the server and report out to the logs
 app.listen(PORT, function (err) {
   if (err) {
     process.exit(1);
   }
   console.log(`Your app is running at http://localhost:${PORT}/`);
 });
 