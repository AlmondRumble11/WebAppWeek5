//check if loading
if (document.readyState !== "loading") {
    console.log("Ready!!");
    ButtonFunctions();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("Wait a bit!");
        ButtonFunctions();

    });
}

function ButtonFunctions() {
    //get search function
    const search = document.getElementById("search");



    //get the buttons
    const submit = document.getElementById("submit");
    const addIngredient = document.getElementById("add-ingredient");
    const addInstruction = document.getElementById("add-instruction");

    let ingredientList = [];
    let instructionList = [];
    let imageID = [];

    //get the text
    const instrucionText = document.getElementById("instructions-text");
    const ingredientText = document.getElementById("ingredients-text");

    //add food name and instructions to screen
    const foodName = document.getElementById("food-name");
    const instructionName = document.getElementById("instruction-name");
    const ingredientName = document.getElementById("ingredient-name");
    const instructionOl = document.getElementById("instruction-list");
    const ingredientDl = document.getElementById("ingredient-list");

    let dietCount = 0;
    let categoryIDs = [];

    //get diets
    // console.log("fetch diets from the database");
    fetch("/category").then(res => res.json())
        .then(data => {
            const dataCount = data.length;
            dietCount = dataCount;
            //       console.log(dataCount);
            for (var i = 0; i < dataCount; i++) {
                //add diet categories
                //         console.log(data[i].name);
                const dietlabel = document.createElement("label");
                const dietInput = document.createElement("input");
                const dietSpan = document.createElement("span");

                //set label
                dietlabel.setAttribute("for", data[i]._id);

                //       console.log(data[i]._id);
                //input type, id and name to input
                dietInput.setAttribute("type", "checkbox");
                dietInput.name = "category";
                dietInput.id = data[i]._id;
                categoryIDs.push(data[i]._id);

                //add span name
                dietSpan.innerHTML = data[i].name;

                // add input and span to label
                dietlabel.appendChild(dietInput);
                dietlabel.appendChild(dietSpan);
                dietlabel.appendChild(document.createElement("br"));

                //get parent node
                const parentNode = document.getElementById("category-div");

                //append label to parent node
                parentNode.appendChild(dietlabel);
            }
            //  console.log(data);
        }).catch(err => { console.log(err) });

    //fecth data

    /*    fetch("http://localhost:3000/recipe/juusto")
            .then(res => res.json())
            .then(data => {


                foodName.textContent = data.name;
                console.log(data.name);
                instructionName.textContent = "Instruction";
                ingredientName.textContent = "Ingredient";

                data.ingredients.forEach(element => {
                    const dlListItem = document.createElement("dd");
                    dlListItem.innerHTML = element;
                    ingredientDl.appendChild(dlListItem);
                });
                data.instructions.forEach(element => {
                    const olListItem = document.createElement("li");
                    olListItem.innerHTML = element;
                    instructionOl.appendChild(olListItem);
                });
            }).catch(err => { console.log(err) });;
    */
    //fectch search data
    search.addEventListener("keypress", (event) => {
        const searchData = search.value;

        if (event.key == "Enter") {
            if (foodName.textContent != "") {
                ingredientDl.innerHTML = "";
                instructionOl.innerHTML = "";
                imageID = [];
            }
            //console.log("seach value is:" + searchData);
            //console.log("/recipe/" + searchData);
            fetch("/recipe/" + searchData).then(res => res.json())
                .then(data => {


                    // foodName.textContent = data.name;
                    foodName.innerHTML = data.name;
                    instructionName.textContent = "Instruction";
                    ingredientName.textContent = "Ingredient";
                    console.log(data);

                    //get data for the recipe
                    /* data.forEach(element => {
                         foodName.textContent = element.name;*/
                    data.ingredients.forEach(value => {
                        const dlListItem = document.createElement("dd");
                        dlListItem.innerHTML = value;
                        ingredientDl.appendChild(dlListItem);
                    });

                    data.instructions.forEach(value => {
                        const olListItem = document.createElement("li");
                        olListItem.innerHTML = value;
                        instructionOl.appendChild(olListItem);
                    });
                    //  console.log(element.categories);
                    data.categories.forEach(value => {

                        const diets = document.getElementsByName("category");
                        for (var i = 0; i < dietCount; i++) {
                            //console.log(value, categoryIDs[i]);
                            //console.log(diets[i]);
                            const checkbox = document.getElementById(value);
                            if (value == categoryIDs[i]) {

                                //  console.log(checkbox);
                                checkbox.checked = true;
                            } else {
                                //    console.log(diets[i].name + " is not checked");
                                checkbox.checked = false;
                            }
                        }
                    });
                    //  console.log("getting image ids from the recipe object");
                    data.images.forEach(value => {
                        console.log("imgid: " + value);
                        imageID.push(value);
                    });
                }).then(() => {
                    //get images based on the id from the recipe.images
                    const imgDiv = document.getElementById("images");
                    //  console.log("getting images using ids:" + imageID);
                    for (var i = 0; i < imageID.length; i++) {
                        let img = imageID[i];
                        //     console.log("img=" + img);
                        fetch("/images/" + img).then(res => res).then(data => {

                            //    console.log("inside img fetch");
                            //    console.log(data.url);
                            const newImg = document.createElement("img");
                            newImg.src = data.url;
                            imgDiv.appendChild(newImg);
                        }).catch(err => console.log(err));
                    }
                }).then(res => res)
                .then(data =>
                    console.log(data)
                )
                .catch(err => console.log("post error: " + err));


            //}).catch(err => { console.log(err) });



            searchData.innerHTML = "";

        }
    });

    //get ingredients
    addIngredient.addEventListener("click", () => {

        //add to list
        ingredientList.push(ingredientText.value);

        //   console.log("added " + ingredientText.value + " to list");
        //   console.log(ingredientList);
        ingredientText.value = "";
    });

    //get instructions
    addInstruction.addEventListener("click", () => {

        //add to list
        instructionList.push(instrucionText.value);

        // console.log("added " + instrucionText.value + " to list");
        // console.log(instructionList);
        instrucionText.value = "";
    });

    //get images
    const formData = new FormData( /*document.querySelector('form')*/ );
    const imageInput = document.getElementById("camera-file-input");
    let imagesArray = [];


    imageInput.addEventListener("change", (event) => {
        const files = imageInput.files;
        //  console.log("files: " + files);
        //  console.log("file count " + files.length);
        //https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
        for (var x = 0; x < files.length; x++) {
            //console.log("file " + x + " : " + files[x].);
            formData.append('images', files[x]);
            imagesArray.push(files[x].name);
            console.log(files[x].name);
        }

        //console.log(files);
        // console.log("iujashdiuhasd" + formData.get('images'));

    });


    //submit button
    submit.addEventListener("click", () => {


        const nameText = document.getElementById("name-text");
        //get categories
        const diets = document.getElementsByName("category");
        // console.log(diets.length);
        let categoryList = [];
        const catCount = diets.length
            //see if any diet is cheked and uncheck them
        for (var i = 0; i < catCount; i++) {
            //  console.log(diets[i].id);
            if (diets[i].checked == true) {
                categoryList.push(diets[i].id);
                //const checkbox = document.getElementById(diets[i].id);
                //const allCheckboxes = document.getElementsByName("category");
                diets[i].checked = false;
            }

        }


        // console.log(categoryList);

        //console.log(nameText.value, instructionList, ingredientList, categoryList, imagesArray);

        //console.log("adding images");
        const name = nameText.value;
        const inslist = instructionList;
        const imglist = imagesArray;
        const ctlist = categoryList;
        const inglist = ingredientList;

        /* fetch("/recipe/", {
                 method: "post",
                 headers: {
                     "Content-type": "application/json",
                 },
                 body: JSON.stringify({
                     name: name,
                     instructions: inslist,
                     ingredients: inglist,
                     categories: ctlist,
                     images: imglist
                 })

             }).then(res => res)
             .then(data =>
                 console.log(data)
             )
             .catch(err => console.log("post error: " + err));*/

        //post images
        //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        fetch("/images", {
                method: "post",
                body: formData,
            }).then(res => res).then(data =>
                console.log(data)
            )
            .then(() => {
                fetch("/recipe/", {
                        method: "post",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            name: name,
                            instructions: inslist,
                            ingredients: inglist,
                            categories: ctlist,
                            images: imglist
                        })

                    }).then(res => res)
                    .then(data =>
                        console.log(data)
                    )
                    .catch(err => console.log("post error: " + err));

            });

        //  console.log(formData.get("images"));

        //clear the fields
        instrucionText.value = "";
        ingredientText.value = "";
        nameText.value = "";
        imagesArray = [];

        imageInput.value = "";
        categoryList = [];


        ingredientList = [];
        instructionList = [];
        console.log("submit button works");



    })
};