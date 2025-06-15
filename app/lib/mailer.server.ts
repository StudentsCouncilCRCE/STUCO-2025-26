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

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail", err);
    }
}

export function getVerificationMail(url: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #121212;
            color: #f0f0f0;
            line-height: 1.6;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .email-header {
            background: linear-gradient(135deg, #7e57c2, #9575cd);
            padding: 40px 30px;
            text-align: center;
        }

        .email-header h1 {
            color: white;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .email-header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
        }

        .email-body {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #f0f0f0;
        }

        .message {
            font-size: 16px;
            color: #b0b0b0;
            margin-bottom: 30px;
            line-height: 1.7;
        }

        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #7e57c2, #9575cd);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(126, 87, 194, 0.3);
            margin: 20px 0;
        }

        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(126, 87, 194, 0.4);
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        .alternative-text {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #333;
            font-size: 14px;
            color: #888;
        }

        .alternative-text strong {
            color: #f0f0f0;
        }

        .link-text {
            word-break: break-all;
            background-color: #2a2a2a;
            padding: 12px;
            border-radius: 6px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #7e57c2;
        }

        .contact-section {
            background-color: #252525;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #4caf50;
        }

        .contact-section h3 {
            color: #f0f0f0;
            font-size: 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .contact-section h3::before {
            content: "📞";
            margin-right: 8px;
        }

        .contact-details {
            color: #ccc;
            font-size: 14px;
            line-height: 1.6;
        }

        .contact-item {
            margin: 8px 0;
            display: flex;
            align-items: center;
        }

        .contact-item strong {
            color: #4caf50;
            min-width: 60px;
            margin-right: 8px;
        }

        .contact-item a {
            color: #4caf50;
            text-decoration: none;
        }

        .contact-item a:hover {
            text-decoration: underline;
        }

        .email-footer {
            background-color: #161616;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }

        .footer-links {
            margin-top: 15px;
        }

        .footer-links a {
            color: #7e57c2;
            text-decoration: none;
            margin: 0 10px;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        .security-note {
            background-color: #2a2a2a;
            border-left: 4px solid #7e57c2;
            padding: 16px;
            margin: 25px 0;
            border-radius: 6px;
        }

        .security-note p {
            font-size: 14px;
            color: #ccc;
            margin: 0;
        }

        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .email-footer {
                padding: 20px;
            }
            
            .verify-button {
                padding: 14px 24px;
                font-size: 15px;
                width: 100%;
                display: block;
            }
            
            .footer-links a {
                display: block;
                margin: 5px 0;
            }

            .contact-item {
                flex-direction: column;
                align-items: flex-start;
            }

            .contact-item strong {
                min-width: auto;
                margin-bottom: 4px;
            }
        }

        @media only screen and (max-width: 480px) {
            .email-header h1 {
                font-size: 22px;
            }
            
            .greeting {
                font-size: 16px;
            }
            
            .message {
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Verify Your Email</h1>
            <p>We're excited to have you on board!</p>
        </div>
        
        <div class="email-body">
            <div class="greeting">
                Hello there! 👋
            </div>
            
            <div class="message">
                Thank you for signing up! To complete your registration and secure your account, please verify your email address by clicking the button below.
            </div>
            
            <div class="button-container">
                <a href="${url}" class="verify-button">Verify Email Address</a>
            </div>
            
            <div class="security-note">
                <p><strong>Security Notice:</strong> This verification link will expire in 24 hours for your security. If you didn't create an account, you can safely ignore this email.</p>
            </div>
            
            <div class="alternative-text">
                <strong>Having trouble with the button?</strong><br>
                Copy and paste this link into your browser:
                <div class="link-text">
        ${url}
                </div>
            </div>

            <div class="contact-section">
                <h3>Need Help?</h3>
                <div class="contact-details">
                    <p>If you're having trouble with email verification or need assistance, feel free to reach out:</p>
                    <div class="contact-item">
                        <strong>Email:</strong>
                        <a href="mailto:support@frcrcestuco.com">support@frcrcestuco.com</a>
                    </div>
                    <div class="contact-item">
                        <strong>Phone:</strong>
                        <a href="tel:+919876543210">+91 98765 43210</a>
                    </div>
                    <div class="contact-item">
                        <strong>Hours:</strong>
                        <span>Monday - Friday, 9:00 AM - 6:00 PM IST</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="email-footer">
            <p>You're getting this email because you signed up on the <a href="https://frcrcestuco.com/"> Fr. CRCE Students' Council website </a>.</p>
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Support</a>
            </div>
            <p style="margin-top: 15px; font-size: 12px; color: #555;">
                © 2025 STUCO | All rights reserved
            </p>
        </div>
    </div>
</body>
</html>`;
}

export function getChangeEmailVerificationMail(url: string, oldEmail?: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Change Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #121212;
            color: #f0f0f0;
            line-height: 1.6;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .email-header {
            background: linear-gradient(135deg, #7e57c2, #9575cd);
            padding: 40px 30px;
            text-align: center;
        }

        .email-header h1 {
            color: white;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .email-header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
        }

        .email-body {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #f0f0f0;
        }

        .message {
            font-size: 16px;
            color: #b0b0b0;
            margin-bottom: 30px;
            line-height: 1.7;
        }

        .old-email-notice {
            background-color: #2a2a2a;
            border-left: 4px solid #7e57c2;
            padding: 16px;
            margin: 20px 0;
            border-radius: 6px;
        }

        .old-email-notice p {
            font-size: 14px;
            color: #ccc;
            margin: 0;
        }

        .old-email-notice .email-address {
            color: #7e57c2;
            font-weight: 600;
            font-family: 'Courier New', monospace;
        }

        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #7e57c2, #9575cd);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(126, 87, 194, 0.3);
            margin: 20px 0;
        }

        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(126, 87, 194, 0.4);
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        .alternative-text {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #333;
            font-size: 14px;
            color: #888;
        }

        .alternative-text strong {
            color: #f0f0f0;
        }

        .link-text {
            word-break: break-all;
            background-color: #2a2a2a;
            padding: 12px;
            border-radius: 6px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #7e57c2;
        }

        .contact-section {
            background-color: #252525;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #4caf50;
        }

        .contact-section h3 {
            color: #f0f0f0;
            font-size: 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .contact-section h3::before {
            content: "📞";
            margin-right: 8px;
        }

        .contact-details {
            color: #ccc;
            font-size: 14px;
            line-height: 1.6;
        }

        .contact-item {
            margin: 8px 0;
            display: flex;
            align-items: center;
        }

        .contact-item strong {
            color: #4caf50;
            min-width: 60px;
            margin-right: 8px;
        }

        .contact-item a {
            color: #4caf50;
            text-decoration: none;
        }

        .contact-item a:hover {
            text-decoration: underline;
        }

        .email-footer {
            background-color: #161616;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }

        .footer-links {
            margin-top: 15px;
        }

        .footer-links a {
            color: #7e57c2;
            text-decoration: none;
            margin: 0 10px;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        .security-note {
            background-color: #2a2a2a;
            border-left: 4px solid #7e57c2;
            padding: 16px;
            margin: 25px 0;
            border-radius: 6px;
        }

        .security-note p {
            font-size: 14px;
            color: #ccc;
            margin: 0;
        }

        .warning-section {
            background-color: #2d2640;
            border: 1px solid #7e57c2;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }

        .warning-section h3 {
            color: #7e57c2;
            font-size: 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .warning-section h3::before {
            content: "⚠️";
            margin-right: 8px;
        }

        .warning-section p {
            color: #ccc;
            font-size: 14px;
            line-height: 1.6;
        }

        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .email-footer {
                padding: 20px;
            }
            
            .verify-button {
                padding: 14px 24px;
                font-size: 15px;
                width: 100%;
                display: block;
            }
            
            .footer-links a {
                display: block;
                margin: 5px 0;
            }

            .contact-item {
                flex-direction: column;
                align-items: flex-start;
            }

            .contact-item strong {
                min-width: auto;
                margin-bottom: 4px;
            }
        }

        @media only screen and (max-width: 480px) {
            .email-header h1 {
                font-size: 22px;
            }
            
            .greeting {
                font-size: 16px;
            }
            
            .message {
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Verify Email Change</h1>
            <p>Confirm your new email address</p>
        </div>
        
        <div class="email-body">
            <div class="greeting">
                Hello! 👋
            </div>
            
            <div class="message">
                You've requested to change your email address. To complete this change and ensure secure access to your account, please verify your new email address by clicking the button below.
            </div>

            ${oldEmail ? `
            <div class="old-email-notice">
                <p><strong>Previous email:</strong> <span class="email-address">${oldEmail}</span></p>
                <p>This will be replaced once you verify your new email address.</p>
            </div>
            ` : ''}
            
            <div class="button-container">
                <a href="${url}" class="verify-button">Verify New Email Address</a>
            </div>
            
            <div class="warning-section">
                <h3>Important Security Information</h3>
                <p>If you didn't request this email change, please contact our support team immediately. Your account security is important to us.</p>
            </div>
            
            <div class="security-note">
                <p><strong>Security Notice:</strong> This verification link will expire in 24 hours for your security. After verification, you'll need to use your new email address for future logins.</p>
            </div>
            
            <div class="alternative-text">
                <strong>Having trouble with the button?</strong><br>
                Copy and paste this link into your browser:
                <div class="link-text">
        ${url}
                </div>
            </div>

            <div class="contact-section">
                <h3>Need Help?</h3>
                <div class="contact-details">
                    <p>If you're having trouble with email verification or need assistance, feel free to reach out:</p>
                    <div class="contact-item">
                        <strong>Email:</strong>
                        <a href="mailto:support@frcrcestuco.com">support@frcrcestuco.com</a>
                    </div>
                    <div class="contact-item">
                        <strong>Phone:</strong>
                        <a href="tel:+919876543210">+91 98765 43210</a>
                    </div>
                    <div class="contact-item">
                        <strong>Hours:</strong>
                        <span>Monday - Friday, 9:00 AM - 6:00 PM IST</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="email-footer">
            <p>You're getting this email because you requested to change your email on the <a href="https://frcrcestuco.com/"> Fr. CRCE Students' Council website </a>.</p>
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Support</a>
            </div>
            <p style="margin-top: 15px; font-size: 12px; color: #555;">
                © 2025 STUCO | All rights reserved
            </p>
        </div>
    </div>
</body>
</html>`;
}