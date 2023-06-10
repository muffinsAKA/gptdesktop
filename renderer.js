window.addEventListener('DOMContentLoaded', () => {
  const gptReqUrl = "https://api.openai.com/v1/chat/completions";
  const inputBox = document.getElementById('prompt');
  const responseBox = document.getElementById('response');
  let gptKey;

  // Use the exposed `api` object to send and receive messages
  const { send, receive } = window.api;

  // Disable the input box until the API key is loaded
  inputBox.disabled = true;

  // Send message to main process to load the config
  send('loadConfig');

  // Receive the config file contents from the main process
  receive('configLoaded', (fileContents) => {
    // Do something with the file contents
    gptKey = fileContents;
    console.log("Config loaded:", gptKey);

    // Enable the input box now that the API key is loaded
    inputBox.disabled = false;
  });

  // Handle config file loading error
  receive('configError', (errorMessage) => {
    console.error("Config loading error:", errorMessage);
  });

  inputBox.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      const prompt = inputBox.value;
      inputBox.value = '';

      const data = {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        model: "gpt-3.5-turbo",
        temperature: 1,
        top_p: 1,
        stream: false
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gptKey}`,
      };

      const response = await fetch(gptReqUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      const message = result.choices[0].message;
      const content = message.content;

      responseBox.textContent = content;
    }
  });

  // Receive messages from the main process
  receive('process-message-response', (response) => {
    // Handle the response from the main process
    // ...
  });
});
