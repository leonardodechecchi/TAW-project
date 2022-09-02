import nodemailer from 'nodemailer';

/**
 *
 * @param email
 * @param subject
 * @param html
 */
export const sendEmail = async (email: string, subject: string, html: string) => {
  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'ea1c466bf9ab61',
        pass: 'f4e75c5032c2cf',
      },
    });

    const mailOptions = {
      from: 'ea1c466bf9ab61',
      to: email,
      subject: subject,
      html: html,
    };

    console.log(mailOptions);

    await transport.sendMail(mailOptions);

    console.log(`[${'nodemailer'.blue}]: mail sent successfully`);
  } catch (err) {
    console.log(`[${'nodemailer'.blue}]: mail not sent`);
    console.log(err);
  }
};
