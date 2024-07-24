const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db');

//Database Connection
connectDB();

//App Configuration
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors())
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// Routes
const { companyRoutes,userRoutes } = require("./routes");
app.use('/api', companyRoutes);
app.use('/api', userRoutes);



//Default Route
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Backend Server</h1>`,);
});


//Server Configuration
const { PORT } = require("./config/environment");
const port = PORT || 3600;
app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
