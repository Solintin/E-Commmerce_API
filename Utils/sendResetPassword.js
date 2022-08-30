const sendEmail = require("./sendEmail");

const sendResetPassword = ({ email, name, verificationToken }) => {
  const message = `<p>Please click on the following verification link  ${verificationToken} to reset your password</p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h3>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = sendResetPassword;
