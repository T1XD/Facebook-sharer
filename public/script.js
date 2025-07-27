try {
  const response = await fetch('/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken, shareUrl, shareCount }),
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : {};
  output.textContent = JSON.stringify(result, null, 2);
} catch (err) {
  output.textContent = `Error: ${err.message}`;
}
