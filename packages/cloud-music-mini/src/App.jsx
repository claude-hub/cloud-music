import { useRef } from "react";

const App = () => {
  const audioRef = useRef();



  return (
    <ui-audio
      ref={audioRef}
      mode="html5"
      controls
      src="https://music.163.com/song/media/outer/url?id=65536.mp3"
    ></ui-audio>
  )
}

export default App;