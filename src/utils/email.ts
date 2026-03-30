import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: process.env.APP_USER,
    to: email,
    subject: "Planora Email Verification",
    text: `Your OTP is ${otp}`,
  });
};