//get mongoose
const mogoose = require("mongoose");

//get schema
const Schema = mogoose.Schema;

//tells what is inside the db collection
let categoryShema = new Schema({
    name: String,
});

module.exports = mogoose.model("category", categoryShema);