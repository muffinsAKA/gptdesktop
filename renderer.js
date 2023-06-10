window.addEventListener('DOMContentLoaded', () => {

    const gptKey = 'KEY_HERE';
    const gptReqUrl = "https://api.openai.com/v1/chat/completions";

    const inputBox = document.getElementById('prompt');
    const responseBox = document.getElementById('response');
  
    // Use the exposed `api` object to send and receive messages
    const { send, receive } = window.api;
  
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
  