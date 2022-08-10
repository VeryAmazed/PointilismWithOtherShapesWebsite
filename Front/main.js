const form = document.querySelector('form');

const inFile = document.querySelector('#image');
const radio = document.getElementsByName("operation");
const radSelector = document.querySelector('#radius');
// form submits and then we hide main and make a fetch request
let img_url = null;

// check to make sure the user doesn't submit a file over 8mb
inFile.addEventListener("change", (e)=>{
    if(inFile.files[0].size > 8 * Math.pow(2, 20)){
        alert("File is too large. Max size is 8mb.");
        inFile.value = "";
    }
});

// everytime a new image is selected, radius is set back to zero/default
inFile.addEventListener("click", (e)=>{
    radSelector.value = "0";
})

form.addEventListener('submit', (e)=>{
    // don't use html form submission
    e.preventDefault();
    // Show the loading screen and hide the main page
    document.querySelector('main').style.visibility = "hidden";
    document.querySelector("#waiting").style.visibility = "visible";
    // find the operation the user chose
    let result;
    for(i = 0; i < radio.length; i++){
        if(radio[i].checked){
            result = radio[i].value;
        }
    }
    // use fromData object instead of html form submission, default enctype is multipart/form-data
    const formData = new FormData();
    formData.append("image", inFile.files[0]);
    formData.append("operation", result);
    formData.append("radius", document.querySelector("#radius").value);
    // send the formData as body to server
    fetch("http://localhost:8080/send", {
        method: "POST",
        body: formData,
    }).then((resp)=>{
        // if response is not ok show the error screen
        if(!resp.ok){
            // special message for rate limit exceeded error
            if(resp.status === 429){
                document.querySelector("#error_msg").textContent = "Too many requests";
            }
            document.querySelector("#waiting").style.visibility = "hidden";
            document.querySelector("#error").style.visibility = "visible";
            throw new Error(`HTTP error! Status: ${ resp.status }`);
        }
        return resp.blob();
    }).then(resp =>{     
        // if there is already a returned image being displayed, free it  
        if(img_url !== null){
            URL.revokeObjectURL(img_url);
            console.log(img_url);
        }
        img_url =  URL.createObjectURL(resp);
        // hide the loading screen and show the main page again
        document.querySelector('main').style.visibility = "visible";
        document.querySelector("#waiting").style.visibility = "hidden";
        // set displayed image to the returned image
        document.querySelector("#uploaded_image").src = img_url;
    });
    
});

