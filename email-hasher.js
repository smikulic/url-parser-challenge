const crypto = require("crypto");

/**
 * Email hashing utility for privacy protection
 *
 * Flow:
 * 1. Get IM_SECRET from environment variables
 * 2. Concatenate email + secret for salt-like behavior
 * 3. Generate SHA-256 hash of the combined string
 * 4. Return hex-encoded hash string
 *
 * Uses IM_SECRET as a salt to prevent rainbow table attacks
 * and ensure different hashes across different deployments
 */

/**
 * Hashes an email address using SHA-256 with secret salt
 *
 * @param {string} email - Email address to hash
 * @returns {string} SHA-256 hash in hexadecimal format
 */
function hashEmail(email) {
  const secret = process.env.IM_SECRET || "";

  if (!secret) {
    console.error("Warning: IM_SECRET environment variable not set");
  }

  // Create SHA-256 hash of email + secret (acts as salt)
  const hash = crypto
    .createHash("sha256")
    .update(email + secret) // Concatenate for salt-like behavior
    .digest("hex"); // Return as hexadecimal string

  return hash;
}

module.exports = { hashEmail };
