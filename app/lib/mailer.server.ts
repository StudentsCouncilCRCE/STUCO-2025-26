import nodemailer from "nodemailer";

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.example.com",
    // port: 587,
    // secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    try {
        const info = await transporter.sendMail({
            from: "Students' Council: <team@example.com>", // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        });

    } catch (err) {
        console.error("Error while sending mail", err);
    }
}

