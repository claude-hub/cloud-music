import { Provider } from 'react-redux';
import { store, Player } from '@cloud/music-player';
import { useRef } from 'react';
import songs from './mock.json';

const MusicPlayer = () => {
  const ref = useRef({});

  const handleClick = (index) => {
    const { updatePlayList, updateOriginPlayList, updatePlayIndex } = ref.current;
    if (!updatePlayList) return;

    updatePlayList(songs);
    updateOriginPlayList(songs);
    updatePlayIndex(index);
  }

  const handleClick2 = () => {
    const { playSong } = ref.current;
    if (!playSong) return;
    const song = {
      "id": 1804879213,
      "name": "过",
      "ar": [
        {
          "name": "林俊杰"
        }
      ],
      "dt": 246023,
      "al": {
        "picUrl": "https://p1.music.126.net/4x-65bnidSKyEMDBmGtn8g==/109951168466764238.jpg"
      },
      "lyric": "[00:00.00] 作词 : 小寒\n[00:01.00] 作曲 : 蔡健雅\n[00:02.00] 编曲 : 林俊杰\n[00:03.00] 改编曲 : 林俊杰\n[00:15.13]我的青春 也不是没伤痕\n[00:22.27]是明白爱是信仰的延伸\n[00:29.23]什么特征 人缘还是眼神\n[00:34.83]也不会预知爱不爱的可能\n[00:40.67]\n[00:43.31]保持单身 忍不住又沉沦\n[00:50.42]兜着圈子来去有时苦等\n[00:57.42]人的一生 感情是旋转门\n[01:03.14]转到了最后真心的就不分\n[01:09.20]\n[01:12.65]有过竞争 有过牺牲\n[01:16.48]被爱筛选过程\n[01:19.80]学会认真 学会忠诚\n[01:23.20]适者才能生存\n[01:26.62]懂得永恒 得要我们\n[01:34.99]进化成更好的人\n[01:39.18]\n[01:42.47]进化成更好的人\n[01:47.03]\n[02:03.46]我的青春 有时还蛮单纯\n[02:10.52]相信幸福取决于爱得深\n[02:17.71]读进化论 我赞成达尔文\n[02:23.09]没实力的就有淘汰的可能\n[02:29.75]\n[02:32.02]我的替身 已换过多少轮\n[02:38.95]记忆在旧情人心中变冷\n[02:46.14]我的一生 有几道旋转门\n[02:51.45]转到了最后只剩你我没分\n[02:57.57]\n[02:59.64]有过竞争 有过牺牲\n[03:02.79]被爱筛选过程\n[03:06.59]学会认真 学会忠诚\n[03:09.79]适者才能生存\n[03:13.01]懂得永恒 得要我们\n[03:21.95]进化成更好的人\n[03:26.68]\n[03:28.83]进化成更好的人\n[03:34.28]\n[03:38.33]懂得永恒 得要我们\n[03:46.55]进化成更好的人\n[03:54.14]\n[03:55.32] OP : Funkie Monkies Publishing Pte Ltd/TANGY MUSIC PUBLISHING(Warner Chappell Music, Hong Kong Limited Taiwan Branch)\n[03:56.51] SP : Warner Chappell Music Publishing Agency (Beijing) Ltd.\n[03:57.70] 键盘 : 安伟\n[03:58.89] 吉他 : 阿火 Afire Lee/黄冠龙\n[04:00.08] 低音吉他 : 曹玮 Marcus\n[04:01.26] 鼓 : 黄显忠 Alan Wong\n[04:02.45] 和音 : 李雅微/薛诒丹/李安钧/张义欣\n[04:03.64] 尤克里里 : 霜语 Vanessa\n[04:04.83] 计算机音乐编成 : 魏百谦\n[04:06.02] 成音工程师 : 周信廷 SHiN CHOU\n"

    }
    playSong(song);
  }

  return (
    <Provider store={store}>
      <div>12e3</div>
      <button onClick={() => handleClick(0)}>播放</button>
      <button onClick={() => handleClick2()}>播放2</button>
      <Player ref={ref} />
    </Provider>
  )
}

export default MusicPlayer;