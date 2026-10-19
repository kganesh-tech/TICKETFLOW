require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (userEmail, activationLink) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "TEAMTASK - Account Activation",
            text: `Congratulations!

Your TEAMTASK company account has been created.

Email: ${userEmail}

Please activate your account and create your password using the link below:

${activationLink}

This activation link is for setting up your TEAMTASK account.

Regards,
TEAMTASK`
        });

        console.log("EMAIL sent successfully");
    } catch (error) {
        console.log("ERROR IN SENDING EMAIL:", error);
    }
};

module.exports = sendEmail;