const crypto = require("crypto");

function hashEmail(email) {
  const secret = process.env.IM_SECRET || "";

  if (!secret) {
    console.error("Warning: IM_SECRET environment variable not set");
  }

  // Create SHA-256 hash of email + secret
  const hash = crypto
    .createHash("sha256")
    .update(email + secret)
    .digest("hex");

  return hash;
}

module.exports = { hashEmail };
