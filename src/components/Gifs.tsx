import { MouseEventHandler, useEffect, useState } from 'react';
import axios from 'axios';
import { SendMessageHandler, Gif } from '../types/index';

const GiphyAPIKey = 'yj95txvwzdxGDuFA4J2CeomczmxZRQ1D&s';

export default function Gifs({
  sendMessage,
}: {
  sendMessage: SendMessageHandler;
}) {
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchRandomGifs = async () => {
      try {
        const response = await axios.get(
          `https://api.giphy.com/v1/gifs/trending?api_key=${GiphyAPIKey}&limit=10`
        );
        setGifs(response.data.data);
      } catch (error) {
        console.error('Error fetching random gifs:', error);
      }
    };

    fetchRandomGifs();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?api_key=${GiphyAPIKey}&q=${query}&limit=10`
      );
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching gifs:', error);
    }
  };

const sendGif: React.MouseEventHandler<HTMLImageElement> = (e) => {
  const img = e.target as HTMLImageElement;
  const address = img.src;
  sendMessage({ type: 'gif', content: address });
};


  return (
    <>
      {' '}
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Enter search query'
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {gifs.length > 0 &&
          gifs.map((gif: Gif) => (
            <img
              onClick={sendGif}
              key={gif.id}
              src={gif.images.original.url}
              alt='GIF'
              style={{ maxWidth: '200px' }}
            />
          ))}
      </div>
    </>
  );
}
