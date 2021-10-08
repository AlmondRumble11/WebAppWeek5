//get mongoose
const mogoose = require("mongoose");

//get schema
const Schema = mogoose.Schema;

//tells what is inside the db collection
let recipeShema = new Schema({
    name: String,
    instructions: Array,
    ingredients: Array,
    categories: Array,
    images: Array
});

module.exports = mogoose.model("Recipe", recipeShema);