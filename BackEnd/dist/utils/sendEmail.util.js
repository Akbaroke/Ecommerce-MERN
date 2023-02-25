"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailForCollaboration = exports.sendEmailAfterVerification = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = () => {
    return nodemailer_1.default.createTransport({
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
const sendEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"Verify your email"<${process.env.USER}>`,
        to: email,
        subject: "-OTP-",
        html: `
        <p>your otp <b>${otp}</b></p>`,
    };
    try {
        void transporter().sendMail(mailOptions);
        return yield Promise.resolve(true);
    }
    catch (error) {
        return yield Promise.resolve(false);
    }
});
exports.sendEmail = sendEmail;
const sendEmailAfterVerification = (email, nama) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"email verification successful"<${process.env.USER}>`,
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
        return yield Promise.resolve(true);
    }
    catch (error) {
        return yield Promise.resolve(false);
    }
});
exports.sendEmailAfterVerification = sendEmailAfterVerification;
const sendEmailForCollaboration = (req, email, nama, nameStore, idStore) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"Verification for collaboration"<${process.env.USER}>`,
        to: email,
        subject: "Collaboration",
        html: `
        <center>
        <h3>halo ${nama} anda diajak collaboration di ${nameStore}</h3>
        <a href="http://${req.headers.host}/api/store/accept/${idStore}">klik disini untuk menerima</a>
        </center>
        `,
    };
    try {
        void transporter().sendMail(mailOptions);
        return yield Promise.resolve(true);
    }
    catch (error) {
        return yield Promise.resolve(false);
    }
});
exports.sendEmailForCollaboration = sendEmailForCollaboration;
