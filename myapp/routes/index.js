var express = require('express');
const path = require("path");
var router = express.Router();
const fs = require("fs");
const { RSA_NO_PADDING } = require('constants');
const mongoose = require("mongoose");
const Recipes = require("../models/Recipes");


/* GET home page. */
router.get('/', function(req, res, next) {

    console.log("dsfdshjfgvhjds");
    //res.render('index', { title: 'Recipes' });


});

let recipes = [];

router.get('/recipe/', function(req, res, next) {
    //get the excisting recipes
    fs.readFileSync('./public/recipes.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        recipes = JSON.parse(data);
    });
    res.json(req.body);
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
                ingredients: req.body.ingredients
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
    console.log("in images");
    console.log(req.body);
    res.end();
});

/* GET recipe page . */
router.get('/recipe/:food', function(req, res, next) {

    console.log(req.params.food);
    res.json({
        "name": req.params.food,
        "instructions": ["jhjds", "dfsd"],
        "ingredients": ["jdshfjkds", "kjsdfhjk"],
    });


    //res.render("public/index.html");
    //res.sendFile('public/index.html', { name: req.params.food, instructions: ["jhjds", "dfsd"], ingredients: ["jdshfjkds", "kjsdfhjk"] });
    //console.log(path.join(__dirname + '/index.html'));
});



module.exports = router;