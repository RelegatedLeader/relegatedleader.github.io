let geoip = null;
try {
  geoip = require('geoip-lite');
} catch (err) {
  console.log('⚠️ geoip-lite not available - location lookups disabled');
}
const axios = require('axios');

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function getLocationFromIP(ip) {
  if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
    return { city: 'Local/Test', country: 'Local', latitude: null, longitude: null };
  }
  
  if (!geoip) {
    return { city: 'Unknown', country: 'Unknown', latitude: null, longitude: null };
  }
  
  const geo = geoip.lookup(ip);
  return {
    city: geo?.city || 'Unknown',
    country: geo?.country || 'Unknown',
    latitude: geo?.ll?.[0] || null,
    longitude: geo?.ll?.[1] || null,
    timezone: geo?.timezone || 'Unknown'
  };
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isCodeExpired(createdAt, expiryMinutes) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMinutes = (now - created) / (1000 * 60);
  return diffMinutes > expiryMinutes;
}

function isSessionExpired(createdAt, sessionMinutes) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMinutes = (now - created) / (1000 * 60);
  return diffMinutes > sessionMinutes;
}

module.exports = {
  getClientIP,
  getLocationFromIP,
  generateVerificationCode,
  isCodeExpired,
  isSessionExpired
};
