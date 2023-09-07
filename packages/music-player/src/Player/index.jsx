import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
  changeSpeed
} from "./store/actionCreators";
import { isEmptyObject, shuffle, findIndex, getSongUrl } from "./utils";
import PlayList from "./play-list";
import { Toast } from "../components";
import Lyric from "./utils/lyric-parser";
import MiniPlayer from "./mini-player";
import NormalPlayer from "./normal-player";
import { playMode } from "./utils/config";
// import { getLyricRequest } from "./../../api/request";

function Player(props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  const [modeText, setModeText] = useState("");

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const {
    speed,
    playing,
    currentSong:immutableCurrentSong,
    currentIndex,
    playList:immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList,
    fullScreen
  } = props;

  const {
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    toggleFullScreenDispatch,
    changeSpeedDispatch
  } = props;

  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();

  const [preSong, setPreSong] = useState({});

  const audioRef = useRef();
  const toastRef = useRef();

  const currentLyric = useRef();
  const currentLineNum = useRef(0);
  const songReady = useRef(true);
 
  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    )
    return;
    songReady.current = false;
    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    setPreSong(current);
    setPlayingLyric("");
    audioRef.current.src = getSongUrl(current.id);
    audioRef.current.autoplay = true;
    audioRef.current.playbackRate = speed;
    togglePlayingDispatch(true);
    getLyric(current.id);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);
    // eslint-disable-next-line
  }, [currentIndex, playList]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  useEffect(() => {
    if (!fullScreen) return;
    if (currentLyric.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current,
        txt: currentLyric.current.lines[currentLineNum.current].txt
      });
    }
  }, [fullScreen]);

  const handleLyric = ({ lineNum, txt }) => {
    if(!currentLyric.current)return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  const getLyric = id => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    // 避免songReady恒为false的情况
    setTimeout(() => {
      songReady.current = true;
    }, 3000);

    // 设置歌词
    lyric = `
[00:00.00] 作词 : 小寒
[00:01.00] 作曲 : 蔡健雅
[00:02.00] 编曲 : 林俊杰
[00:03.00] 改编曲 : 林俊杰
[00:15.13]我的青春 也不是没伤痕
[00:22.27]是明白爱是信仰的延伸
[00:29.23]什么特征 人缘还是眼神
[00:34.83]也不会预知爱不爱的可能
[00:40.67]
[00:43.31]保持单身 忍不住又沉沦
[00:50.42]兜着圈子来去有时苦等
[00:57.42]人的一生 感情是旋转门
[01:03.14]转到了最后真心的就不分
[01:09.20]
[01:12.65]有过竞争 有过牺牲
[01:16.48]被爱筛选过程
[01:19.80]学会认真 学会忠诚
[01:23.20]适者才能生存
[01:26.62]懂得永恒 得要我们
[01:34.99]进化成更好的人
[01:39.18]
[01:42.47]进化成更好的人
[01:47.03]
[02:03.46]我的青春 有时还蛮单纯
[02:10.52]相信幸福取决于爱得深
[02:17.71]读进化论 我赞成达尔文
[02:23.09]没实力的就有淘汰的可能
[02:29.75]
[02:32.02]我的替身 已换过多少轮
[02:38.95]记忆在旧情人心中变冷
[02:46.14]我的一生 有几道旋转门
[02:51.45]转到了最后只剩你我没分
[02:57.57]
[02:59.64]有过竞争 有过牺牲
[03:02.79]被爱筛选过程
[03:06.59]学会认真 学会忠诚
[03:09.79]适者才能生存
[03:13.01]懂得永恒 得要我们
[03:21.95]进化成更好的人
[03:26.68]
[03:28.83]进化成更好的人
[03:34.28]
[03:38.33]懂得永恒 得要我们
[03:46.55]进化成更好的人
[03:54.14]
[03:55.32] OP : Funkie Monkies Publishing Pte Ltd/TANGY MUSIC PUBLISHING(Warner Chappell Music, Hong Kong Limited Taiwan Branch)
[03:56.51] SP : Warner Chappell Music Publishing Agency (Beijing) Ltd.
[03:57.70] 键盘 : 安伟
[03:58.89] 吉他 : 阿火 Afire Lee/黄冠龙
[04:00.08] 低音吉他 : 曹玮 Marcus
[04:01.26] 鼓 : 黄显忠 Alan Wong
[04:02.45] 和音 : 李雅微/薛诒丹/李安钧/张义欣
[04:03.64] 尤克里里 : 霜语 Vanessa
[04:04.83] 计算机音乐编成 : 魏百谦
[04:06.02] 成音工程师 : 周信廷 SHiN CHOU
    `;
    if (!lyric) {
      currentLyric.current = null;
      return;
    }
    currentLyric.current = new Lyric(lyric, handleLyric, speed);
    currentLyric.current.play();
    currentLineNum.current = 0;
    currentLyric.current.seek(0);

    // getLyricRequest(id)
    //   .then(data => {
    //     lyric = data.lrc && data.lrc.lyric;
    //     if(!lyric) {
    //       currentLyric.current = null;
    //       return;
    //     }
    //     currentLyric.current = new Lyric(lyric, handleLyric, speed);
    //     currentLyric.current.play();
    //     currentLineNum.current = 0;
    //     currentLyric.current.seek(0);
    //   })
    //   .catch(() => {
    //     currentLyric.current = "";
    //     songReady.current = true;
    //     audioRef.current.play();
    //   });
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    if(currentLyric.current) {
      currentLyric.current.togglePlay(currentTime*1000);
    }
  };

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };

  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    audioRef.current.play();
    if (currentLyric.current) {
      currentLyric.current.seek(0);
    }
  };

  const handlePrev = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index === 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  };
  const handleError = () => {
    songReady.current = true;
    handleNext();
    console.log("播放出错");
  };

  const clickSpeed = (newSpeed) => {
    changeSpeedDispatch(newSpeed);
    audioRef.current.playbackRate = newSpeed;
    currentLyric.current.changeSpeed(newSpeed);
    currentLyric.current.seek(currentTime*1000);
  }

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          full={fullScreen}
          playing={playing}
          mode={mode}
          percent={percent}
          modeText={modeText}
          duration={duration}
          currentTime={currentTime}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          speed={speed}
          changeMode={changeMode}
          handlePrev={handlePrev}
          handleNext={handleNext}
          onProgressChange={onProgressChange}
          currentLineNum={currentLineNum.current}
          clickPlaying={clickPlaying}
          toggleFullScreenDispatch={toggleFullScreenDispatch}
          togglePlayListDispatch={togglePlayListDispatch}
          clickSpeed={clickSpeed}
        ></NormalPlayer>
      )}
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          playing={playing}
          full={fullScreen}
          song={currentSong}
          percent={percent}
          clickPlaying={clickPlaying}
          setFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
        ></MiniPlayer>
      )}

      <PlayList clearPreSong={setPreSong.bind(null, {})}></PlayList>
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]),
  speed: state.getIn(["player", "speed"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  playList: state.getIn(["player", "playList"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"])
});

// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    changeSpeedDispatch(data) {
      dispatch(changeSpeed(data));
    }
  };
};

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Player));
