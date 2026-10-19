const TOKEN =
localStorage.getItem("token");

const userDetails =
JSON.parse(localStorage.getItem("user"));

console.log("RECEIVED TOKEN:", TOKEN);
console.log("USER DETAILS:", userDetails);


document.getElementById("userId").value =
userDetails.userid;

document.getElementById("email").value =
userDetails.email;

document.getElementById("welcomeUsername").textContent =
userDetails.username;

document.getElementById("username").textContent =
userDetails.username;



const maincontent =
document.getElementById("mainContent");

const createticket =
document.getElementById("createTicket");


createticket.addEventListener("click", function(event) {

    event.preventDefault();

    maincontent.innerHTML = "";


    const goback =
    document.createElement("p");

    goback.classList.add("goback");

    goback.textContent =
    "← Back to Overview";


    goback.addEventListener("click", function() {

        location.reload();

    });


    const supportheading =
    document.createElement("h1");

    supportheading.classList.add("support-heading");

    supportheading.textContent =
    "Create a Support Ticket";


    const supportpara =
    document.createElement("p");

    supportpara.classList.add("support-para");

    supportpara.textContent =
    "Describe your issue in detail and our team will get back to you as soon as possible.";


    const card =
    document.createElement("div");

    card.classList.add("support-card");


    const label =
    document.createElement("label");

    label.textContent =
    "Subject *";


    const input =
    document.createElement("input");

    input.type =
    "text";

    input.id =
    "subjectvalue";

    input.placeholder =
    "e.g. Payment failed, Login issue, Feature request...";


    const categoryLabel =
    document.createElement("label");

    categoryLabel.textContent =
    "Category *";


    const category =
    document.createElement("select");

    category.id =
    "category";


    const categoryDefault =
    document.createElement("option");

    categoryDefault.textContent =
    "Select a category";

    categoryDefault.value =
    "";

    categoryDefault.disabled =
    true;

    categoryDefault.selected =
    true;


    category.appendChild(
        categoryDefault
    );


    const categoryOptions = [
        "Account",
        "Login & Authentication",
        "Payment",
        "Technical Issue",
        "Bug",
        "Feature Request",
        "Other"
    ];


    categoryOptions.forEach(function(optionText) {

        const option =
        document.createElement("option");

        option.textContent =
        optionText;

        option.value =
        optionText;

        category.appendChild(
            option
        );

    });


    const priorityLabel =
    document.createElement("label");

    priorityLabel.textContent =
    "Priority *";


    const priority =
    document.createElement("select");

    priority.id =
    "priority";


    const priorityOptions = [
        "Low",
        "Medium",
        "High",
        "Urgent"
    ];


    priorityOptions.forEach(function(optionText) {

        const option =
        document.createElement("option");

        option.textContent =
        optionText;

        option.value =
        optionText;

        priority.appendChild(
            option
        );

    });


    priority.value =
    "Medium";


    const ticketRow =
    document.createElement("div");

    ticketRow.classList.add("ticket-row");


    const categoryField =
    document.createElement("div");

    categoryField.classList.add("ticket-field");


    categoryField.appendChild(
        categoryLabel
    );

    categoryField.appendChild(
        category
    );


    const priorityField =
    document.createElement("div");

    priorityField.classList.add("ticket-field");


    priorityField.appendChild(
        priorityLabel
    );

    priorityField.appendChild(
        priority
    );


    ticketRow.appendChild(
        categoryField
    );

    ticketRow.appendChild(
        priorityField
    );


    const descriptionField =
    document.createElement("div");

    descriptionField.classList.add(
        "description-field"
    );


    const descriptionLabel =
    document.createElement("label");

    descriptionLabel.textContent =
    "Description *";


    const description =
    document.createElement("textarea");

    description.id =
    "description";

    description.placeholder =
    "Please provide detailed information about your issue...";


    descriptionField.appendChild(
        descriptionLabel
    );

    descriptionField.appendChild(
        description
    );


    const actions =
    document.createElement("div");

    actions.classList.add(
        "ticket-actions"
    );


    const cancelButton =
    document.createElement("button");

    cancelButton.classList.add(
        "cancel-ticket"
    );

    cancelButton.textContent =
    "Cancel";


    cancelButton.addEventListener(
        "click",
        function() {

            location.reload();

        }
    );


    const createButton =
    document.createElement("button");

    createButton.classList.add(
        "create-ticket-submit"
    );

    createButton.textContent =
    "Create Ticket";


    createButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            const subjectValue =
            input.value;

            const categoryValue =
            category.value;

            const priorityValue =
            priority.value;

            const descriptionValue =
            description.value;


            const ticketInfo = {

                subjectValue,
                categoryValue,
                priorityValue,
                descriptionValue

            };


            console.log(
                "TICKET DETAILS:",
                ticketInfo
            );


            const userid =
            userDetails.userid;


            console.log(
                "CUSTOMER USER ID:",
                userid
            );


            const TOKEN =
            localStorage.getItem("token");


            console.log(
                "RECEIVED TOKEN:",
                TOKEN
            );


            fetch(
                `http://localhost:3000/tickets/${userid}`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                        "application/json",

                        "Authorization":
                        `Bearer ${TOKEN}`

                    },

                    body: JSON.stringify({

                        subjectvalue:
                        subjectValue,

                        categoryvalue:
                        categoryValue,

                        priorityvalue:
                        priorityValue,

                        descriptionvalue:
                        descriptionValue

                    })

                }
            )

            .then(res =>
                res.json()
            )

            .then(data => {

                console.log(
                    "CREATE TICKET RESPONSE:",
                    data
                );

                alert(
                    data.message
                );

            })

            .catch(error => {

                console.log(
                    "CREATE TICKET ERROR:",
                    error
                );

            });

        }
    );


    actions.appendChild(
        cancelButton
    );

    actions.appendChild(
        createButton
    );


    maincontent.appendChild(
        goback
    );

    maincontent.appendChild(
        supportheading
    );

    maincontent.appendChild(
        supportpara
    );

    maincontent.appendChild(
        card
    );


    card.appendChild(
        label
    );

    card.appendChild(
        input
    );

    card.appendChild(
        ticketRow
    );

    card.appendChild(
        descriptionField
    );

    card.appendChild(
        actions
    );

});



