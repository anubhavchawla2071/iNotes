const mongoose=require('mongoose');
// const mongoURI='mongodb+srv://anubhavchawla02:Alohomora%4002@notes-cluster.y6qzo.mongodb.net/iNotes';

const connectToMongo=(mongoURI)=>{
    mongoose.connect(mongoURI,()=>console.log("connected to mongoose successfully"));
}
module.exports=connectToMongo;