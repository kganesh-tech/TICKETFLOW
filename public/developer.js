const token = localStorage.getItem("token");

const developer = JSON.parse(localStorage.getItem("user"));

console.log(token);
console.log(developer);

document.getElementById("userId").value = developer.id;
document.getElementById("email").value = developer.email;

const maincontent = document.getElementById("mainContent");

maincontent.innerHTML = "";

const heading = document.createElement("h1");

heading.classList.add("page-title");

heading.textContent = `Welcome, ${developer.username}`;

maincontent.appendChild(heading);

const cardsContainer = document.createElement("div");

cardsContainer.classList.add("cards-container");

const taskCard = document.createElement("div");

taskCard.classList.add("task-card");

const taskTitle = document.createElement("h2");

taskTitle.textContent = "Assigned Tasks";

const taskCount = document.createElement("p");

taskCount.classList.add("task-count");

taskCount.textContent = "0";

taskCard.appendChild(taskTitle);
taskCard.appendChild(taskCount);

const completedCard = document.createElement("div");

completedCard.classList.add("task-card");

const completedTitle = document.createElement("h2");

completedTitle.textContent = "Completed Tasks";

const completedCount = document.createElement("p");

completedCount.classList.add("task-count");

completedCount.textContent = "0";

completedCard.appendChild(completedTitle);
completedCard.appendChild(completedCount);

cardsContainer.appendChild(taskCard);
cardsContainer.appendChild(completedCard);

maincontent.appendChild(cardsContainer);


const Tickets = document.getElementById("tickets");

Tickets.addEventListener("click", function(event) {

    event.preventDefault();

    maincontent.innerHTML = "";

    const ticketsSection =
        document.createElement("div");

    ticketsSection.className =
        "tickets-section";

    const ticketDetails =
        document.createElement("div");

    ticketDetails.className =
        "ticket-details";

    const heading =
        document.createElement("h1");

    heading.textContent =
        "All Tickets";

    const para =
        document.createElement("p");

    para.textContent =
        "View and manage all support tickets. Claim a ticket to start working on it.";

    const headerRow =
        document.createElement("div");

    headerRow.className =
        "ticket-row ticket-header";

    const headings = [
        "ID",
        "Issue / Subject",
        "Status",
        "Category",
        "Action"
    ];

    headings.forEach((heading) => {

        const element =
            document.createElement("div");

        element.textContent =
            heading;

        headerRow.appendChild(element);

    });

    fetch("https://ticketflow-backend-846m.onrender.com/alltickets", {

        method: "GET",

        headers: {
            "Authorization":
                `Bearer ${token}`
        }

    })

    .then(res => res.json())

    .then(data => {

        console.log("TICKETSDATA:", data);

        data.forEach(ticket => {

            const ticketRow =
                document.createElement("div");

            ticketRow.className =
                "ticket-row";

            const id =
                document.createElement("div");

            id.textContent =
                ticket.ticketid;

            const subject =
                document.createElement("div");

            subject.textContent =
                ticket.subject;

            const status =
                document.createElement("div");

            status.textContent =
                ticket.status;

            const ticketcategory =
                document.createElement("div");

            ticketcategory.textContent =
                ticket.category;

            const claimticketbtn =
                document.createElement("button");

            claimticketbtn.className =
                "claimticket-btn";

            claimticketbtn.textContent =
                "Claim Ticket";

            claimticketbtn.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    console.log(
                        "SELECTED TICKET:",
                        ticket
                    );

                    fetch(
                        "https://ticketflow-backend-846m.onrender.com/claimedticket",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                ticket
                            })
                        }
                    )

                    .then(res => res.json())

                    .then(data => {

                        console.log(data);

                        const messagecard =
                        document.createElement("div");

                        messagecard.className = "message-card";

                        messagecard.textContent = `${data.message1}`;

                       
                       ticketsSection.before(messagecard);
                      setTimeout(() => {
                        messagecard.remove();} , 3000);
                      


                        claimticketbtn.textContent =
                            data.message;

                    })

                    .catch(error => {

                        console.log(
                            "ERROR:",
                            error
                        );

                    });

                }
            );

            ticketRow.appendChild(id);
            ticketRow.appendChild(subject);
            ticketRow.appendChild(status);
            ticketRow.appendChild(ticketcategory);
            ticketRow.appendChild(claimticketbtn);
            

            ticketsSection.appendChild(ticketRow);
             

        });

    });

    ticketsSection.appendChild(heading);
    ticketsSection.appendChild(para);
    ticketsSection.appendChild(headerRow);

    maincontent.appendChild(ticketsSection);
    maincontent.appendChild(ticketDetails);
   

});


