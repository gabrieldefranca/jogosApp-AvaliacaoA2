import axios from 'axios';

const API_KEY = '8fd144dc76fd42d1b93ee12a3173dc78';
const API_URL = 'https://api.rawg.io/api';

export async function fetchGames(search = '') {
  const response = await axios.get(`${API_URL}/games`, {
    params: {
      key: API_KEY,
      search,
      page_size: 15,
    },
  });
  return response.data.results;
}

export async function fetchGameDetails(id) {
  const response = await axios.get(`${API_URL}/games/${id}`, {
    params: { key: API_KEY },
  });
  return response.data;
}