const form = document.querySelector('form');
const button = document.querySelector('button');
const inFile = document.querySelector('#image');
const radio = document.getElementsByName("operation");
// form submits and then we hide main and make a fetch request
let unique_id = -1;

window.addEventListener('load', (e)=>{
    
    fetch('http://localhost:8080/id').then((resp) =>{
        //console.log("resp?");
        if(!resp.ok){
            
            throw new Error(`Http error! Status: ${resp.status}`);
        }
        return resp.json();
    }).then(vals=>{
        unique_id = vals.value;
        document.querySelector('#u_id').value = unique_id;
        console.log(unique_id);
    });
    
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
    const formData = new FormData();
    formData.append("image", inFile.files[0]);
    formData.append("operation", result);
    formData.append("u_id", unique_id);
    fetch("http://localhost:8080/send", {
        method: "POST",
        body: formData,
    }).then((resp)=>{
        console.log("made it here1");
        
        if(!resp.ok){
            throw new Error(`HTTP error! Status: ${ response.status }`);
        }
        
        //console.log(resp.blob());
        return resp.blob();
    }).then(resp =>{
        console.log("made it here2");
        console.log(resp);
        const imgUrl =  URL.createObjectURL(resp);
        document.querySelector('main').style.visibility = "visible";
        document.querySelector("#waiting").style.visibility = "hidden";
        document.querySelector("#after").src = imgUrl;
    });
    //console.log(JSON.stringify({u_id: unique_id}));
    /*
    fetch('http://localhost:8080/retrieve', {
        method: 'POST',
        body: JSON.stringify({u_id: unique_id}),
    }).then(resp =>{
        console.log("resp?");
        if(!resp.ok){
            document.querySelector("#waiting").style.visibility = "hidden";
            document.querySelector("#error").style.visibility = "visible";
            throw new Error(`Http error! Status: ${resp.status}. Please make sure you submit a valid image file with proper dimensions`);
        }
        return resp.blob();
    }).then(blob => {
        const objectURL = URL.createObjectURL(blob);
        document.querySelector('#after').src = objectURL;
    });
    */
});

