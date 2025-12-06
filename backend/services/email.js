import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderEmail = async (order, customer, items) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials missing. Skipping email notification.");
      return;
  }

  const itemsList = items.map(item => 
      `<li>${item.name} (x${item.quantity}) - ${item.selectedColor || 'Default'} - $${item.price}</li>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send TO the admin (self)
    subject: `New Order #${order.id} - ${customer.name}`,
    html: `
      <h2>New Order Received!</h2>
      <p><strong>Order ID:</strong> #${order.id}</p>
      <p><strong>Customer:</strong> ${customer.name} (${customer.email})</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <p><strong>Payment Method:</strong> ${customer.paymentMethod}</p>
      <h3>Items:</h3>
      <ul>${itemsList}</ul>
      <hr/>
      <p>Check "Google Sheet" or Admin Dashboard for more details.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order notification email sent for Order #${order.id}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
