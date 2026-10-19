console.log("JS IS LOADED");

const Changepassword =
document.getElementById("changepassword");

Changepassword.addEventListener("click" , function(event) {
    event.preventDefault();

    const email = 
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;
    const Confirmpassword =
    document.getElementById("confirmpassword").value;
    
    const userdetails = {
        email,
        password
    }
    
    console.log("USERDETAILS:" , userdetails);

    const Passworderror =
    document.getElementById("passwordError");

    if(password != Confirmpassword) {
        Passworderror.textContent = "Passwords donot Match";
    }

    fetch("http://localhost:3000/forgotpassword" , {
        method : "POST" , 
        headers : {
            "Content-Type" : "application/json"
           
        },
        body : JSON.stringify({
            email : email,
            password : password
        })
        
        
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    })
})