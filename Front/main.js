
const form = document.querySelector('form');
const button = document.querySelector('button');
// form submits and then we hide main and make a fetch request
let unique_id;

window.addEventListener('load', (e)=>{
    
    fetch('http://localhost:8080/id').then((resp) =>{
        console.log("resp?");
        if(!resp.ok){
            
            throw new Error('Http error! Status: ${resp.status}');
        }
        return resp.json();
    }).then(vals=>{
        unique_id = vals.value;
        document.querySelector('#u_id').value = unique_id;
    });
});

form.addEventListener('submit', (e)=>{
    document.querySelector('main').style.visibility = "hidden";
    document.querySelector("#waiting").style.visibility = "visible";
    
})

