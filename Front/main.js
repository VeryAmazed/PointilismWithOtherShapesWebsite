const form = document.querySelector('form');
const button = document.querySelector('button');
// form submits and then we hide main and make a fetch request

form.addEventListener('submit', (e)=>{
    document.querySelector('main').style.visibility = "hidden";
    document.querySelector("#loading").style.visibility = "visible";
    
    /*
    fetch(e.target.action, {
       
    }).then(resp => {
        if(!resp.ok){
            document.querySelector("#loading").style.visibility = "hidden";
            document.querySelector("#error").style.visibility = "visible";
            
            throw new Error(`HTTP error: ${response.status}`);
        }
        return resp.blob();
    }).then((blob) =>{
        document.querySelector("#loading").style.visibility = "hidden";
        document.querySelector('main').style.visibility = "visible";
        const objectUrl = URL.createObjectURL(blob);
        document.querySelector('#after').src = objectURL;
        
    })
    */
})

