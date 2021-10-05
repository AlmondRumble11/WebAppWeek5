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

    //get the buttons
    const submit = document.getElementById("submit");
    const addIngredient = document.getElementById("add-ingredient");
    const addInstruction = document.getElementById("add-instruction");

    let ingredientList = [];
    let instructionList = [];

    //get the text
    const instrucionText = document.getElementById("instructions-text");
    const ingredientText = document.getElementById("ingredients-text");

    //add food name and instructions to screen
    const foodName = document.getElementById("food-name");
    const instructionName = document.getElementById("instruction-name");
    const ingredientName = document.getElementById("ingredient-name");
    const instructionOl = document.getElementById("instruction-list");
    const ingredientDl = document.getElementById("ingredient-list");



    //fecth data

    fetch("http://localhost:3000/recipe/pizza")
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





    //get ingredients
    addIngredient.addEventListener("click", () => {

        //add to list
        ingredientList.push(ingredientText.value);

        console.log("added " + ingredientText.value + " to list");
        console.log(ingredientList);
        ingredientText.value = "";
    });

    //get instructions
    addInstruction.addEventListener("click", () => {

        //add to list
        instructionList.push(instrucionText.value);

        console.log("added " + instrucionText.value + " to list");
        console.log(instructionList);
        instrucionText.value = "";
    });

    //get images
    const formData = new FormData();
    const imageInput = document.getElementById("image-input");

    imageInput.addEventListener("change", () => {
        const files = imageInput.files;
        console.log(files.length);
        //https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata
        for (var x = 0; x < files.length; x++) {
            formData.append('images', files[x]);
        }

        console.log(files);
        console.log("iujashdiuhasd" + formData.get('images'));

    });


    //submit button
    submit.addEventListener("click", () => {
        const nameText = document.getElementById("name-text");

        fetch("http://localhost:3000/recipe/", {
            method: "post",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ name: nameText.value, instructions: instructionList, ingredients: ingredientList })
                /*'{ "name": ' + nameText.value +
                    ', "instructions": ' + instructionList +
                    ', "ingredients": ' + ingredientList + '}'*/
        }).catch(err => { console.log(err) });



        console.log(nameText.value, instructionList, ingredientList);
        console.log(formData.get("images"));

        //clear the fields
        instrucionText.value = "";
        ingredientText.value = "";
        nameText.value = "";
        imageInput.value = "";

        //post images
        //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        fetch("http://localhost:3000/images", {
            method: "post",
            body: formData
        }).catch(err => { console.log(err) });

        ingredientList = [];
        instructionList = [];
        console.log("submit button works");
    });

}