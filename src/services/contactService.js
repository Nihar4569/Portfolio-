// Contact Service - Handles sending messages from contact form and chatbot
import emailjs from '@emailjs/browser';

/**
 * Send a contact message using EmailJS
 * @param {Object} data - Contact form data
 * @param {string} data.name - Sender's name
 * @param {string} data.email - Sender's email
 * @param {string} data.subject - Message subject (optional)
 * @param {string} data.message - Message content
 * @param {string} data.source - Source of message ('contact_form' or 'chatbot')
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendContactMessage = async (data) => {
  const { name, email, subject = '', message, source = 'chatbot' } = data;

  // Validate required fields
  if (!name || !email || !message) {
    return {
      success: false,
      error: 'Please provide name, email, and message.'
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Please provide a valid email address.'
    };
  }

  try {
    // Get timestamp
    const timestamp = new Date().toLocaleString();
    
    // Create combined message with all details (same format as ContactPage)
    const combinedMessage = `
Name: ${name}
Email: ${email}
Subject: ${subject || 'Message from NIHAR-AI Chatbot'}
Source: ${source}
Timestamp: ${timestamp}

Message:
${message}
`;

    // Template params matching the ContactPage format
    const templateParams = {
      user_name: name,
      user_email: email,
      subject: subject || 'New Message from NIHAR-AI Chatbot',
      message: combinedMessage,
      timestamp: timestamp
    };

    // Send using EmailJS with environment variables
    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    );

    console.log('EmailJS Success:', response);

    return {
      success: true,
      message: 'Message sent successfully! Nihar will get back to you soon.'
    };

  } catch (error) {
    console.error('Error sending contact message:', error);
    return {
      success: false,
      error: error.text || 'Failed to send message. Please try again.'
    };
  }
};

export default sendContactMessage;
