// Netlify Function - Verify Code
const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { code, contactMethod, contact, siteId } = body;

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid code format' })
      };
    }

    // Generate access token
    const accessToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (20 * 60 * 1000); // 20 minutes

    console.log(`✅ Access granted: ${contact} (${contactMethod}) for ${siteId}`);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Access verified!',
        accessToken: accessToken,
        expiresAt: expiresAt,
        expiresIn: 20 * 60,
        visitor: {
          contact: contact,
          contactMethod: contactMethod,
          site: siteId,
          accessTime: new Date().toISOString()
        }
      })
    };
  } catch (error) {
    console.error('Verify error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
