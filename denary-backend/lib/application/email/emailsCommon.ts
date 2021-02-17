import * as async from "async";
import nodemailer = require("nodemailer");
import { catProd } from "../../../logingConfig";
import { stringToString } from "./../comon/commonTool";

export class SendNotification {

    public async sendNotification(mailOptions: any) {
        const myTransporter = this.getTransporter();
        if (myTransporter === null) { console.error("Message not sent."); return; }
        // setup email data with unicode symbols
        async.parallel({
            out: (callback) => myTransporter.sendMail(mailOptions).then((out) => callback(out)).catch((error) => callback(error, null)),
        }, async (error, results: { out: any }) => {
            if (!error) {
                catProd.info(() => "Notificaton has been send: " + results.out.subject);
            } else { catProd.info(() => "Notificaton has been send: " + error); }
        });
    }

    private getTransporter() {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAILS_FROM, // generated ethereal user
                pass: process.env.EMAILS_PASSWORD, // generated ethereal password
            },
        });
        return transporter;
    }

}

export function getEmailFrom(): string {
    if (process.env.EMAILS_SYSTEM_NAME) {
        return process.env.EMAILS_SYSTEM_NAME + " <" + process.env.EMAILS_FROM + ">";
    }
    return "AppsTest <test_office@apps-garden.com>";
}

export function shellSend(): boolean {
    if (process.env.EMAILS_SEND) {
        if (stringToString(process.env.EMAILS_SEND).toLowerCase().trim() === "yes") {
            return true;
        }
    }
    return false;
}

export function sendEmial(mailOptions: any) {
    if (shellSend()) {
        new SendNotification().sendNotification(mailOptions);
    }
}
