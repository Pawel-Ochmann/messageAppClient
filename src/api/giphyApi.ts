import axios from 'axios';

const GiphyAPIKey = 'yj95txvwzdxGDuFA4J2CeomczmxZRQ1D&s';

export const fetchRandomGifs = async () => {
  try {
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GiphyAPIKey}&limit=10`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching random gifs:', error);
    throw error;
  }
};

export const searchGifs = async (query: string) => {
  try {
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${GiphyAPIKey}&q=${query}&limit=10`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching gifs:', error);
    throw error;
  }
};
