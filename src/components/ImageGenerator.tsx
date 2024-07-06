import React, { useState, useEffect } from 'react';
import axios from 'axios';
import History from "./History";

const ImageGenerator: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>(localStorage.getItem('openai_api_key') || '');
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<string[]>(() => {
      const savedHistory = localStorage.getItem('image_generation_history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [showModal, setShowModal] = useState<boolean>(false);
  
    useEffect(() => {
      localStorage.setItem('openai_api_key', apiKey);
    }, [apiKey]);
  
    useEffect(() => {
      localStorage.setItem('image_generation_history', JSON.stringify(history));
    }, [history]);
  
    useEffect(() => {
      if (!apiKey) {
        setShowModal(true);
      }
    }, []);
  
    const generateImage = async () => {
      if (!apiKey) {
        setShowModal(true);
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            model: "dall-e-3",
            prompt,
            n: 1,
            size: '1024x1024'
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );
        const url = response.data.data[0].url;
        setImageUrl(url);
        setHistory(prev => [url, ...prev]);
      } catch (error) {
        console.error('Error generating image:', error);
        alert('Error generating image. Please check your API key and prompt.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleApiKeyChange = (newApiKey: string) => {
      setApiKey(newApiKey);
      setShowModal(false);
    };
  
    return (
      <div className="flex flex-col items-center mt-10 p-6 bg-white rounded-xl shadow-xl max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4 p-3 border border-primary-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-secondary-50"
        />
        <button
          onClick={generateImage}
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        {imageUrl && <img src={imageUrl} alt="Generated" className="mt-6 rounded-lg shadow-lg max-w-full h-auto" />}
        <History history={history} />
  
        {showModal && (
          <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-secondary-800">Enter API Key</h2>
              <input
                type="text"
                placeholder="Your OpenAI API Key"
                className="w-full p-2 border border-secondary-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                onClick={() => handleApiKeyChange(apiKey)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Save API Key
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ImageGenerator;