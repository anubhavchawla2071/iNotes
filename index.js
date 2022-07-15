const connectToMongo = require("./db");
const path = require('path');
require('dotenv').config();

var cors=require('cors');
connectToMongo(process.env.MONGO);

const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, './Frontend/build')));

app.get('/api/health', (req, res)=>{
  return res.status(200).json({"health": "ok"});
})
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './Frontend/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`iNote backend listening on port ${port}`)
})