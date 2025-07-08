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

  // Hardcoded credentials (replace with your actual data)
  const EMAIL_USER="nt200029@gmail.com"
  const EMAIL_PASS="vxxv kteb vcfb iaux"
  const RECEIVER_EMAIL="nt200029@gmail.com"
  const MONGO_URI = "mongodb+srv://sumit:VTZZ7KT6T4ws5Vdv@cluster0.mztgyow.mongodb.net/"

  // Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: RECEIVER_EMAIL,
    subject: "New Contact Form Submission",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Service: ${services}
      Message: ${message}
    `,
  };

  // MongoDB Save
  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await transporter.sendMail(mailOptions);

    await client.connect();
    const db = client.db("leads"); // Database name
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