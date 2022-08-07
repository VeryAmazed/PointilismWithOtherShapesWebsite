const form = document.querySelector('form');

const inFile = document.querySelector('#image');
const radio = document.getElementsByName("operation");
// form submits and then we hide main and make a fetch request
let unique_id;
let img_url = null;

inFile.addEventListener("change", (e)=>{
    if(inFile.files[0].size > 8 * Math.pow(2, 20)){
        alert("File is too large. Max size is 8mb.");
        inFile.value = "";
    }
});

form.addEventListener('submit', (e)=>{
   e.preventDefault();
    document.querySelector('main').style.visibility = "hidden";
    document.querySelector("#waiting").style.visibility = "visible";
    let result;
    for(i = 0; i < radio.length; i++){
        if(radio[i].checked){
            result = radio[i].value;
        }
    }
    //check file size here
    const formData = new FormData();
    formData.append("image", inFile.files[0]);
    formData.append("operation", result);
    formData.append("radius", document.querySelector("#radius").value);
    fetch("http://localhost:8080/send", {
        method: "POST",
        body: formData,
    }).then((resp)=>{
        
        
        if(!resp.ok){
            if(resp.status === 429){
                document.querySelector("#error_msg").textContent = "Too many requests";
            }
            document.querySelector("#waiting").style.visibility = "hidden";
            document.querySelector("#error").style.visibility = "visible";
            throw new Error(`HTTP error! Status: ${ resp.status }`);
        }
        
        
        return resp.blob();
    }).then(resp =>{
        console.log("made it here2");
        console.log(resp);
        
        if(img_url !== null){
            URL.revokeObjectURL(img_url);
            console.log(img_url);
        }
        
        img_url =  URL.createObjectURL(resp);
        
        document.querySelector('main').style.visibility = "visible";
        document.querySelector("#waiting").style.visibility = "hidden";
        
       document.querySelector("#uploaded_image").src = img_url;
    });
    
});

