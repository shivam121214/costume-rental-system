/**
 * WhatsApp Service - Frontend
 * Handles WhatsApp integration for the customer portal
 */

/**
 * Open WhatsApp deep-link in new window/tab
 * @param {string} phoneNumber - Admin phone number (format: country_code + number, e.g., "919876543210")
 * @param {string} message - Pre-filled message text
 */
export const openWhatsAppDeepLink = (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(url, '_blank');
};

/**
 * Generate WhatsApp message for request submission
 * @param {Object} customerData - {name: string, phone: string}
 * @param {Array} cartItems - Array of cart items with product details
 * @returns {string} Formatted WhatsApp message
 */
export const generateRequestSubmissionMessage = (customerData, cartItems) => {
    let message = "Hello, I just placed a costume rental request.\n\n";
    message += "📋 *Customer Details*\n";
    message += `Name: ${customerData.name}\n`;
    message += `Phone: ${customerData.phone}\n\n`;
    
    if (cartItems.length === 1) {
        const item = cartItems[0];
        message += "👗 *Costume Details*\n";
        message += `Product: ${item.product_name}\n`;
        message += `Size/Variant: ${item.variant}\n`;
        message += `Quantity: ${item.quantity}\n`;
        message += `Rental Dates: ${formatDate(item.start_date)} to ${formatDate(item.end_date)}\n`;
    } else {
        message += `👗 *Costume Items (${cartItems.length})*\n`;
        cartItems.forEach(item => {
            message += `• ${item.product_name} (${item.variant}) x${item.quantity}\n`;
        });
        if (cartItems.length > 0) {
            message += `\nRental Dates: ${formatDate(cartItems[0].start_date)} to ${formatDate(cartItems[0].end_date)}\n`;
        }
    }
    
    message += "\nPlease confirm receipt of this request.";
    return message;
};

/**
 * Generate WhatsApp deep-link URL for a request submission
 * @param {string} adminPhone - Admin WhatsApp phone number
 * @param {Object} customerData - Customer information
 * @param {Array} cartItems - Items in the request
 * @returns {string} WhatsApp deep-link URL
 */
export const generateWhatsAppRequestLink = (adminPhone, customerData, cartItems) => {
    const message = generateRequestSubmissionMessage(customerData, cartItems);
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Format date for message display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date (e.g., "May 07, 2026")
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
};

/**
 * Format date and time for message display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Check if phone number is in valid format
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid format
 */
export const isValidPhoneNumber = (phone) => {
    // Allow 10-15 digits, with optional leading +
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

/**
 * Normalize phone number (remove spaces, dashes, etc.)
 * @param {string} phone - Raw phone number
 * @returns {string} Normalized phone number
 */
export const normalizePhoneNumber = (phone) => {
    let normalized = phone.replace(/\s|-|\(/g, '').replace(/\)/g, '');
    // Remove leading +
    if (normalized.startsWith('+')) {
        normalized = normalized.substring(1);
    }
    return normalized;
};

export default {
    openWhatsAppDeepLink,
    generateRequestSubmissionMessage,
    generateWhatsAppRequestLink,
    formatDate,
    formatDateTime,
    isValidPhoneNumber,
    normalizePhoneNumber,
};
