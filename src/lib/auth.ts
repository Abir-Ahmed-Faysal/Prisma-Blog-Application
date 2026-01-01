import { betterAuth, email } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "fr.abir.ahmed.faysal@gmail.com",
    pass: "bljrakfaubuafycf",
  },
});



export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!]
  ,
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false
      }
    }
  }
  ,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },








  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true
    ,
    sendVerificationEmail: async ({ user, url, token }, request) => {

      const VerificationEmail = `${process.env.APP_URL}/verify_email?token=${token}`

      const info = await transporter.sendMail({
        from: '"Prisma Blog Application" <prisma.blog.application@gmail.com>',
        to: "fr.abir.ahmed.faysal@gmail.com",
        subject: "Verify your prisma Account",
        text: "Prisma Blog Application Verify Email", // Plain-text version of the message
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background:#0f172a; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px;">
                Prisma Blog Application
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">Verify your email address</h2>

              <p style="font-size:15px; line-height:1.6;">
                Thank you for creating an account with <strong>Prisma Blog Application</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${VerificationEmail}"
                   style="
                     background:#2563eb;
                     color:#ffffff;
                     padding:14px 28px;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:bold;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#555555;">
                If the button doesn’t work, copy and paste the following link into your browser:
              </p>

              <p style="word-break:break-all; font-size:13px; color:#2563eb;">
                ${VerificationEmail}
              </p>

              <p style="font-size:14px; color:#555555;">
                This verification link will expire in <strong>15 minutes</strong>.
                If you did not create an account, you can safely ignore this email.
              </p>

              <p style="margin-top:30px;">
                Regards,<br />
                <strong>Prisma Blog Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#666;">
              © 2025 Prisma Blog Application. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
      });

      console.log("Message sent:", info.messageId);
      ;
    },

  },

  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

    },
  }
});
