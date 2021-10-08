var express = require('express');
const path = require("path");
var router = express.Router();
const fs = require("fs");
const { RSA_NO_PADDING } = require('constants');
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const category = require("../models/Category");
const Images = require("../models/Images");




//const multer = require('multer')





//get all of the categories and add them to database if they are not there yet
let categories = [];





console.log(categories);
fs.readFile("./public/categories.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    }
    categories = JSON.parse(data);
    console.log("got categories");
    console.log(categories);

    //add to db

    categories.forEach(element => {
        console.log("element is " + element.name);
        category.findOne({ name: element.name }, (err, name) => {
            if (err) {
                return next(err);
            }
            console.log(element);
            if (!name) {
                new category({
                    name: element.name
                }).save((err) => {
                    if (err) return console.log(err);

                });
            } else {
                return console.log("Already added " + element.name + " into database");
            }
        });
    });

});



/* GET home page. */
router.get('/category/', (req, res, next) => {

    console.log("getting diets from the db");
    category.find({}, (err, categories) => {
        console.log(categories);
        if (err) {
            return next(err);
        }
        if (categories) {
            return res.json(categories);
        } else {
            return res.status(404).send("Failed to get diet categories");
        }
    });




});

let recipes = [];

router.get('/recipe/', function(req, res, next) {
    //get the excisting recipes
    Recipe.find({}, (err, recipes) => {
            if (err) {
                return next(err);
            }
            if (recipes) {
                return res.json(recipes);
            } else {
                return res.status(404).send("Recipes not found!");
            }
        })
        // res.json(req.body);
    console.log('got recipes');
});

let imageNames = [];
let imageIds = [];



//post images



//const upload = multer({ dest: path.join(__dirname, './public/images') }).single("images");


router.post('/images', (req, res, next) => {
    console.log("inside post images");
    /* upload(req, res, (err) => {

         if (err) {
             console.log("upload error");
         }*/
    console.log("sdjkfh");
    console.log(req.files);
    console.log("file count: " + req.files.length);
    const imageCount = req.files.length;
    for (var x = 0; x < imageCount; x++) {


        new Images({
            buffer: req.files[x].buffer,
            name: req.files[x].name,
            mimetype: req.files[x].mimetype,
            encoding: req.files[x].encoding
        }).save((err) => {
            if (err) return next(err);
            console.log("fdojishg");
            //return res.send(req.files);
        });


        //});
    }

    res.end();
});


router.post('/recipe/', function(req, res, next) {
    //add to database
    Recipe.findOne({ name: req.body.name }, (err, name) => {
        if (err) {
            return next(err);
        }
        /*for (var i = 0; i < imageNames.length; i++) {
            console.log("in images names loop");
            Images.find({ name: imageNames[i] }, (err, image) => {
                console.log("found the image");
                if (err) {
                    return next(err);
                }
                imageIds.push(image._id);
            });
        }*/
        if (!name) {
            new Recipe({
                name: req.body.name,
                instructions: req.body.instructions,
                ingredients: req.body.ingredients,
                categories: req.body.categories,
                images: []
            }).save((err) => {
                if (err) return next(err);
                return res.send(req.body);
            });
        } else {
            return res.status(403).send("Already has a recipe for that food");
        }

    });
    imageNames = [];
    //res.json(req.body);
});

/* GET recipe page . */
router.get('/recipe/:food', function(req, res, next) {
    const foodName = req.params.food;
    Recipe.find({ name: new RegExp(foodName, "i") }, (err, recipes) => {
            if (err) {
                return next(err);
            }
            if (recipes.length > 0) {
                console.log(recipes);
                return res.send(recipes)

            } else {

                return res.status(404).send("No recipe that has " + foodName + " in the name");
            }
        }

    );
    console.log(req.params.food);

});



module.exports = router;