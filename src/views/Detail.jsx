import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Howl } from 'howler';
import { getSongs } from '../service';

const Detail = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const { name } = useParams();
  const audioRef = useRef();

  const playMusic = (src) => {
    const sound = new Howl({
      src: [src],
      html5: true,
    });
    console.log('==')
    sound.play();
  }

  const querySongs = async (name) => {
    const { data } = await getSongs(name);
    console.log(data[0].url)

    playMusic(data[0].url)
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
