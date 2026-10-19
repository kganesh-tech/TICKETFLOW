require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");
const sendEmail = require("./utils/nodemailer");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./utils/authmiddleware.js");
const http = require("http");
const { Server } = require("socket.io");
const socketAuth = require("./utils/socketAuth.js");


const app = express();
const server = http.createServer(app);
 const io = new Server(server , {
       cors : {
        origin: "*"
       }
 });

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/index.html");
});


const client = new MongoClient(process.env.MONGODB_URI);

let users;
let tickets;
let claimedtickets;
let messages;

async function connectDB() {
    try {
        await client.connect();

        const db = client.db("TEAMTASK1");
        users = db.collection("users");
        tickets = db.collection("tickets");
        claimedtickets = db.collection("claimedtickets");
        messages = db.collection("messages");

        console.log("MONGODB connected successfully");

        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        });

    } catch (error) {
        console.log("ERROR:", error);
    }
}

app.post("/users", async (req, res) => {
    try {
        const { employeeData } = req.body;

        console.log("EMPLOYEEDATA:", employeeData);

        const employeedata = {
            userId: "usr_" + crypto.randomBytes(16).toString("hex"),
            USERNAME: employeeData.username,
            EMAIL: employeeData.email,
            PASSWORD: employeeData.password,
            ROLE: employeeData.roles
        };

        const activationLink =
            `http://localhost:3000/changepassword.html?username=${encodeURIComponent(employeedata.USERNAME)}`;

        console.log("BEFORE INSERT");

        await users.insertOne(employeedata);

        console.log("AFTER INSERT");

        await sendEmail(
            employeedata.EMAIL,
            activationLink
        );

        console.log("EMAIL SENT");

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            employee: employeedata
        });

    } catch (error) {
        console.log("ERROR IN /users:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create employee account",
            error: error.message
        });
    }
});

app.post("/changepassword/:username" , async(req,res) => {


    const { username } = req.params;
    const newpassword  = req.body.newpassword;

    console.log(username);
    console.log(newpassword);

    const result = await users.updateOne({USERNAME : username} , 
                                       {
                                       $set: {
                                        PASSWORD : newpassword
                                       }
                                    }
    );
    return res.status(201).json({
        message : "Password changed successfully.Account activated"
    });


    
});

