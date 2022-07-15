const connectToMongo = require("./db");
require('dotenv').config();

var cors=require('cors');
connectToMongo(process.env.MONGO);

const express = require('express')
const app = express()
const port = 5000

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res)=>{
  return res.status(200).json({"health": "ok"});
})
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNote backend listening on port ${port}`)
})