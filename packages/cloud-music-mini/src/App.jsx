import { useEffect, useRef } from "react";
import { Provider } from 'react-redux';
import { useSetState } from 'ahooks';
import { Player, store } from '@cloud/music-player';
import { getArtists, getMusics } from "./api";
import { Artists } from './components';

const App = () => {
  const playerRef = useRef();
  const [state, setState] = useSetState({});
  const { artists = [] } = state;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: artists } = await getArtists();
    setState({
      artists
    })
  }

  const playList = (musics) => {
    const { updatePlayList, updateOriginPlayList, updatePlayIndex } = playerRef.current;
    if (!updatePlayList) return;

    updatePlayList(musics);
    updateOriginPlayList(musics);
    updatePlayIndex(0);
  }

  const handleClickItem = async (name) => {
    // 获取歌手的所有歌曲
    const { data: musics } = await getMusics(name);
    setState({ musics })
    playList(musics);

  }

  return (
    <Provider store={store}>
      <Artists artists={artists} onClickItem={handleClickItem} />
      <Player ref={playerRef} />
    </Provider>
  )
}

export default App;