const claimedtickets =
    document.getElementById("claimedtickets");

claimedtickets.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        maincontent.innerHTML = "";

        const TOKEN =
            localStorage.getItem("token");

        console.log(
            "TOKEN RECEIVED:",
            TOKEN
        );

        fetch(
            "https://ticketflow-backend-846m.onrender.com/ticketsclaimed",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${TOKEN}`
                }
            }
        )

        .then(res => res.json())

        .then(data => {

            console.log(
                "DEVELOPER TICKETS CLAIMED:",
                data
            );

            const layout =
                document.createElement("div");

            layout.className =
                "claimed-tickets-layout";

            const ticketsSection =
                document.createElement("div");

            ticketsSection.className =
                "claimed-tickets-section";

            const ticketheading =
                document.createElement("h1");

            ticketheading.textContent =
                "Claimed Tickets";

            const ticketdescription =
                document.createElement("p");

            ticketdescription.textContent =
                "A real assigned ticket for you - pick one to view its details";

            ticketsSection.appendChild(
                ticketheading
            );

            ticketsSection.appendChild(
                ticketdescription
            );

            const ticketDetails =
                document.createElement("div");

            ticketDetails.className =
                "ticket-details";

            const detailsHeading =
                document.createElement("h2");

            detailsHeading.textContent =
                "Ticket Details";

            const detailsText =
                document.createElement("p");

            detailsText.textContent =
                "Select a ticket to view its details.";

            ticketDetails.appendChild(
                detailsHeading
            );

            ticketDetails.appendChild(
                detailsText
            );


            data.forEach(ticket => {

                const card =
                    document.createElement("div");

                card.className =
                    "card-ticket";

                const ticketId =
                    document.createElement("p");

                ticketId.textContent =
                    "Ticket ID: " +
                    ticket.ticketid;

                const ticketcategory =
                    document.createElement("p");

                ticketcategory.textContent =
                    "Category: " +
                    ticket.category;

                const ticketstatus =
                    document.createElement("p");

                ticketstatus.textContent =
                    "Status: " +
                    ticket.status;

                const viewbutton =
                    document.createElement("button");

                viewbutton.className =
                    "view-button";

                viewbutton.textContent =
                    "View";

                const solvedbutton =
                    document.createElement("button");

                solvedbutton.className =
                    "solved-button";

                solvedbutton.textContent =
                    "Solved";

                solvedbutton.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        console.log(
                            "solved button clicked"
                        );

                        const ticketId =
                            ticket.ticketid;

                        const TOKEN =
                            localStorage.getItem("token");

                        fetch(
                            `https://ticketflow-backend-846m.onrender.com/solved/${ticketId}`,
                            {
                                method: "POST",

                                headers: {
                                    "Authorization":
                                        `Bearer ${TOKEN}`
                                }
                            }
                        )

                        .then(res => res.json())

                        .then(data => {

                            console.log(
                                "SOLVED RESPONSE:",
                                data
                            );

                        })

                        .catch(error => {

                            console.log(
                                "SOLVED ERROR:",
                                error
                            );

                        });

                    }
                );


                const buttonContainer =
                    document.createElement("div");

                buttonContainer.className =
                    "ticket-buttons";

                buttonContainer.appendChild(
                    viewbutton
                );

                buttonContainer.appendChild(
                    solvedbutton
                );

                card.appendChild(
                    ticketId
                );

                card.appendChild(
                    ticketcategory
                );

                card.appendChild(
                    ticketstatus
                );

                card.appendChild(
                    buttonContainer
                );

                ticketsSection.appendChild(
                    card
                );


                viewbutton.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        ticketDetails.innerHTML = "";

                        fetch(
                            "https://ticketflow-backend-846m.onrender.com/tickets",
                            {
                                method: "GET",

                                headers: {
                                    "Authorization":
                                        `Bearer ${TOKEN}`
                                }
                            }
                        )

                        .then(res => res.json())

                        .then(data => {

                            const detailsHeading =
                                document.createElement("h2");

                            detailsHeading.textContent =
                                "Ticket Details";

                            const ticketIdElement =
                                document.createElement("p");

                            ticketIdElement.textContent =
                                "Ticket ID: " +
                                ticket.ticketid;

                            const customerId =
                                document.createElement("p");

                            customerId.textContent =
                                "Customer ID: " +
                                ticket.userId;

                            const ticketSubject =
                                document.createElement("p");

                            ticketSubject.textContent =
                                "Subject: " +
                                data.subject;

                            const ticketCategory =
                                document.createElement("p");

                            ticketCategory.textContent =
                                "Category: " +
                                data.category;

                            const ticketPriority =
                                document.createElement("p");

                            ticketPriority.textContent =
                                "Priority: " +
                                data.priority;

                            const ticketDescription =
                                document.createElement("p");

                            ticketDescription.textContent =
                                "Description: " +
                                data.description;

                            const ticketStatus =
                                document.createElement("p");

                            ticketStatus.textContent =
                                "Status: " +
                                data.status;


                            const cancelbutton =
                                document.createElement("button");

                            cancelbutton.className =
                                "cancel-button";

                            cancelbutton.textContent =
                                "Cancel";


                            const workingbutton =
                                document.createElement("button");

                            workingbutton.className =
                                "working-button";

                            workingbutton.textContent =
                                "Working on your Ticket";

                            workingbutton.addEventListener(
                                "click",
                                function(event) {

                                    event.preventDefault();

                                    const TOKEN =
                                        localStorage.getItem("token");

                                    const ticketId =
                                        ticket.ticketid;

                                    console.log(
                                        "TICKETID SENT:",
                                        ticketId
                                    );

                                    fetch(
                                        `https://ticketflow-backend-846m.onrender.com/working/${ticketId}`,
                                        {
                                            method: "POST",

                                            headers: {
                                                "Authorization":
                                                    `Bearer ${TOKEN}`
                                            }
                                        }
                                    )

                                    .then(res => res.json())

                                    .then(data => {

                                        console.log(data);

                                        workingbutton.textContent =
                                            "Working on Ticket";

                                    })

                                    .catch(error => {

                                        console.log(
                                            "WORKING ERROR:",
                                            error
                                        );

                                    });

                                }
                            );


                            const message =
                                document.createElement("button");

                            message.className =
                                "message-customer-btn";

                            message.textContent =
                                "Message Customer";


                            message.addEventListener(
                                "click",
                                function(event) {

                                    event.preventDefault();

                                    maincontent.innerHTML = "";

                                    const messagecontainer =
                                        document.createElement("div");

                                    messagecontainer.className =
                                        "message-container";


                                    const messageHeader =
                                        document.createElement("div");

                                    messageHeader.className =
                                        "message-header";


                                    const messageTitle =
                                        document.createElement("div");

                                    messageTitle.className =
                                        "message-title";

                                    const messageHeading =
                                        document.createElement("h1");

                                    messageHeading.textContent =
                                        "Messages";

                                    const messageSubtitle =
                                        document.createElement("p");

                                    messageSubtitle.textContent =
                                        "Continue the conversation with the customer";

                                    messageTitle.appendChild(
                                        messageHeading
                                    );

                                    messageTitle.appendChild(
                                        messageSubtitle
                                    );


                                    const ticketMeta =
                                        document.createElement("div");

                                    ticketMeta.className =
                                        "message-ticket-meta";

                                    const ticketLabel =
                                        document.createElement("span");

                                    ticketLabel.textContent =
                                        "Ticket";

                                    const ticketValue =
                                        document.createElement("strong");

                                    ticketValue.textContent =
                                        ticket.ticketid;

                                    ticketMeta.appendChild(
                                        ticketLabel
                                    );

                                    ticketMeta.appendChild(
                                        ticketValue
                                    );


                                    messageHeader.appendChild(
                                        messageTitle
                                    );

                                    messageHeader.appendChild(
                                        ticketMeta
                                    );


                                    const customerInfo =
                                        document.createElement("div");

                                    customerInfo.className =
                                        "customer-info";

                                    const customerLabel =
                                        document.createElement("span");

                                    customerLabel.textContent =
                                        "Customer";

                                    const customerValue =
                                        document.createElement("strong");

                                    customerValue.textContent =
                                        ticket.userId;

                                    customerInfo.appendChild(
                                        customerLabel
                                    );

                                    customerInfo.appendChild(
                                        customerValue
                                    );


                                    const chatArea =
                                        document.createElement("div");

                                    chatArea.className =
                                        "chat-area";


                                    const chatHeader =
                                        document.createElement("div");

                                    chatHeader.className =
                                        "chat-header";

                                    const chatHeaderTitle =
                                        document.createElement("div");

                                    chatHeaderTitle.className =
                                        "chat-header-title";

                                    const onlineDot =
                                        document.createElement("span");

                                    onlineDot.className =
                                        "chat-status-dot";

                                    const chatTitleText =
                                        document.createElement("span");

                                    chatTitleText.textContent =
                                        "Customer Conversation";

                                    chatHeaderTitle.appendChild(
                                        onlineDot
                                    );

                                    chatHeaderTitle.appendChild(
                                        chatTitleText
                                    );

                                    chatHeader.appendChild(
                                        chatHeaderTitle
                                    );


                                    const chatBody =
                                        document.createElement("div");

                                    chatBody.className =
                                        "chat-body";

                                    chatBody.id =
                                        "chatBody";


                                    const emptyMessage =
                                        document.createElement("div");

                                    emptyMessage.className =
                                        "chat-empty";

                                    emptyMessage.textContent =
                                        "No messages yet. Start the conversation with the customer.";

                                    chatBody.appendChild(
                                        emptyMessage
                                    );


                                    const composer =
                                        document.createElement("div");

                                    composer.className =
                                        "message-composer";


                                    const messageInput =
                                        document.createElement("input");

                                    messageInput.type =
                                        "text";

                                    messageInput.id =
                                        "message";

                                    messageInput.placeholder =
                                        "Type your message...";

                                    messageInput.autocomplete =
                                        "off";


                                    const sendButton =
                                        document.createElement("button");

                                    sendButton.id =
                                        "sendMessage";

                                    sendButton.innerHTML =
                                        `<i data-lucide="send"></i><span>Send</span>`;


                                    composer.appendChild(
                                        messageInput
                                    );

                                    composer.appendChild(
                                        sendButton
                                    );


                                    chatArea.appendChild(
                                        chatHeader
                                    );

                                    chatArea.appendChild(
                                        chatBody
                                    );

                                    chatArea.appendChild(
                                        composer
                                    );


                                    messagecontainer.appendChild(
                                        messageHeader
                                    );

                                    messagecontainer.appendChild(
                                        customerInfo
                                    );

                                    messagecontainer.appendChild(
                                        chatArea
                                    );

                                    maincontent.appendChild(
                                        messagecontainer
                                    );


                                    if (
                                        typeof lucide !==
                                        "undefined"
                                    ) {
                                        lucide.createIcons();
                                    }

                                          const token = localStorage.getItem("token");
                                          console.log("DEVELOPER SOCKET TOKEN SENT:" , token);
                                    messageInput.focus();
                                   const socket = io("https://ticketflow-backend-846m.onrender.com" , {
                                    auth : {
                                        token : token
                                    }

                                    
                                   });
                                   const chatbody =
                                   document.getElementById("chatBody");
                                   socket.on("received_message" , function(data) {
                                      console.log("RECEIVED MESSAGE:" , data.text);

                                      const message =
                                      document.createElement("div");

                                      message.className = "message-arrived";

                                      message.innerHTML = `
                                      <p>${data.text}</p>
                                      <span>now</span>
                                      `;

                                      chatbody.appendChild(message);


                                   });
                                   const ticketId = ticket.ticketid;
                                   console.log("TICKETID FROM THE DEVELOPER REQUEST:" , ticketId);

                                   fetch(`https://ticketflow-backend-846m.onrender.com/messages/developer/${ticketId}` , {
                                    method : "GET",
                                    headers : {
                                        "Authorization" : `Bearer ${token}`
                                    }
                                   })
                                   .then(res => res.json())
                                   .then(data => {
    console.log("DATAINFO:", data);

    const loggedindeveloper = data.loggedindeveloper;
    console.log("LOGGEDIN DEVELOPER:", loggedindeveloper);

    data.message.forEach(messages => {

        const message = document.createElement("div");

        const senderId = messages.senderid;
        const receiverId = messages.receiverid;

        console.log("SENDERID:", senderId);
        console.log("RECEIVERID:", receiverId);

        if (senderId === loggedindeveloper) {
            message.classList.add("message", "sent");
        } 
        else if (receiverId === loggedindeveloper) {
            message.classList.add("message", "received");
        }

        message.innerHTML = `
            <p>${messages.message}</p>
        `;

        chatbody.appendChild(message);
    });
})

                                    sendButton.addEventListener(
                                        "click",
                                        function(event) {

                                            event.preventDefault();

                                            const text =
                                                messageInput.value.trim();

                                            if (!text) {
                                                return;
                                            }

                                            console.log(
                                                "MESSAGE TO CUSTOMER:",
                                                text
                                            );

                                            

                                            socket.emit("send_message/developer" ,  {
                                                ticketid : ticket.ticketid,
                                                message : text

                                            });

                                            messageInput.value = "";

                                        }
                                    );


                                    messageInput.addEventListener(
                                        "keydown",
                                        function(event) {

                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {

                                                event.preventDefault();

                                                sendButton.click();

                                            }

                                        }
                                    );

                                }
                            );


                            ticketDetails.appendChild(
                                detailsHeading
                            );

                            ticketDetails.appendChild(
                                ticketIdElement
                            );

                            ticketDetails.appendChild(
                                customerId
                            );

                            ticketDetails.appendChild(
                                ticketSubject
                            );

                            ticketDetails.appendChild(
                                ticketCategory
                            );

                            ticketDetails.appendChild(
                                ticketPriority
                            );

                            ticketDetails.appendChild(
                                ticketDescription
                            );

                            ticketDetails.appendChild(
                                ticketStatus
                            );

                            ticketDetails.appendChild(
                                cancelbutton
                            );

                            ticketDetails.appendChild(
                                workingbutton
                            );

                            ticketDetails.appendChild(
                                message
                            );

                        })

                        .catch(error => {

                            console.log(
                                "TICKET DETAILS ERROR:",
                                error
                            );

                        });

                    }
                );

            });

            layout.appendChild(
                ticketsSection
            );

            layout.appendChild(
                ticketDetails
            );

            maincontent.appendChild(
                layout
            );

        })

        .catch(error => {

            console.log(
                "ERROR:",
                error
            );

        });

});