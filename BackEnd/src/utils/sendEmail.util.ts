import nodemailer from "nodemailer";
import { type Request } from "express";

const transporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const sendEmail = async (email: string, otp: string): Promise<boolean> => {
  const mailOptions = {
    from: `"Verify your email"<${process.env.USER as string}>`,
    to: email,
    subject: "-OTP-",
    html: `
        <p>your otp <b>${otp}</b></p>`,
  };

  try {
    void transporter().sendMail(mailOptions);
    return await Promise.resolve(true);
  } catch (error: any) {
    return await Promise.resolve(false);
  }
};

const sendEmailAfterVerification = async (email: string, nama: string) => {
  const mailOptions = {
    from: `"email verification successful"<${process.env.USER as string}>`,
    to: email,
    subject: "Success",
    html: `
        <center>
        <h3>halo ${nama} akun anda telah terdaftar di AKBAROXYZC</h3>
        </center>
        `,
  };

  try {
    void transporter().sendMail(mailOptions);
    return await Promise.resolve(true);
  } catch (error: any) {
    return await Promise.resolve(false);
  }
};

const sendEmailForCollaboration = async (
  req: Request,
  email: string,
  nama: string,
  nameStore: string,
  idStore: string
) => {
  const mailOptions = {
    from: `"Verification for collaboration"<${process.env.USER as string}>`,
    to: email,
    subject: "Collaboration",
    html: `
        <center>
        <h3>halo ${nama} anda diajak collaboration di ${nameStore}</h3>
        <a href="http://${req.headers.host as string}/api/store/accept/${idStore}">klik disini untuk menerima</a>
        </center>
        `,
  };

  try {
    void transporter().sendMail(mailOptions);
    return await Promise.resolve(true);
  } catch (error: any) {
    return await Promise.resolve(false);
  }
};

export { sendEmail, sendEmailAfterVerification, sendEmailForCollaboration };
