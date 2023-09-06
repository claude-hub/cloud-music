import quotedPrintable from 'quoted-printable';
import utf8 from 'utf8';
import cheerio from 'cheerio';
import { proxy } from '../service';

/**
 * 搜索音乐，跳转的路由
 * @param str
 * @returns
 */
export const encodePrintableCode = (str: string) => {
  str = quotedPrintable.encode(utf8.encode(str));
  return `https://www.hifini.com/search-${str
    .replace(/ /g, '_20')
    .replace(/\s/g, '')
    .replace(/==/, '=')
    .replace(/=/g, '_')}-1.htm`;
};

export const parseHtmlAndGetData = (body: string) => {
  const parser = cheerio.load(body);
  const results = [...parser('.media-body .subject  a')]; //  -
  if (!results.length) {
    return null;
  }

  const resultStrArray = results
    .map((result) => {
      const { href } = result.attribs;
      return {
        link: href ? `https://www.hifini.com/${href}` : '',
        name: [...result.children]
          .reduce((prev, cur) => {
            if ('children' in cur) {
              return prev + (cur.children[0]?.data || '');
            }
            return prev + cur.data;
          }, '')
          .replace(/\./g, '')
          .replace('[FLAC/MP3-320K]', ''),
      };
    })
    .filter((item) => item.link);
  return resultStrArray;
};

/**
 * 解析音乐列表
 * @param body
 */
export const getMusicSrc = (body: string) => {
  const parser = cheerio.load(body);
  const scripts = [...parser('#player4 ~ script')];
  const script = scripts[scripts.length - 1];
  const src =
    script?.children?.[0].data
      ?.toString()
      ?.match(/(?<=url\:\s\')(.*)(?=\')/)?.[0] ?? '';
  const musicSrc = src.startsWith('get')
    ? `https://www.hifini.com/${src}`
    : src;
  return musicSrc;
};

export interface Music {
  name: string;
  link: string;
  src: string;
}

/**
 * 解析搜索页面，得到真实的音乐页面
 */
export const getMusicPageUrl = async (searchKey: string) => {
  try {
    const { data } = await proxy(encodePrintableCode(searchKey));
    // 搜索到的，所有的音乐列表
    const result = parseHtmlAndGetData(data);

    const musicSrc = (result || []).map(async (item) => {
      const { data: html } = await proxy(item.link);
      const src = getMusicSrc(html);
      return {
        ...item,
        src,
      };
    });

    const musics = await Promise.all(musicSrc);
    return musics.filter((item) => item.src);
  } catch (e) {
    console.log(e);
    return [];
  }
};
