const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');

// Import models first to ensure they're registered with Mongoose
require('./models');

const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const attractionRouter = require('./routes/attraction.routes');
const diningRouter = require('./routes/dining.routes');
const eventRouter = require('./routes/events.routes');
const searchRouter = require('./routes/search.routes')

// Middleware setup
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
            
const allowOrigin = [
    "http://localhost:3000",
    'http://localhost:5173',
    "https://city-scouts-frontend.vercel.app",
    
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) =>{   
        if(!origin || allowOrigin.includes(origin)){  // !origin for postman which has no origin
            callback(null, true);
        }
        else{
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,                                  // allowing forntend to send jwt, cookies etc
    methods: ["GET","POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]  //only allowed these custom headers
}))



//routes
app.use('/api/users', userRouter);
app.use('/api/auth',authRouter);
app.use('/api/attractions',attractionRouter)
app.use('/api/dining',diningRouter);
app.use('/api/v1', searchRouter); 
app.use('/api/events', eventRouter)

//erro handler middleware
app.use(errorHandler);


module.exports = app;