fetch(
    "http://localhost:3000/customerdata",
    {

        method: "GET",

        headers: {

            "Authorization":
            `Bearer ${TOKEN}`

        }

    }
)

.then(res =>
    res.json()
)

.then(data => {

    console.log(
        "CUSTOMER DATA:",
        data
    );

})

.catch(error => {

    console.log(
        "CUSTOMER DATA ERROR:",
        error
    );

});



fetch(
    "http://localhost:3000/customertickets",
    {

        method: "GET",

        headers: {

            "Authorization":
            `Bearer ${TOKEN}`

        }

    }
)

.then(res =>
    res.json()
)

.then(data => {

    console.log(
        "MY TICKETS:",
        data
    );


    const ticketContent =
    document.getElementById("ticketscontent");


    data.tickets.forEach(ticket => {


        const ticketRow =
        document.createElement("div");

        ticketRow.classList.add(
            "customer-ticket-row"
        );


        const ticketDetails =
        document.createElement("div");

        ticketDetails.classList.add(
            "ticket-details-content"
        );


        const subjectheading =
        document.createElement("p");

        subjectheading.textContent =
        ticket.subject;


        const ticketid =
        document.createElement("p");

        ticketid.textContent =
        ticket.ticketid;


        const description =
        document.createElement("p");

        description.textContent =
        ticket.description;


        ticketDetails.appendChild(
            subjectheading
        );

        ticketDetails.appendChild(
            ticketid
        );

        ticketDetails.appendChild(
            description
        );


        const tickethandledby =
        document.createElement("p");

        tickethandledby.dataset.tickethandledbyticketid =
        ticket.ticketid;

        tickethandledby.textContent =
        "Not assigned";


        const statusbutton =
        document.createElement("button");

        statusbutton.classList.add(
            "status-button"
        );

        statusbutton.dataset.ticketid =
        ticket.ticketid;

        statusbutton.textContent =
        ticket.status;


        ticketRow.appendChild(
            ticketDetails
        );

        ticketRow.appendChild(
            tickethandledby
        );

        ticketRow.appendChild(
            statusbutton
        );


        ticketContent.appendChild(
            ticketRow
        );

    });


   fetch(
    "http://localhost:3000/updatedtickets",
    {

        method: "GET",

        headers: {

            "Authorization":
            `Bearer ${TOKEN}`

        }

    }
)

.then(res =>
    res.json()
)

.then(data => {

    console.log(
        "CLAIMED TICKETS RECEIVED:",
        data
    );


    if (!data.tickets) {

        return;

    }


    data.tickets.forEach(claimedTicket => {

        console.log(
            "CLAIMED TICKET:",
            claimedTicket
        );


        console.log(
            "TICKET ID:",
            claimedTicket.ticketid
        );


        console.log(
            "EMPLOYEE NAME:",
            claimedTicket.employee_username
        );


        console.log(
            "STATUS:",
            claimedTicket.status
        );


        const statusbutton =
        document.querySelector(
            `[data-ticketid="${claimedTicket.ticketid}"]`
        );


        console.log(
            "STATUS BUTTON FOUND:",
            statusbutton
        );


        if (statusbutton) {

            statusbutton.textContent =
            claimedTicket.status;

        }


        const tickethandledby =
        document.querySelector(
            `[data-tickethandledbyticketid="${claimedTicket.ticketid}"]`
        );


        console.log(
            "TICKET HANDLED BY FOUND:",
            tickethandledby
        );


        if (tickethandledby) {

            tickethandledby.textContent =
            claimedTicket.employee_username;

        }

    });

});
})

