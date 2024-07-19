const mongoose= require("mongoose");
const Listing = require("../models/listing.js");
const initData=require("./data.js");


main().then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLand");
}


const initDB=async()=>{
    await Listing.deleteMany({});
    
    initData.data=initData.data.map((obj)=>(
        {
        ...obj,
        owner:"666857788208b0e02daefc4a",
        }
));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
