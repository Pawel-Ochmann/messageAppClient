import { useEffect, useState, useContext } from 'react';
import { Gif } from '../../types';
import styles from './gifs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../Context';
import { fetchRandomGifs, searchGifs } from '../../api/giphyApi';
import classNames from 'classnames';

interface Props {
  sendGif: React.MouseEventHandler<HTMLImageElement>;
  isOpen: boolean;
}

export default function Gifs({ sendGif, isOpen }: Props) {
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState('');
  const { darkTheme } = useContext(UserContext);

  useEffect(() => {
    const fetchRandom = async () => {
      const randomGifs = await fetchRandomGifs();
      setGifs(randomGifs);
    };

    fetchRandom();
  }, []);

  const handleSearch = async () => {
    const searchedGifs = await searchGifs(query);
    setGifs(searchedGifs);
  };

  const classes = {
    gifContainer: classNames(styles.gifContainer, {
      [styles.open]: isOpen,
      [styles.dark]: darkTheme,
    }),
    searchContainer: classNames(styles.searchContainer, {
      [styles.dark]: darkTheme,
    }),
    gifGrid: styles.gifGrid,
  };

  return (
    <div
      className={classes.gifContainer}
    >
      <div className={classes.searchContainer}>
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
