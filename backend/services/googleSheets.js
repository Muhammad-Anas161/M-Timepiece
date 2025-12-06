import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const appendToSheet = async (orderData) => {
  try {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      console.warn('Google Sheets credentials missing. Skipping sheet update.');
      return;
    }

    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      SCOPES
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // Format data for sheet
    // Columns: Order ID, Date, Customer Name, Email, Phone/Address, Total, Items, Payment Method
    const date = new Date().toISOString().split('T')[0];
    const itemsString = orderData.items.map(i => `${i.name} (${i.quantity}) ${i.selectedColor ? '- ' + i.selectedColor : ''}`).join(', ');

    const values = [
      [
        orderData.id,
        date,
        orderData.customer.name,
        orderData.customer.email,
        `${orderData.address.street}, ${orderData.address.city}`,
        orderData.total,
        itemsString,
        orderData.customer.paymentMethod
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:H', // Assumes Sheet1 exists
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    });

    console.log(`Order ${orderData.id} appended to Google Sheet.`);
  } catch (error) {
    console.error('Error appending to Google Sheet:', error.message);
  }
};

export { appendToSheet };
