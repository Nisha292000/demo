const { Pool } = require("pg");
const nodemailer = require("nodemailer");

// ✅ Hardcoded DB connection string
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_AmxqwB1UgCf9@ep-holy-lab-aek137qt-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// ✅ Hardcoded Email Credentials
const EMAIL_USER = "nt200029@gmail.com";
const EMAIL_PASS = "vxxv kteb vcfb iaux";
const RECEIVER_EMAIL = "nt200029@gmail.com";

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

  // ✅ Setup nodemailer transporter
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

  try {
    // 1️⃣ Send the email
    await transporter.sendMail(mailOptions);

    // 2️⃣ Save to PostgreSQL
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO contact_submissions (name, email, phone, services, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, phone, services, message]
    );

    client.release();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Form submitted and saved to database!",
        submissionId: result.rows[0].id,
      }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error." }),
    };
  }
};
