async function fetchUrl(url) {
  // add http:// if no protocol specified
  const fullUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `http://${url}`;

  try {
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    console.log(response.status);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return null;
  }
}

module.exports = { fetchUrl };
