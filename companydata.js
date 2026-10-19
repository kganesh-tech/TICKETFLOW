const form = 
document.getElementById("singupform");

form.addEventListener("submit" , function(event) {
    event.preventDefault();

    const username =
    document.getElementById("username").value;
    const email =
    document.getElementById("email").value;
    const password =
    document.getElementById("password").value;
    const roles =
    document.getElementById("roles").value;

    const employeeData = {
        username,
        email,
        password,
        roles
    };

    console.log("EMPLOYEEDETAILS:" , employeeData);

    fetch("http://localhost:3000/users" , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({employeeData})
    })

    .then(res => {
         if(res.ok) {
           document.getElementById("createaccount").textContent = "Account Created";
           document.getElementById("createaccount").disabled = true;
        }
        return res.json();
    })
    .then(data => {
        console.log("data" , data);
  
       
    })
    .catch(error => {
        console.log("ERROR:" , error);
    });
});