var express = require('express');
const path = require("path");
var router = express.Router();
const fs = require("fs");
const { RSA_NO_PADDING } = require('constants');
const mongoose = require("mongoose");
const Recipes = require("../models/Recipes");
const category = require("../models/Category");
const Images = require("../models/Images");
const multer = require('multer')

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
router.get('/categories/', (req, res, next) => {

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
    Recipes.find({}, (err, recipes) => {
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

router.post('/recipe/', function(req, res, next) {
    //add to database
    Recipes.findOne({ name: req.body.name }, (err, name) => {
        if (err) {
            return next(err);
        }
        if (!name) {
            new Recipes({
                name: req.body.name,
                instructions: req.body.instructions,
                ingredients: req.body.ingredients,
                categories: req.body.categories,
                images: req.body.images
            }).save((err) => {
                if (err) return next(err);
                return res.send(req.body);
            });
        } else {
            return res.status(403).send("Already has a recipe for that food");
        }

    });
    //res.json(req.body);
});

//get images
router.post('/images', (req, res, next) => {
    //add to database
    /* Images.findOne({ name: req.body.name }, (err, name) => {
         if (err) {
             return next(err);
         }
         if (!name) {
             new Images({
                 buffer: Buffer,
                 name: req.body.name,
                 mimetype: req.body.type,
                 encoding: req.body.encoding
             }).save((err) => {
                 if (err) return next(err);
                 return res.send(req.body);
             });
         } else {
             return res.status(403).send("Already has a recipe for that food");
         }

     });*/
    console.log("in images");
    console.log(req.body);
    res.end();
});

/* GET recipe page . */
router.get('/recipe/:food', function(req, res, next) {
    const foodName = req.params.food;
    Recipes.find({ name: new RegExp(foodName, "i") }, (err, recipes) => {
            if (err) {
                return next(err);
            }
            if (recipes.length > 0) {
                console.log(recipes);
                return res.send(recipes)
                    /*res.json({
                                        "name": "piiza",
                                        "instructions": ["jhjds", "dfsd"],
                                        "ingredients": ["jdshfjkds", "kjsdfhjk"],
                                    });*/
            } else {

                return res.status(404).send("No recipe that has " + foodName + " in the name");
            }
        }

    );
    console.log(req.params.food);
    /*res.json({
        "name": req.params.food,
        "instructions": ["jhjds", "dfsd"],
        "ingredients": ["jdshfjkds", "kjsdfhjk"],
    });*/


    //res.render("public/index.html");
    //res.sendFile('public/index.html', { name: req.params.food, instructions: ["jhjds", "dfsd"], ingredients: ["jdshfjkds", "kjsdfhjk"] });
    //console.log(path.join(__dirname + '/index.html'));
});



module.exports = router;