app.post("/login/users" , async(req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log("LOGINDETAILS RECEIVED:" , email , password);

   const userData = await users.findOne({
    EMAIL: email,

    PASSWORD: password
});

if (!userData) {
    return res.status(401).json({
        message: "Email or password is incorrect"
    });
}


const token = jwt.sign(
    {
        email: userData.EMAIL,
        
        role: userData.ROLE
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

return res.status(200).json({
    message: "LOGIN SUCCESSFUL",
    token: token,
    user: {
        id: userData._id,
        userid : userData.userId,
        
        username : userData.USERNAME,
        email: userData.EMAIL,
        role: userData.ROLE
    }
});



});

app.post("/signup/users", async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    console.log("SIGNUP DATA:", req.body);

    await users.insertOne({
        userId: "cus_" + crypto.randomBytes(8).toString("hex"),
        USERNAME: name,
        EMAIL: email,
        PASSWORD : password,
        ROLE : role
    });

    return res.status(201).json({
        message: "Account created Successfully"
    });
});



app.post("/tickets/:userid" , async(req,res) => {
    const userid = req.params.userid;
    const subjectvalue = req.body.subjectvalue;
    const categoryvalue = req.body.categoryvalue;
    const priorityvalue= req.body.priorityvalue;
    const descriptionvalue = req.body.descriptionvalue;
    
    console.log("TICKET DETAILS : " , {
        userid,
        subjectvalue,
        categoryvalue,
        priorityvalue,
        descriptionvalue
    });

    await tickets.insertOne({
       ticketid : "tic_" + crypto.randomBytes(2).toString("hex"),
       userId : userid,
       subject : subjectvalue,
       category : categoryvalue,
       priority : priorityvalue,
       description : descriptionvalue,
       status : "open",
       tickettoken : crypto.randomBytes(8).toString("hex")


    });

    return res.status(201).json({
        message : "ticket have created "
    });
});
app.get("/customerdata", authMiddleware, async (req, res) => {

    console.log("USER FROM TOKEN:", req.user);

    try {

        const email = req.user.email;

        const userData = await users.findOne({
            EMAIL : email
        });

        if (!userData) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Customer data fetched successfully",
            user: {
                id: userData._id,
                userId: userData.userId,
                username: userData.USERNAME,
                email: userData.EMAIL,
                role: userData.ROLE
            }
        });

    } catch (error) {

        console.log("CUSTOMER DATA ERROR:", error);

        return res.status(500).json({
            message: "Server error"
        });

    }
});
app.get("/customertickets", authMiddleware, async (req, res) => {

    try {

        const email = req.user.email;

        const customer = await users.findOne({
            EMAIL: email
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }
        console.log(customer);

        const userId = customer.userId;

        console.log("CUSTOMER ID:", userId);

        const customerTickets = await tickets.find({
            userId : userId
        }).toArray();

        console.log("CUSTOMER TICKETS:", customerTickets);

        return res.status(200).json({
            message: "Customer tickets fetched successfully",
            tickets: customerTickets
        });

    } catch (error) {

        console.log("CUSTOMER TICKETS ERROR:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/alltickets" , authMiddleware , async(req,res) => {
    const email = req.user.email;

    console.log(email);

const alltickets = await tickets.find({status : "open"}).toArray();
  

  res.json(alltickets);

});
app.post("/claimedticket" , authMiddleware , async(req,res) => {
    const email  = req.user.email;
    const { ticket } = req.body;

    console.log("EMAIL RECEIVED:" , email);
    console.log("TICKET DETAILS CLAIMED:" , ticket);

    const userdetails = await users.findOne({ EMAIL : email });
    const ticketId = ticket.ticketid;
     console.log("TICKETID CLAIMED:" , ticketId);

    console.log("USER FOUND:" , userdetails);

    await tickets.updateOne(
        {ticketid : ticketId} ,
       {
        $set : {
            status : "claimed"
        }
       }
    );

    await claimedtickets.insertOne({
          ticketid : ticket.ticketid,
          userId : ticket.userId,
          employee_username : userdetails.USERNAME,
          employeeid : userdetails.userId,
          status : "In progress",
          category : ticket.category


    });

    return res.status(201).json({
        message : "view",
        message1 : "ticketid claimed successfully"
    });
    

    
});


app.get("/updatedtickets" , authMiddleware , async(req,res) => {

    const email = req.user.email;

  console.log("email received:" , email);

  const userdetails = await users.findOne({EMAIL : email});

  console.log("USERDETAILS:" , userdetails);

  console.log("USERDETAILS_USERID:" , userdetails.userId);

  const USERID = userdetails.userId;

 

const claimedTickets = await claimedtickets.find({userId : USERID }).toArray();

console.log("ALL CLAIMED TICKETS:" , claimedTickets);

res.json({
    tickets : claimedTickets
});
  
 

  

});

app.get("/ticketsclaimed" , authMiddleware , async(req,res) => {
    const email = req.user.email;

    console.log("Requested user claimedtickets:" , email);

    const userdetails = await users.findOne({ EMAIL : email });

    console.log("USER FOUND:" , userdetails);

    const userId = userdetails.userId;

    console.log("USERID RECEIVED:" , userId);

    const claimedTickets = await claimedtickets.find({employeeid : userId , status : "In progress"}).toArray();

    console.log("CLAIMEDTICKETS OF DEVELOPER:" , claimedTickets);

    res.json(claimedTickets);
});

app.get("/tickets" , authMiddleware , async(req,res) => {
    const email = req.user.email;

    const userDetails = await users.findOne({EMAIL : email});

    console.log("USER FOUND:" , userDetails);

    const userId = userDetails.userId;


    const claimedticketsdetails = await claimedtickets.findOne({employeeid : userId});

    console.log("EMPLOYEE CLAIMED TICKETS:" , claimedticketsdetails);

    const ticketId = claimedticketsdetails.ticketid;

    const ticketinfo = await tickets.findOne({ticketid : ticketId});

    console.log("TICKETINFO found:" , ticketinfo);
    res.json(ticketinfo);
})

app.post("/working/:ticketId" , authMiddleware , async(req,res) => {
    const email = req.user.email;
    const ticketId = req.params.ticketId;

    console.log("RECEIVED EMAIL: " , email);
    console.log("RECEIVED TICKETID:" , ticketId);

    const userDetails = await claimedtickets.findOne({ticketid : ticketId});

     console.log("CLAIMEDTICKETS TO BE UPDATED:" , userDetails);

     console.log("Ready to to be changed to the working on your ticket");

     await claimedtickets.updateOne(
        {ticketid : ticketId} ,
            {
                $set: {
                    status: "Working on your Ticket"
                }
            }
        
        );

        return res.status(201).json({
            message : "Currently Working"
        });

});
app.post("/solved/:ticketId" , authMiddleware , async(req,res) => {

    const email = req.user.email;
    const ticketId = req.params.ticketId;

    await claimedtickets.updateOne(
        {ticketid : ticketId} , 
        {
            $set: {
                status : "Solved"
            }
        }
    );

});

app.post("/forgotpassword" , async(req,res)=> {
  const email = req.body.email;
  const password = req.body.password;
    console.log("RECEIVED DETAILS:"  , {email , password});

    const USER = await users.findOne({EMAIL : email});
    console.log("USER FOUND:" , USER);

    await users.updateOne(
        {EMAIL : email},
        {
            $set: {
                PASSWORD : password
            }
        }

    );

    return res.status(201).json({
        message : "password changed successfully"
    });

});

app.get("/mytickets" , authMiddleware , async(req,res) => {
    const email = req.user.email;

    console.log("MY TICKETS EMAIL:" , email);

    const userData = await users.findOne({ EMAIL : email});

    console.log("USERDATA FOUND:" , userData);

    const userId = userData.userId;

    console.log("USERID FOUND:" , userId);

    const ticketraised = await tickets.find({userId : userId}).toArray();

    console.log("TICKETS RAISED:" , ticketraised);

    res.json(ticketraised);
})

app.get("/myticketsclaimed" , authMiddleware , async(req,res) => {
    const email = req.user.email;

    const userData = await users.findOne({ EMAIL : email});

    const userId = userData.userId;
    console.log("customer userid:" , userId);

    const myticketsclaimed = await claimedtickets.find({userId : userId}).toArray();

    console.log("MYTICKETSCLAIMED:" , myticketsclaimed);

    res.json(myticketsclaimed);

})
io.use(socketAuth);
io.on("connection" ,  function(socket) {
     
    console.log("USER CONNECTED:" , socket.id);
    const email = socket.user.email;

    console.log("SOCKET AUTHENTICATED user:" , email);

   

    socket.on("send_message" , async function(data) {
        console.log("TICKET ID:" , data.ticketid);
        console.log("MESSAGE:", data.message);
        const ticketId = data.ticketid;
     const userData = await users.find({EMAIL : email});
     console.log("USERDATA FOUND:" , userData);
    const employeedata = await claimedtickets.findOne({ticketid : ticketId});

    console.log("EMPLOYEEDATA:" , employeedata);

     const employeeid = employeedata.employeeid;
    

        const customerid = employeedata.userId;
        await messages.insertOne ({
            customerid : customerid,
            employeeid : employeeid,
            senderid : customerid,
            receiverid : employeeid,
            socketid : socket.id,
            ticketid : data.ticketid,
            message : data.message

        });

        socket.emit("received_message" , {
            ticketid : data.ticketid,
            message : data.message
        });
    });
});
app.get("/messages/:ticketid" , authMiddleware ,  async(req,res) => {
    const ticketId = req.params.ticketid;
    const email = req.user.email;
    console.log("ALL MESSAGES:" , email);
    
    const userData = await users.findOne({ EMAIL : email});
    console.log("USERDATA FETCHED:" , userData);

    const loggedinuserId = userData.userId;
    console.log("LOGGEDINUSERID:" , loggedinuserId);

    console.log("TICKETID USED TO GET THE MESSAGES:" , ticketId);

    const messagesData = await messages.find({ticketid : ticketId }).toArray();
      console.log("MESSAGESDATA:" , messagesData);
      return res.status(201).json({
        loggedinuser : loggedinuserId,
        message : messagesData
      });

});


io.use(socketAuth);
io.on("connection" , function(socket) {

    
    console.log("USER CONNECTED:" , socket.id);
    console.log("USEREMAIL:" , socket.user.email);
    const email = socket.user.email;

    socket.on("send_message/developer" , async function(data) {
         

         console.log("TICKETID RECEIVED:" , data.ticketid);
         console.log("MESSAGE RECEIVED:" , data.message);
         const text = data.message;
         const ticketId = data.ticketid;

         const employeedata = await users.findOne({EMAIL : email});

         console.log("EMPLOYEEDATA FOUND:" , employeedata);

         const userData = await claimedtickets.findOne({ticketid : ticketId});

         console.log("USERDATA FOUND OF DEVELOPER SIDE:" , userData);

         const employeeid = userData.employeeid;
         const customerid = userData.userId;
         console.log("IDS found" , {
            employeeid , customerid
         });

         await messages.insertOne({
            socketid : socket.id,
            employeeid : employeeid,
            customerid : customerid,
            senderid : employeeid,
            receiverid : customerid,
            ticketid : ticketId,
            message : text


         });

         socket.emit("received_message" ,  {
            ticketId : data.ticketid,
            text : data.message
         });
    });
});
app.get("/messages/developer/:ticketId" , authMiddleware , async(req,res) => {
    const email = req.user.email;
    const ticketId = req.params.ticketId;

    console.log("TICKETID FETCHED FROM THE DEVELOPER:", ticketId);

    console.log("DEVEOPER EMAIL RECEIVED:" , email);

  const userData = await users.findOne({EMAIL : email});
   const userId = userData.userId;
   console.log("LOGGEDIN  DEVELOPER:" , userId);
 const DeveloperData = await messages.find({ticketid : ticketId}).toArray();

 console.log("DEVELOPERDATA:" , DeveloperData);

return res.status(201).json({
    message : DeveloperData,
    loggedindeveloper : userId
});

});

app.post("/notification" , authMiddleware , async(req,res)=> {
    const email  = req.user.email;
    console.log("EMAIL RECEIVED FOR THE NOTIFICATION:" , email);

    const userDetails = await users.findOne({EMAIL : email});

    console.log("USERDETAILS REQUESTED FOR THE NOTIFICATION:" , userDetails);
    const userid = userDetails.userId;
    console.log("NOTIFICATION USERID:" , userid);

    const ticketsdetails = await tickets.find({userId : userid , status : "claimed"}).toArray();

    console.log("NOTIFICATION TICKETDETAILS:" , ticketsdetails);
    res.json(ticketsdetails);
})
connectDB();
