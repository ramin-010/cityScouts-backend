require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app')

connectDB();


const PORT = process.env.PORT || 8001;
app.listen(PORT , ()=>{
  console.log(`CityScouts runnig at : ${PORT}`)
})


