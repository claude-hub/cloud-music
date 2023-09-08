import { useEffect, useRef } from "react";
import { useSetState } from 'ahooks';
import Test from '@cloud/music-player';
import { getArtists, getMusics } from "./api";
import { Artists } from './components';

console.log('====', Test);

const App = () => {
  const audioRef = useRef();
  const [store, setStore] = useSetState({});
  const { artists = [] } = store;

  useEffect(() => {
    init();
    const audio = audioRef.current;

    audio.addEventListener('error', (error) => {
      // 暂停啦...
      console.log('--', error)
      const { detail = {} } = error || {};
      if (detail.e) {
        audio.next();
      }
    });

    // 顺序播放和随机播放的处理
    audio.addEventListener('play', function () {
      console.log('=====')
      // 播放时的地址设置
      setSrc();
    });

  }, []);

  // 播放执行
  const play = (musics, index) => {
    let music = musics[index];
    if (!music) {
      return;
    }
    const { url, title } = music;
    audioRef.current.src = url;
    audioRef.current.label = title;
    // 自动播放。第一次刷新页面后，需要手动点击
    audioRef.current.play();

    setSrc(musics);
  };

  const init = async () => {
    const { data: artists } = await getArtists();
    // 获取第一个歌手的所有歌曲
    const musics = await getMusics(artists?.[0]?.name);
    setStore({
      artists,
      musics
    })
    play(musics, 0);
  }

  const setSrc = (dataList) => {
    const audio = audioRef.current;
    if (!audio) return;
    // 根据 src 获得 index
    let index = dataList.findIndex((obj) => {
      return obj.url === audio.src;
    });

    if (index < 0) {
      return;
    }

    // 标题
    audio.label = dataList[index].title;

    // 上一个，下一个
    let dataPrev = dataList[index - 1];
    let dataNext = dataList[index + 1];

    // 随机
    let arrIndexFilter = [];
    dataList.forEach((obj, i) => {
      if (i !== index) {
        arrIndexFilter.push(i);
      }
    });

    let indexRandNext = arrIndexFilter[Math.floor(Math.random() * arrIndexFilter.length)];

    // 再次随机
    let arrIndexFilter2 = [];
    dataList.forEach((obj, i) => {
      if (i !== index && i !== indexRandNext) {
        arrIndexFilter2.push(i);
      }
    });

    let indexRandprev = arrIndexFilter2[Math.floor(Math.random() * arrIndexFilter2.length)];

    // 开始设置地址
    // 下一个地址处理
    if (!audio.prevsrc) {
      // 如果是随机播放
      if (audio.loop === '1') {
        audio.prevsrc = dataList[indexRandprev].url;
      } else if (dataPrev) {
        audio.prevsrc = dataPrev.url;
      } else {
        audio.prevsrc = 'none';
      }
    }

    // 如果有地址，则不处理
    if (!audio.nextsrc) {
      // 如果是随机播放
      if (audio.loop === '1') {
        audio.nextsrc = dataList[indexRandNext].url;
      } else if (dataNext) {
        audio.nextsrc = dataNext.url;
      } else {
        audio.nextsrc = 'none';
      }
    }
  };


  const handleClickItem = async (name) => {
    // 获取第一个歌手的所有歌曲
    const musics = await getMusics(name);
    setStore({
      musics
    })
    play(musics, 0);
  }

  // console.log(audioRef.current?.loop)

  return (
    <div>
      <ui-audio
        rate="none"
        loop="0"
        ref={audioRef}
        mode="html5"
        controls
      // src="https://music.163.com/song/media/outer/url?id=29774171.mp3"
      ></ui-audio>
      <Artists artists={artists} onClickItem={handleClickItem} />
    </div>
  )
}

export default App;