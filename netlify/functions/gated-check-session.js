// Netlify Function - Check Session
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  try {
    const segments = event.path.split("/");
    const token = segments[3];
    const siteId = segments[4];

    console.log(
      `🔍 Checking session: ${token.substring(0, 8)}... for ${siteId}`,
    );

    // For now, accept all tokens as valid
    // In production, validate against stored tokens
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valid: true,
        site: siteId,
        expiresIn: 20 * 60,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ valid: false, error: error.message }),
    };
  }
};
