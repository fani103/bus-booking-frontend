const axios = require("axios");

const sendWhatsAppMessage = async (message) => {
  try {
    const phone = process.env.WHATSAPP_NUMBER;

    // Example placeholder
    // Replace with Twilio or Meta API

    console.log("Sending WhatsApp message to:", phone);
    console.log(message);

  } catch (error) {
    console.error("WhatsApp send error:", error.message);
  }
};

module.exports = sendWhatsAppMessage;