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
                    console.log("added to db");

                });
            } else {
                return console.log("Already added " + element.name + " into database");
            }
        });
    });

});



/* GET category page. */
router.get('/category', (req, res, next) => {

    console.log("getting diets from the db");
    category.find({}, (err, categories) => {
        //console.log(categories);
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




//post images



//const upload = multer({ dest: path.join(__dirname, './public/images') }).single("images");


router.post('/images', (req, res, next) => {

    /* upload(req, res, (err) => {

         if (err) {
             console.log("upload error");
         }*/

    console.log(req.files);

    const imageCount = req.files.length;
    for (var x = 0; x < imageCount; x++) {
        let originalName = req.files[x].originalname;
        console.log("server: " + req.files[x].originalname);
        imageNames.push(req.files[x].originalname);
        new Images({
            buffer: req.files[x].buffer,
            name: req.files[x].originalname,
            mimetype: req.files[x].mimetype,
            encoding: req.files[x].encoding
        }).save((err) => {
            if (err) return next(err);
            console.log("saved image: " + originalName);
            //return res.send(req.files);
        });


        //});
    }

    res.end();
});


router.post('/recipe/', function(req, res, next) {
    //add to database
    let imageIds = [];
    Recipe.findOne({ name: req.body.name }).then(name => {
        if (!name) {
            if (req.body.images.length == 0) {
                new Recipe({
                    name: req.body.name,
                    instructions: req.body.instructions,
                    ingredients: req.body.ingredients,
                    categories: req.body.categories,
                    images: imageIds
                }).save((err) => {
                    if (err) return next(err);
                    console.log("saved new recipe");
                });
            } else {
                for (var i = 0; i < req.body.images.length; i++) {

                    Images.find({ name: req.body.images[i] })
                        .then(image => {

                            imageIds.push(image[0]._id);
                            console.log("id is: " + imageIds);
                            //imageIds.push(image[0]._id);
                        }).catch(err => console.log(err))
                        .then(() => {
                            /*Recipe.findOne({ name: req.body.name }).then(name => {
        
                            if (!name) {*/
                            if (imageIds.length == req.body.images.length) {
                                new Recipe({
                                    name: req.body.name,
                                    instructions: req.body.instructions,
                                    ingredients: req.body.ingredients,
                                    categories: req.body.categories,
                                    images: imageIds
                                }).save((err) => {
                                    if (err) return next(err);
                                    console.log("saved new recipe");
                                });
                            }

                        }).catch(err => console.log(err));
                }
            }
        } else {
            console.log("already recipe!!!")
        }
    }).catch(err => console.log(err));



    imageIds = [];
    imageNames = [];
    return res.json(req.body);
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