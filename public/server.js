app.post('/share', async (req, res) => {
  const { accessToken, shareUrl, shareCount } = req.body;
  const timeInterval = 1000;
  let sharedCount = 0;
  let errorOccurred = false;

  const results = [];

  const interval = setInterval(async () => {
    if (sharedCount >= shareCount || errorOccurred) {
      clearInterval(interval);

      // Send response only once
      return res.json({
        message: `Finished: ${sharedCount} out of ${shareCount} shares`,
        results,
      });
    }

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v20.0/me/feed?access_token=${accessToken}`,
        {
          link: shareUrl,
          privacy: { value: 'SELF' },
          no_story: true,
          published: false
        },
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          }
        }
      );

      sharedCount++;
      results.push({ success: true, id: response.data.id });
      console.log(`Shared #${sharedCount}: ${response.data.id}`);
    } catch (error) {
      errorOccurred = true;
      results.push({ success: false, error: error?.response?.data || error.message });
      console.error('Error sharing:', error?.response?.data || error.message);
    }
  }, timeInterval);
});
