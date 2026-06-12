const fetch = require('node-fetch');

async function testJSearch() {
  const url = 'https://jsearch.p.rapidapi.com/search?query=software%20engineer%20internship%20OR%20junior%20developer&page=1&num_pages=1';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'REDACTED_RAPIDAPI_KEY',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Opportunities Retrieved:", data.data ? data.data.length : 0);
  } catch (err) {
    console.error("Error:", err);
  }
}

testJSearch();
