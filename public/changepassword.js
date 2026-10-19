const params =
new URLSearchParams(window.location.search);
const username =
params.get("username");

console.log(username);
const form = 
document.getElementById("passwordForm");

form.addEventListener("submit" , function(event) {
    event.preventDefault();

    const newpassword =
    document.getElementById("password").value;

    const confirmpassword =
    document.getElementById("confirmPassword").value;

    const  passworderror =
    document.getElementById("passwordError");

    if(newpassword != confirmpassword) {
        passworderror.textContent = "passwords donot match";
        return;
    };

    fetch(`http://localhost:3000/changepassword/${username}` , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            newpassword
        })
})

        .then(res => res.json())
        .then(data => {
            alert(data.message)
        });
    });
