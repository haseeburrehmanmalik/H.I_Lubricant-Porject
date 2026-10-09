
// ====== EMAILJS CONFIGURATION ======
// Ye values aapko EmailJS dashboard se lena hain:

const EMAILJS_CONFIG = {
    // 🔴 PUBLIC KEY – Account → API Keys se copy karein, user_ se start hoti hai
    publicKey: 'eAo0EosFV5whnC1H0',   // e.g., 'user_abc123xyz'
    
    // 🔴 SERVICE ID – Email Services se copy karein
    serviceID: 'service_hilubricant-001',              // aapka service id
    
    // 🔴 TEMPLATE ID – Email Templates se copy karein
    templateID: 'template_ttry228'                     // aapka template id
};

// ====== EMAILJS INITIALIZATION ======
// Check karein ke emailjs library load hui ya nahi
if (typeof emailjs !== 'undefined' && emailjs.init) {
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS initialized successfully with public key:', EMAILJS_CONFIG.publicKey);
    } catch (err) {
        console.error('❌ EmailJS initialization failed:', err);
    }
} else {
    console.warn('⚠️ EmailJS library not loaded. Check your internet connection or CDN link.');
}

// ====== SEND ORDER EMAIL ======
function sendOrderEmail(orderData) {
    // Agar EmailJS available nahi hai toh fallback
    if (typeof emailjs === 'undefined' || !emailjs.send) {
        console.warn('⚠️ EmailJS not available. Order data:', orderData);
        // Demo mode mein alert dikhao
        alert('Demo mode: Order submitted. Check console for details.');
        return Promise.resolve({ status: 200, text: 'Demo mode' });
    }

    // Template parameters – ye aapke template ke variables ke exact naam hone chahiye
    const templateParams = {
        // 🔴 IMPORTANT: 'to_email' woh email hai jis par order aana chahiye
        to_email: 'hasseburrahmanmalik@gmail.com',    // is email par aayega order
        from_name: orderData.name,
        from_email: orderData.email,
        phone: orderData.phone,
        product: orderData.productName,
        quantity: orderData.quantity,
        address: orderData.address,
        city: orderData.city || 'N/A',
        notes: orderData.notes || 'None',
        order_id: orderData.orderId,
        order_date: orderData.date
    };

    console.log('📧 Sending email with params:', templateParams);

    return emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams
    ).then(response => {
        console.log('✅ Email sent successfully!', response);
        return response;
    }).catch(err => {
        console.error('❌ Email send failed:', err);
        throw err;
    });
}

// ====== SEND CONTACT EMAIL ======
function sendContactEmail(contactData) {
    if (typeof emailjs === 'undefined' || !emailjs.send) {
        console.warn('⚠️ EmailJS not available. Contact data:', contactData);
        alert('Demo mode: Message sent. Check console for details.');
        return Promise.resolve({ status: 200, text: 'Demo mode' });
    }

    const templateParams = {
        to_email: 'hasseburrahmanmalik@gmail.com',
        from_name: contactData.name,
        from_email: contactData.email,
        phone: contactData.phone || 'N/A',
        subject: contactData.subject || 'Contact Form',
        message: contactData.message
    };

    console.log('📧 Sending contact email with params:', templateParams);

    return emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams
    ).then(response => {
        console.log('✅ Contact email sent!', response);
        return response;
    }).catch(err => {
        console.error('❌ Contact email failed:', err);
        throw err;
    });
}

// ====== GLOBALLY EXPOSE FUNCTIONS ======
window.sendOrderEmail = sendOrderEmail;
window.sendContactEmail = sendContactEmail;