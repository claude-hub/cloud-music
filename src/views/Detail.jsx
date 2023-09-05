import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Howl } from 'howler';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

function MyComponent() {
  const { load } = useGlobalAudioPlayer();

  // ... later in a callback, effect, etc.
  load('/mySound.wav', {
    autoplay: true
  });
}
import '../components/Player';
import { getSongs } from '../service';

const musicSrc = 'https://music.163.com/song/media/outer/url?id=65536.mp3';

const Detail = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const { load, play, error } = useGlobalAudioPlayer();
  console.log(error, typeof error)

  const { name } = useParams();
  const audioRef = useRef();

  // useEffect(() => {
  //   console.log(audio)
  // }, [])

  const playMusic = (src) => {
    // const sound = new Howl({
    //   src: [src],
    //   html5: true,
    //   preload: true,
    //   format: ['mp3', 'flac'],
    //   onend: () => {
    //     console.log('--end--')
    //   },
    //   on: ('playerror', (a, errCode) => {
    //       console.log('error', a , errCode)
    //   })
    // });
    // console.log('==')
    // sound.play();
    console.log('==')
      // ... later in a callback, effect, etc.
    load(src, {
      // autoplay: true,
      html5: true,
    });

    play();

    // setTimeout(() => {
    //   sound?.pause();
    // }, 8000)
  }

  const querySongs = async (name) => {
    const { data } = await getSongs(name);
    console.log(data[0].url)

    playMusic(data[0].url)

    // audioRef.current.src = 'https://music.163.com/song/media/outer/url?id=65536.mp3';
    // audioRef.current.src = data[0].url;
    // audioRef.current.autoplay = true;
    // audioRef.current.playbackRate = speed;
  }

  // useEffect(() => {
  //   if (name) {
  //     querySongs(name);
  //   }
  // }, [name])
  const handlePaly  = () => {
    if (name) {
        querySongs(name);
      }
  }

  const handleEnd = () => {
    // if (mode === playMode.loop) {
    //   handleLoop();
    // } else {
    //   handleNext();
    // }
    console.log('--done-')
  };


  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  };

  const handleError = () => {
    // songReady.current = true;
    // handleNext();
    console.log("播放出错");
  };

  return (
    <div>
      {/* <ui-audio src="https://music.163.com/song/media/outer/url?id=65536.mp3" controls></ui-audio> */}
      
      <button onClick={handlePaly}>播放</button>
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>

    </div>
  )
}

export default Detail;
