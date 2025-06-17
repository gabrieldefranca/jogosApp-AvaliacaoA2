import axios from 'axios';

const API_KEY = '8fd144dc76fd42d1b93ee12a3173dc78'; 
const API = axios.create({
  baseURL: 'https://api.rawg.io/api',
});

// Buscar lista de jogos
export const fetchGames = async (query) => {
  const response = await API.get(`/games?search=${query}&key=${API_KEY}`);
  return response.data.results;
};

// Buscar detalhes de um jogo específico
export const fetchGameDetails = async (id) => {
  const response = await API.get(`/games/${id}?key=${API_KEY}`);
  return response.data;
};
