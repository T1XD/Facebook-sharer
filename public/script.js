document.getElementById('shareForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const accessToken = document.getElementById('accessToken').value;
  const shareUrl = document.getElementById('postUrl').value;
  const shareCount = parseInt(document.getElementById('shareCount').value);
  const output = document.getElementById('output');

  output.textContent = 'Starting sharing...';

  try {
    const response = await fetch('/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken, shareUrl, shareCount }),
    });

    const result = await response.json();
    output.textContent = JSON.stringify(result, null, 2);
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
  }
});
