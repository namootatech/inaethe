const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const {MailerSend} = require("mailersend");
const Sender = require("mailersend").Sender;

console.log(MailerSend)
require('dotenv').config();

const mailersend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

const sendTemplateEmail = ({to, from, subject,templateId, personalization}) => {
    const recipients = to.map((person) => new Recipient(person.email, person.name));
    const sentFrom = new Sender(from.email, from.name);

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(subject)
        .setTemplateId(templateId)
        .setPersonalization(personalization);
    console.log(process.env.MAILERSEND_API_KEY)
    console.log(emailParams)
    console.log(mailersend)
   return  mailersend.email.send(emailParams);
};

const sendTextEmail = ({to, from, subject, text}) => {
    const recipients = to.map((email) => new Recipient(email));
    const emailParams = new EmailParams()
        .setFrom(from.email)
        .setFromName(from.name)
        .setRecipients(recipients)
        .setSubject(subject)
        .setText(text);
    return mailersend.send(emailParams);
}

const sendHtmlEmail = ({to, from, subject, html}) => {
    const recipients = to.map((email) => new Recipient(email));
    const emailParams = new EmailParams()
        .setFrom(from.email)
        .setFromName(from.name)
        .setRecipients(recipients)
        .setSubject(subject)
        .setHtml(html);
    return mailersend.send(emailParams);
}

module.exports = {
    sendTemplateEmail,
    sendTextEmail,
    sendHtmlEmail
}