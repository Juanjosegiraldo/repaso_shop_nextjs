import nodemailer from "nodemailer";

// Build a Gmail SMTP transporter, or null when credentials are missing.
function getTransporter() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    console.warn("MAIL_USER/MAIL_PASS not set: email is disabled");
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL on port 465
    auth: { user, pass },
  });
}

// Welcome email sent after a successful registration.
export async function sendWelcomeEmail(nombre: string, email: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return; // no credentials: skip silently (already warned)

  await transporter.sendMail({
    from: `"ShopNova" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Welcome to ShopNova!",
    text: `Hi ${nombre}, welcome to ShopNova! Your account is ready.`,
    html: `<p>Hi <strong>${nombre}</strong>, welcome to ShopNova! Your account is ready.</p>`,
  });
}

// Generic email used by the sales report cron.
export async function sendReportEmail(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  await transporter.sendMail({
    from: `"ShopNova" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
  });
}
