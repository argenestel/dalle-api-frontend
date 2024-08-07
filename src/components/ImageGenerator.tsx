import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSettings, FiImage, FiUpload } from 'react-icons/fi';
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
  const [model, setModel] = useState<string>('dall-e-3');
  const [size, setSize] = useState<string>('1024x1024');

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
          model,
          prompt,
          n: 1,
          size
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Image Generator</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  Enter your prompt
                </label>
                <input
                  type="text"
                  id="prompt"
                  placeholder="Describe the image you want to generate"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="dall-e-2">DALL-E 2</option>
                    <option value="dall-e-3">DALL-E 3</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <select
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="256x256">256x256</option>
                    <option value="512x512">512x512</option>
                    <option value="1024x1024">1024x1024</option>
                    {model === 'dall-e-3' && <option value="1792x1024">1792x1024</option>}
                  </select>
                </div>
              </div>
              <button
                onClick={generateImage}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <FiImage className="mr-2" />
                )}
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>
          {imageUrl && (
            <div className="p-6 border-t border-gray-200">
              <img src={imageUrl} alt="Generated" className="w-full rounded-lg shadow-lg" />
              <button
                onClick={() => window.open(imageUrl, '_blank')}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiUpload className="mr-2" />
                Open Full Size
              </button>
            </div>
          )}
        </div>
        <History history={history} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Enter API Key</h2>
            <input
              type="text"
              placeholder="Your OpenAI API Key"
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
              onClick={() => handleApiKeyChange(apiKey)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiSettings className="mr-2" />
              Save API Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;