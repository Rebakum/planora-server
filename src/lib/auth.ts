import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const veryficationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        // console.log({ user, url, token });
        const info = await transporter.sendMail({
          from: '"Prisma Blog " <prismablog@ph.com>',
          to: user.email,
          subject: "Please veryfi Your Email",

          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 30px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333;">
              <h2>Hello ${user.name || "there"} </h2>

              <p>
                Thank you for signing up to <strong>Prisma Blog</strong>.
                Please verify your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a
                  href="${veryficationUrl}"
                  style="
                    background:#4f46e5;
                    color:#ffffff;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#555;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:13px; color:#4f46e5;">
                ${url}
              </p>

              <p style="font-size:14px; color:#555;">
                This link will expire soon for security reasons.
              </p>

              <p style="font-size:14px; color:#555;">
                If you didn’t create this account, you can safely ignore this email.
              </p>

              <p style="margin-top:30px;">
                Best regards,<br />
                <strong>Prisma Blog Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
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
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    telemetry: {
      debug: true,
    },
    // logger: {
    //   level: "info",
    //   log: (level, message, ...args) => {
    //     console.log({
    //       level,
    //       message,
    //       metadata: args,
    //       timestamp: new Date().toISOString(),
    //     });
    //   },
    // },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
