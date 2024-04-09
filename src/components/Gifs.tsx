import {  useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Gif } from '../types';
import styles from './styles/giphs.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../Context';

const GiphyAPIKey = 'yj95txvwzdxGDuFA4J2CeomczmxZRQ1D&s';

export default function Gifs({
  sendGif,
  isOpen
}: {
  sendGif: React.MouseEventHandler<HTMLImageElement>;
  isOpen:boolean
}) {
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState('');
  const { darkTheme } = useContext(UserContext);

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


  return (
    <div className={`${styles.giphsContainer} ${isOpen && styles.open} ${darkTheme && styles.dark}`}>
      <div className={`${styles.searchContainer} ${darkTheme && styles.dark}`}>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Find gifs'
        />
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
        </button>
      </div>
      <div className={styles.gifGrid}>
        {gifs.length > 0 &&
          gifs.map((gif: Gif) => (
            <img
              onClick={sendGif}
              key={gif.id}
              src={gif.images.original.url}
              alt='GIF'
            />
          ))}
      </div>
    </div>
  );
}
