import axios from 'axios';

// uniCould 中的云函数 url 化
const baseURL =
  'https://fc-mp-da56e6a4-4019-4b03-8f65-8e4e9fe0fa01.next.bspapp.com';

const musicURL = 'https://cdn.jsdelivr.net/gh/claude-hub/node@main/packages/music/musics'

export const proxy = async (url: string) => {
  return await axios(`${baseURL}/api/proxy`, {
    method: 'POST',
    data: {
      url,
      dataType: 'text',
    },
  });
};

/**
 * 获取歌手的全部歌曲
 * @param name 
 * @returns 
 */
export const getSongs = (name: string) => {
  return axios(`${musicURL}/${name}.json`)
}

export const request = async (params: Record<string, any>) => {
  const { url, others } = params;
  return await axios(`${baseURL}/api/proxy`, {
    method: 'POST',
    data: {
      url,
      dataType: 'json',
      ...others,
    },
  });
};
