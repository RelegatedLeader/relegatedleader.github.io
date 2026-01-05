const crypto = require("crypto");

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-secret-key-min-32-characters";
const ALGORITHM = "aes-256-cbc";

// Ensure key is 32 bytes
const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(parts[1], "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };
