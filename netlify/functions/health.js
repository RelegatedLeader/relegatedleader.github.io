// Netlify Function - Health Check
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      status: "✅ Server running",
      timestamp: new Date().toISOString(),
    }),
  };
};
