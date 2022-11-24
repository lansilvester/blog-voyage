const mongoose = require("mongoose");
const database = process.env.MONGO_URI ||"mongodb://127.0.0.1:27017/voyage_blog";

const connect = () => {
    mongoose
        .connect(database,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        .catch(err=>console.log(err));
    mongoose.connection.on("connected", () => {
        console.log(`${database} terkoneksi...`)
    })
}

mongoose.connection.on('error', err=> {
    console.error('MongoDB connection error', err);
})

module.exports = connect;