.catch(error => {

    console.log(
        "UPDATED TICKET ERROR:",
        error
    );

})

.catch(error => {

    console.log(
        "MY TICKETS ERROR:",
        error
    );

});

const sidebarLinks = document.querySelectorAll(".nav-link");

sidebarLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        sidebarLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});

document.getElementById("overviewLink").classList.add("active");

const overview =
document.getElementById("overviewLink");

overview.addEventListener("click" , function(event) {
    event.preventDefault();
    location.reload();
});


const mytickets =
document.getElementById("ticketsLink");

mytickets.addEventListener("click", function() {

    maincontent.innerHTML = "";

    const TOKEN = localStorage.getItem("token");

    console.log("MY TICKETS TOKEN:", TOKEN);

    fetch("http://localhost:3000/mytickets", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${TOKEN}`
        }
    })
    .then(res => res.json())
    .then(data => {

        console.log("MY TICKETS DATA:", data);

        const heading =
        document.createElement("h1");

        heading.textContent =
        "My Tickets";

        const description =
        document.createElement("p");

        description.textContent =
        "Track and manage your support requests";


        const layout =
        document.createElement("div");

        layout.classList.add(
            "my-tickets-layout"
        );


        const ticketsSection =
        document.createElement("div");

        ticketsSection.classList.add(
            "my-tickets-section"
        );


        const ticketsContainer =
        document.createElement("div");

        ticketsContainer.classList.add(
            "my-tickets-container"
        );


        const detailsSection =
        document.createElement("div");

        detailsSection.classList.add(
            "my-ticket-details"
        );

        detailsSection.innerHTML = `
            <h2>Ticket Details</h2>
            <p class="details-placeholder">
                Select a ticket to view its details.
            </p>
        `;


        ticketsSection.appendChild(
            heading
        );

        ticketsSection.appendChild(
            description
        );

        ticketsSection.appendChild(
            ticketsContainer
        );


        layout.appendChild(
            ticketsSection
        );

        layout.appendChild(
            detailsSection
        );


        maincontent.appendChild(
            layout
        );


        data.forEach(ticket => {

            const card =
            document.createElement("div");

            card.classList.add(
                "my-ticket-card"
            );


            card.innerHTML = `
                <div class="my-ticket-info">

                    <p class="ticket-id">
                        ${ticket.ticketid}
                    </p>

                    <h3>
                        ${ticket.subject}
                    </h3>

                    <div class="ticket-meta">
                        <span>
                            ${ticket.category}
                        </span>

                        <span>
                            ${ticket.priority}
                        </span>
                    </div>

                </div>

                <button class="status-button">
                    ${ticket.status}
                </button>
            `;


            const statusButton =
            card.querySelector(
                ".status-button"
            );


          statusButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        const TOKEN = localStorage.getItem("token");

        fetch("http://localhost:3000/myticketsclaimed", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`
            }
        })
        .then(res => res.json())
        .then(data => {

            console.log("MY TICKETS CLAIMED INFO:", data);

            const claimedTicket =
                data.find(item => item.ticketid === ticket.ticketid);

            if (!claimedTicket) {
               detailsSection.innerHTML = "Ticket have not claimed by any employee";
            }

            detailsSection.innerHTML = `

                <h2>Ticket Details</h2>

                <div class="detail-ticket-id">
                    ${claimedTicket.ticketid}
                </div>

                <h3>
                    ${claimedTicket.category}
                </h3>

                <div class="detail-item">
                    <span>Ticket ID</span>
                    <strong>
                        ${claimedTicket.ticketid}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Status</span>
                    <strong>
                        ${claimedTicket.status}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Category</span>
                    <strong>
                        ${claimedTicket.category}
                    </strong>
                </div>

                <div class="detail-description">

                    <span>Ticket Handled By</span>

                    <p>
                        ${claimedTicket.employee_username || "No employee have appointed."}
                    </p>

                </div>

                <button class="chat-developer-button" id="chatwithdeveloper">
                    Chat with Developer
                </button>
            `;

            const chatButton =
                detailsSection.querySelector(
                    ".chat-developer-button"
                );
const messages = document.getElementById("messagesLink");
            chatButton.addEventListener(
                "click",
                function() {

                    console.log(
                        "OPEN CHAT FOR TICKET:",
                        claimedTicket.ticketid
                    );
                
                 maincontent.innerHTML = `

    <div class="messages-page">

        <div class="chat-header">

            <div>
                <h2>Messages</h2>
                <p>Conversation for ticket ${claimedTicket.ticketid}</p>
            </div>

            <span class="chat-status">
                ${claimedTicket.employee_username}
            </span>

        </div>


        <div class="chat-body" id="chatBody">

            <div class="message received">
                <div class="message-label">
                    ${claimedTicket.employee_username}
                </div>

                <p>
                    Hello, how can I help you with your ticket?
                </p>

                <span class="message-time">
                    Now
                </span>
            </div>

        </div>


        <div class="chat-input-area">

            <input
                type="text"
                id="message"
                placeholder="Type your message..."
                autocomplete="off"
            >

            <button id="sendMessage">
                <i data-lucide="send"></i>
                Send
            </button>
              
            



        </div>

    </div>
    

`;


lucide.createIcons();
 const TOKEN = localStorage.getItem("token");
 console.log("SOCKET tOKEN RECEIVED:" , TOKEN);
const socket = io("http://localhost:3000"  , {
    auth: {
        token: TOKEN
    }
});
 const chatbody =
 document.getElementById("chatBody");

socket.on("received_message" , function(data) {
    console.log("RECEIVED MESSAGE:" , data.message);

    const chatbody =
    document.getElementById("chatBody");

    const messageDiv =
    document.createElement("div");

    messageDiv.classList.add("message" , "sent");

    messageDiv.innerHTML = `
    <p>${data.message}</P>
    <span class="message-time">Now</span>
    `;

   
    chatbody.appendChild(messageDiv);
});
const Token = localStorage.getItem("token");
 const ticketid = claimedTicket.ticketid;
  console.log("FETCHING THE MESSAGES TOKEN:" , ticketid)
 fetch(`http://localhost:3000/messages/${ticketid}` , {
    method : "GET" , 
    headers : {
        "Authorization" : `Bearer ${Token}`
    }
        
    })
    .then(res => res.json())
    .then(data => {
        console.log("MESSAGES DATA:" , data);
        console.log("DATAINFO:" , data.message);
        console.log("LOGGEDINUSER:" , data.loggedinuser);
        
        
        

        
            data.message.forEach(messages => {
                const loggedinuser = data.loggedinuser;
                console.log("LOGGEDINUSER:" , loggedinuser);
                 const senderId = messages.senderid;
         console.log("SENDERID:" , senderId);
              const receiverId = messages.receiverid;
            console.log("RECEIVERID:" ,receiverId);
            const messageDiv =
            document.createElement("div");

            if(senderId === loggedinuser){
                 messageDiv.classList.add("message" , "sent");
            }else if(receiverId === loggedinuser){
                messageDiv.classList.add("message" , "received");
            }
            
         
             messageDiv.innerHTML = `
            <p>${messages.message}</P>
            `;
           
           

            chatbody.appendChild(messageDiv);
        })
       
    })

const messageInput =
document.getElementById("message");
const sendMessage=
            document.getElementById("sendMessage");

            sendMessage.addEventListener("click" , function(event) {
            event.preventDefault();
              const Message =
              messageInput.value.trim();

           

            if(Message === ""){
                return;
            }

            console.log("TICKET ID:" , claimedTicket.ticketid);
             console.log("MESSAGE SENT:" , Message);

             socket.emit("send_message" , {
                ticketid : claimedTicket.ticketid,
                message : Message
             });
             messageInput.value = "";
            

           

            
            }) ;

                 
                
                }
            );

        });
    }
);
                        
                   

            ticketsContainer.appendChild(
                card
            );

        });

    });

});
const notification = document.getElementById("notificationsLink");

