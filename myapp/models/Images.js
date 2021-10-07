//get mongoose
const mogoose = require("mongoose");

//get schema
const Schema = mogoose.Schema;

//tells what is inside the db collection
let imageShema = new Schema({
    buffer: Buffer,
    name: String,
    mimetype: String,
    encoding: String
});

module.exports = mogoose.model("Images", imageShema);