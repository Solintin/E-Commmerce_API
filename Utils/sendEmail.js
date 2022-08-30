const nodemailer = require("nodemailer");
const config = require("./nodeMailer.Config");
const sendEmail = async ({ to, subject, html }) => {
  //   let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(config);

  return transporter.sendMail(
    {
      from: '"Akanji Ayodele <devsaalih@easytech.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log(`Message sent to ${to} successfully`);
    }
  );
};

module.exports = sendEmail;
