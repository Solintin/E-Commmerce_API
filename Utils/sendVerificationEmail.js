const sendEmail = require("./sendEmail");

const sendVerificationEmail = (email, name, verificationToken) => {
  const message = `<p>Please confirm your email by clicking the following verification link ${verificationToken}</p>`;

  return sendEmail({
    to: email,
    subject: "Email confirmation",
    html: `<h3>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = sendVerificationEmail;
