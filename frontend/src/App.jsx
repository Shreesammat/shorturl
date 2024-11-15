import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setInputUrl(e.target.value);
  };

  // Handle the send button click
  const handleSubmit = async () => {
    try {
      // Send a POST request to your backend with the URL
      const response = await fetch(`${import.meta.env.VITE_HOST}/shorten`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({inputUrl})
      })

      const data = await response.json()
      console.log(data)
      setShortenedUrl(data.shortUrl);
      
    } catch (error) {
      console.error('Error:', error);
      setShortenedUrl('Error creating shortened URL');
    }
  };
  
  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <input
        type="text"
        value={inputUrl}
        onChange={handleChange}
        placeholder="Enter a URL"
      />
      <button onClick={handleSubmit}>Send</button>

      {shortenedUrl && (
        <div className="result">
          <h2>Shortened URL:</h2>
          <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
            {shortenedUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
