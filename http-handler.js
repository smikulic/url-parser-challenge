/**
 * HTTP request handler with rate limiting and retry logic
 *
 * Flow:
 * 1. Rate limiting: Ensure minimum 1 second between requests
 * 2. URL normalization: Add http:// if no protocol specified
 * 3. Make HTTP GET request using fetch()
 * 4. On failure: Wait 60 seconds, then retry once
 * 5. Return HTML content or null if both attempts fail
 *
 * Rate limiting is global across all requests to respect server limits
 */

let lastRequestTime = 0; // Global timestamp to enforce rate limiting

/**
 * Fetches URL content with rate limiting and retry logic
 *
 * @param {string} url - URL to fetch (can be with or without protocol)
 * @returns {string|null} HTML content or null if request failed
 */
async function fetchUrl(url) {
  // ensure at least 1 second between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  // if less than 1 second has passed since last request, we need to wait
  // example: if 400ms passed, we wait 600ms more to reach 1 second
  const waitTime = Math.max(0, 1000 - timeSinceLastRequest);

  if (waitTime > 0) {
    // wait before making the request
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();

  // add http:// if no protocol specified
  const fullUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `http://${url}`;

  try {
    const response = await fetch(fullUrl);

    if (!response.ok) {
      console.error(`First request failed for ${url}: HTTP ${response.status}`);
      console.error(`Waiting 1 minute before retry...`);
      await new Promise((resolve) => setTimeout(resolve, 60000));

      // rate limiting for the retry requests
      const retryNow = Date.now();
      const retryTimeSinceLastRequest = retryNow - lastRequestTime;
      const retryWaitTime = Math.max(0, 1000 - retryTimeSinceLastRequest);

      if (retryWaitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryWaitTime));
      }

      lastRequestTime = Date.now();

      // try only once
      console.error(`Retrying ${url}...`);
      const retryResponse = await fetch(fullUrl);

      if (!retryResponse.ok) {
        // both attempts failed
        console.error(`Retry failed for ${url}: HTTP ${retryResponse.status}`);
        return null;
      }

      return await retryResponse.text();
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);

    // wait 1 minute and retry for network errors
    console.error(`Waiting 1 minute before retry...`);
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // rate limiting for the retry requests
    const retryNow = Date.now();
    const retryTimeSinceLastRequest = retryNow - lastRequestTime;
    const retryWaitTime = Math.max(0, 1000 - retryTimeSinceLastRequest);

    if (retryWaitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryWaitTime));
    }

    lastRequestTime = Date.now();

    try {
      console.error(`Retrying ${url}...`);
      const retryResponse = await fetch(fullUrl);

      if (!retryResponse.ok) {
        console.error(`Retry failed for ${url}: HTTP ${retryResponse.status}`);
        return null;
      }

      return await retryResponse.text();
    } catch (retryError) {
      // both attempts failed
      console.error(`Retry failed for ${url}: ${retryError.message}`);
      return null;
    }
  }
}

module.exports = { fetchUrl };
