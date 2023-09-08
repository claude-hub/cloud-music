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

  return (
    <Provider store={store}>
      <div>12e3</div>
      <button onClick={() => handleClick(0)}>播放</button>
      <Player ref={ref} />
    </Provider>
  )
}

export default MusicPlayer;