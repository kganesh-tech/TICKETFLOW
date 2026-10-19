const loginButton =
    document.getElementById("login");

const loginModal =
    document.getElementById("login-modal");

const mainContent =
    document.getElementById("main-content");
const signupButton =
  document.getElementById("signup");


loginButton.addEventListener("click", function(event) {

    event.preventDefault();

    console.log("button clicked");

    mainContent.innerHTML = "";

    const loginCard =
        document.createElement("div");

    loginCard.classList.add("login-card");


    const loginHeading =
        document.createElement("h1");

    loginHeading.textContent =
        "LOGIN INTO COMPANY";

    loginHeading.classList.add("login-heading");


    const emailGroup =
        document.createElement("div");

    emailGroup.classList.add("input-group");


    const emailLabel =
        document.createElement("label");

    emailLabel.textContent = "Email";

    emailLabel.setAttribute("for", "email");


    const email =
        document.createElement("input");

    email.type = "email";
    email.id = "email";
    email.placeholder = "Enter your email";


    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(email);


    const passwordGroup =
        document.createElement("div");

    passwordGroup.classList.add("input-group");


    const passwordLabel =
        document.createElement("label");

    passwordLabel.textContent = "Password";

    passwordLabel.setAttribute("for", "password");


    const password =
        document.createElement("input");

    password.type = "password";
    password.id = "password";
    password.placeholder = "Enter your password";


    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(password);


    const forgotPassword =
        document.createElement("a");

    forgotPassword.textContent =
        "Forgot Password?";

    forgotPassword.href = "#";

    forgotPassword.classList.add("forgot-password");

    forgotPassword.addEventListener("click" , function(event) {
        event.preventDefault();

        window.location.href="forgotpassword.html";
    });


    const submitButton =
        document.createElement("button");

    submitButton.textContent = "LOGIN";

    submitButton.classList.add("login-submit");

    submitButton.addEventListener("click" , function(event) {
        event.preventDefault();

        const email =
        document.getElementById("email").value;
        const password =
        document.getElementById("password").value;

        const logininfo = {
            email,
            password
        };
        console.log("LOGINDETAILS:" , logininfo);

       fetch("http://localhost:3000/login/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email,
        password
    })
})
.then(res => res.json())
.then(data => {

    alert(data.message);

    console.log("LOGIN RESPONSE:", data);

    if (data.user.role === "DEVELOPER") {
        localStorage.setItem("token" , data.token);
        localStorage.setItem("user" , JSON.stringify(data.user));
        window.location.href = "developer.html";
    } else if(data.user.role === "customer") {
        localStorage.setItem("token" , data.token);
        localStorage.setItem("user" , JSON.stringify(data.user));
        window.location.href = "customer.html";
    } else {
       localStorage.setItem("token" , data.token);
       localStorage.setItem("user" , JSON.stringify(data.user));
       window.location.href="manager.html";
    }

})
.catch(error => {
    console.error("LOGIN ERROR:", error);
    alert("Something went wrong while logging in");
});
    });






    loginCard.appendChild(loginHeading);
    loginCard.appendChild(emailGroup);
    loginCard.appendChild(passwordGroup);
    loginCard.appendChild(forgotPassword);
    loginCard.appendChild(submitButton);

    mainContent.appendChild(loginCard);
  

});
signupButton.addEventListener("click", function(event) {

    event.preventDefault();

    mainContent.innerHTML = "";

    const signupCard =
        document.createElement("div");

    signupCard.classList.add("signup-card");


    const signupHeading =
        document.createElement("h1");

    signupHeading.textContent =
        "create your account";

    signupHeading.classList.add("signup-heading");


    const nameGroup =
        document.createElement("div");

    nameGroup.classList.add("input-group");


    const nameLabel =
        document.createElement("label");

    nameLabel.textContent =
        "Name";

    nameLabel.setAttribute("for", "signupName");


    const name =
        document.createElement("input");

    name.type = "text";
    name.id = "signupName";
    name.placeholder = "Enter your name";
    name.required = true;


    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(name);


    const emailGroup =
        document.createElement("div");

    emailGroup.classList.add("input-group");


    const emailLabel =
        document.createElement("label");

    emailLabel.textContent =
        "Email";

    emailLabel.setAttribute("for", "signupEmail");


    const email =
        document.createElement("input");

    email.type = "email";
    email.id = "signupEmail";
    email.placeholder = "Enter your email";
    email.required = true;


    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(email);


    const passwordGroup =
        document.createElement("div");

    passwordGroup.classList.add("input-group");


    const passwordLabel =
        document.createElement("label");

    passwordLabel.textContent =
        "Password";

    passwordLabel.setAttribute("for", "signupPassword");


    const password =
        document.createElement("input");

    password.type = "password";
    password.id = "signupPassword";
    password.placeholder = "Create a password";
    password.required = true;


    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(password);


    const confirmGroup =
        document.createElement("div");

    confirmGroup.classList.add("input-group");


    const confirmLabel =
        document.createElement("label");

    confirmLabel.textContent =
        "Confirm Password";

    confirmLabel.setAttribute("for", "confirmPassword");


    const confirmPassword =
        document.createElement("input");

    confirmPassword.type = "password";
    confirmPassword.id = "confirmPassword";
    confirmPassword.placeholder = "Confirm your password";
    confirmPassword.required = true;


    confirmGroup.appendChild(confirmLabel);
    confirmGroup.appendChild(confirmPassword);


    


    const submitButton =
        document.createElement("button");

    submitButton.textContent =
        "CREATE ACCOUNT";

    submitButton.classList.add("signup-submit");

    


    submitButton.addEventListener("click", async function(event) {

        event.preventDefault();

        const userName =
            document.getElementById("signupName").value.trim();

        const userEmail =
            document.getElementById("signupEmail").value.trim();

        const userPassword =
            document.getElementById("signupPassword").value;

        const confirm =
            document.getElementById("confirmPassword").value;

       


        if (
            !userName ||
            !userEmail ||
            !userPassword ||
            !confirm
        ) {
            alert("Please fill all the fields");
            return;
        }


        if (userPassword !== confirm) {
            alert("Passwords do not match");
            return;
        }


        const signupInfo = {
            name: userName,
            email: userEmail,
            password: userPassword,
            
        };


        console.log("SIGNUP DETAILS:", signupInfo);


        try {

            const response =
                await fetch("http://localhost:3000/signup/users", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: userName,
                        email: userEmail,
                        password: userPassword,
                        role : "customer"
                    })
                });


            const data =
                await response.json();


            console.log("SIGNUP RESPONSE:", data);


            if (response.ok) {
                window.location.href="customer.html";
            }


            alert(data.message || "Account created successfully");


            mainContent.innerHTML = "";


        } catch (error) {

            console.error("SIGNUP ERROR:", error);

            alert("Something went wrong while signing up");

        }

    });
    const loginText =
        document.createElement("p");

    loginText.classList.add("signup-login-text");

    loginText.textContent =
        "Already have an account? ";


    const loginLink =
        document.createElement("span");

    loginLink.textContent =
        "LOGIN";

    loginLink.classList.add("signup-login-link");


    loginLink.addEventListener("click", function(event) {

        event.preventDefault();

        loginButton.click();

    });


    loginText.appendChild(loginLink);


    signupCard.appendChild(signupHeading);
    signupCard.appendChild(nameGroup);
    signupCard.appendChild(emailGroup);
    signupCard.appendChild(passwordGroup);
    signupCard.appendChild(confirmGroup);
    
    signupCard.appendChild(submitButton);
    signupCard.appendChild(loginText)

    mainContent.appendChild(signupCard);

});