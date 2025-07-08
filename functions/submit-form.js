const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const { name, email, phone, services, message } = JSON.parse(event.body);

  if (!name || !email || !phone || !services || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "All fields are required." }),
    };
  }

  // ✅ Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: "New Contact Form Submission",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Service: ${services}
      Message: ${message}
    `,
  };

  // ✅ MongoDB Save
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await transporter.sendMail(mailOptions);

    await client.connect();
    const db = client.db("leads"); // You can name the DB
    const collection = db.collection("mail_submissions");

    await collection.insertOne({
      name,
      email,
      phone,
      services,
      message,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent and saved!" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process form." }),
    };
  } finally {
    await client.close();
  }
};
