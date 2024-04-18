const express = require("express");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const dbConnection = require("./config/db");
const colors = require("colors");



// Connect to database
dbConnection();

// route files
const auth = require("./routes/auth");
const users = require("./routes/user");


const app = express();


// Body Parser
app.use(express.json());

//cookie parser
app.use(cookieParser());


// Sanitize data
app.use(mongoSanitize());       // Prevent NoSQL Injection

// Set Security Header
app.use(helmet());

// Prevent XSS Attack
app.use(xss());

// Enable cors
app.use(cors());


// Rate Limiting
const limiter = rateLimit({
    windowMs: 10*60*1000, // 10 mins
    max:100
})

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// Development Logging Middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
} 


// Mount Routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);



PORT = process.env.PORT || 5001;


// Call Server
const server = app.listen(
    PORT, () => {
    console.log(`Server Running on ${process.env.NODE_ENV} mode on port ${PORT}`.white.bold)
    });


// Handle UnHandle promise rejection      

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.bgRed);
    //close server and exit process
    server.close(() => process.exit(1));
});


