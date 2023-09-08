import axios from 'axios';

const baseUrl =
  'https://cdn.jsdelivr.net/gh/claude-hub/node@main/packages/music/musics/artists';

export const getArtists = async () => {
  return await axios(`${baseUrl}/index.json`);
};

export const getMusics = async (name) => {
  if (!name) return;
  return await axios(`${baseUrl}/${name}.json`);
};
