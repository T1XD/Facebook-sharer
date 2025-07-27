const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/share', async (req, res) => {
  const { accessToken, shareUrl, shareCount } = req.body;
  const timeInterval = 500;
  let sharedCount = 0;

  const interval = setInterval(async () => {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v20.0/me/feed?access_token=${accessToken}&fields=id&published=0`,
        {
          link: shareUrl,
          privacy: { value: 'SELF' },
          no_story: true,
        },
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          }
        }
      );

      sharedCount++;
      console.log(`Shared #${sharedCount}: ${response.data.id}`);

      if (sharedCount >= shareCount) {
        clearInterval(interval);
        res.json({ message: `Shared ${sharedCount} times.` });
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
      clearInterval(interval);
      res.status(500).json({ error: 'Error sharing post' });
    }
  }, timeInterval);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
