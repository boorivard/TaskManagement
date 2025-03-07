require("dotenv").config(); // Load environment variables

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

console.log("Email User:", process.env.EMAIL_USER); // Debugging

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Should print a valid email in logs
        pass: process.env.EMAIL_PASS, // Should be set correctly
    },
});

app.post("/send-invite", (req, res) => {
    const { emails, projectName } = req.body;

    if (!emails || emails.length === 0) {
        return res.status(400).json({ message: "No emails provided" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emails.join(","),
        subject: "Project Invitation",
        text: `A user has invited you to the project: ${projectName}!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email error:", error);
            return res.status(500).json({ message: "Failed to send email", error: error.toString() });
        }
        res.json({ message: "Invitations sent successfully!" });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


