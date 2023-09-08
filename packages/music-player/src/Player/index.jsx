import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { connect } from "react-redux";
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
  changeSpeed,
  changeSequecePlayList,
  insertSong
} from "./store/actionCreators";
import { isEmptyObject, shuffle, findIndex, getSongUrl, getName } from "./utils";
import PlayList from "./play-list";
import { Toast } from "../components";
import Lyric from "./utils/lyric-parser";
import MiniPlayer from "./mini-player";
import NormalPlayer from "./normal-player";
import { playMode } from "./utils/config";
import { GlobalStyle } from "./style";
import { IconStyle } from "../assets/iconfont/iconfont";
import { searchMusic } from './utils/musicParse';

function Player(props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  const [modeText, setModeText] = useState("");
  const errorCount = useRef(0);

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const {
    speed,
    playing,
    currentSong: immutableCurrentSong,
    currentIndex,
    playList: immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList,
    fullScreen,
    refInstance
  } = props;

  const {
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    toggleFullScreenDispatch,
    changeSpeedDispatch,
    changeSequecePlayListDispatch,
    insertSongDispatch
  } = props;

  useImperativeHandle(refInstance, () => ({
    // 更新当前播放的歌曲
    updateCurrentSone: changeCurrentDispatch,
    // 更新当前的播放列表（随机、顺序、单曲）
    updatePlayList: changePlayListDispatch,
    // 更新初始播放列表（源数据）
    updateOriginPlayList: changeSequecePlayListDispatch,
    // 更新当前播放的index。
    updatePlayIndex: changeCurrentIndexDispatch,
    // 立即播放
    playSong: insertSongDispatch,
  }))

  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();

  const [preSong, setPreSong] = useState({});

  const audioRef = useRef();
  const toastRef = useRef();

  const currentLyric = useRef();
  const currentLineNum = useRef(0);

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id
    )
      return;
    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    setPreSong(current);
    setPlayingLyric("");
    audioRef.current.src = getSongUrl(current.id);
    audioRef.current.autoplay = true;
    audioRef.current.playbackRate = speed;
    togglePlayingDispatch(true);
    getLyric(current.lyric);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);
  }, [currentIndex, immutablePlayList]);

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
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  // 设置歌词
  const getLyric = lyric => {
    if (currentLyric.current) {
      currentLyric.current.stop();
    }

    if (!lyric) {
      currentLyric.current = null;
      return;
    }
    currentLyric.current = new Lyric(lyric, handleLyric, speed);
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000);
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
  const handleError = async () => {
    const { urls = [], name, ar} = currentSong;
    const currentUrl = errorCount.current;
    if (urls.length > currentUrl) {
      audioRef.current.src = urls[currentUrl];
      currentLineNum.current = 0;
      errorCount.current += 1;
      return;
    } 
    // 都播放失败后，实时获取音乐
    const url = await searchMusic(`${getName(ar)}${name}`);
    if (url) {
      audioRef.current.src = url;
      return
    }

    // 所有源都播放失败，则播放下一首
    errorCount.current = 0;
    console.log("播放出错");
    handleNext();
  };

  const clickSpeed = (newSpeed) => {
    changeSpeedDispatch(newSpeed);
    audioRef.current.playbackRate = newSpeed;
    currentLyric.current.changeSpeed(newSpeed);
    currentLyric.current.seek(currentTime * 1000);
  }

  const handleLoadingSuccess = () => {
  // 加载成功后，重置错误的次数
    errorCount.current = 0;
    // 初始歌词
    currentLyric.current.play();
    currentLineNum.current = 0;
    currentLyric.current.seek(0);
  }

  return (
    <div>
      <GlobalStyle />
      <IconStyle />
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
        onLoadedData={handleLoadingSuccess}
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
    },
    changeSequecePlayListDispatch(data) {
      dispatch(changeSequecePlayList(data))
    },
    insertSongDispatch(data) {
      dispatch(insertSong(data))
    }
  };
};

// 将ui组件包装成容器组件
const MusicPlayer = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Player));


export default forwardRef((props, ref) => <MusicPlayer {...props} refInstance={ref} />)