notification.addEventListener("click", function (event) {
    event.preventDefault();

    maincontent.innerHTML = "";
   const TOKEN = localStorage.getItem("token");
     console.log("TOKEN FOR THE NOTIFICATION:" , TOKEN);
     
    fetch("http://localhost:3000/notification" , {
        method : "POST",
        headers : {
            "Authorization" : `Bearer ${TOKEN}`
        }
    })
    .then(res => res.json())
    .then(data => {

        console.log("NOTIFICATION DATA RECEIVED:" , data);
        console.log("TICKETID:" , data.ticketid);
        
       
             const notificationsView = document.createElement("div");
    notificationsView.className = "notifications-view";

    const heading = document.createElement("h2");
    heading.textContent = "Notifications";
    const para = document.createElement("p");
    para.textContent = "Here are your latest Notifications";
     

    const notificationsContainer = document.createElement("div");
    notificationsContainer.className = "notifications-container";
    data.forEach(ticket => {

    const notificationcard =
    document.createElement("card");

    notificationcard.className = "notification-card";
    notificationcard.textContent = `${ticket.ticketid} have claimed`;




    notificationsView.appendChild(heading);
    notificationsView.appendChild(para);
    notificationsView.appendChild(notificationsContainer);
    notificationsContainer.appendChild(notificationcard);

    maincontent.appendChild(notificationsView);

        })
     
    })

   
});