import quotedPrintable from 'quoted-printable';
import utf8 from 'utf8';
import cheerio from 'cheerio';
import axios from 'axios';

// uniCould 中的云函数 url 化
const baseURL =
  'https://fc-mp-da56e6a4-4019-4b03-8f65-8e4e9fe0fa01.next.bspapp.com';

const proxy = async (url) => {
  return await axios(`${baseURL}/api/proxy`, {
    method: 'POST',
    data: {
      url,
      dataType: 'text',
    },
  });
};

/**
 * 搜索音乐，跳转的路由
 * @param str
 * @returns
 */
const encodePrintableCode = (str) => {
  str = quotedPrintable.encode(utf8.encode(str));
  return `https://www.hifini.com/search-${str
    .replace(/ /g, '_20')
    .replace(/\s/g, '')
    .replace(/==/, '=')
    .replace(/=/g, '_')}-1.htm`;
};

const parseHtmlAndGetData = (body, singerName) => {
  const parser = cheerio.load(body);
  const results = [...parser('.media-body .subject  a')]; //  -
  if (!results.length) {
    return null;
  }
  const resultStrArray = results.map((result) => {
    return {
      link: result.attribs.href ?? '',
      hrefName: [...result.children]
        .reduce((prev, cur) => {
          if ('children' in cur) {
            return prev + cur.children[0].data;
          }
          return prev + cur.data;
        }, '')
        .replace(/\./g, ''),
    };
  });
  singerName = singerName.toLocaleLowerCase().replace(/\./g, '');
  const targetMusic = resultStrArray.find((item) =>
    item.hrefName.toLocaleLowerCase().includes(singerName)
  );

  if (targetMusic) {
    return `https://www.hifini.com/${targetMusic.link}`;
  } else {
    // 选择第一个
    if (resultStrArray.length) {
      return `https://www.hifini.com/${resultStrArray[0].link}`;
    }
    return null;
  }
};

/**
 * 解析音乐列表
 * @param body
 */
const getMusicSrc = (body) => {
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

/**
 * 解析搜索页面，得到真实的 music url
 */
export const searchMusic = async (searchKey) => {
  try {
    const query = searchKey.replace(/\//g, '');
    const { data } = await proxy(encodePrintableCode(query));
    const url = parseHtmlAndGetData(data, query);
    if (!url) return;

    const { data: html } = await proxy(url);
    const src = getMusicSrc(html);
    return src;
  } catch (e) {
    console.log(e);
    return [];
  }
};
