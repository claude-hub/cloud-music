import { ChangeEvent, useEffect, useState } from 'react'
import { Howl } from 'howler';
import { useNavigate } from 'react-router-dom'
import { Music, getMusicPageUrl } from '../utils';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate()

  const [searchKey, setSearchKey] = useState('稻香');
  const [musics, setMusics] = useState<Music[]>([]);

  const test = async () => {
    // const data = {
    //   type: 1,
    // }
    // const result = await request(
    //   {
    //     url: 'https://music.163.com/weapi/login/qrcode/unikey',
    //     method: 'POST',
    //     data,
    //     crypto: 'weapi',
    //   }
    // )
    // console.log(result)
    // const result = await request({
    //   url: 'http://www.kuwo.cn/api/www/artist/artistMusic?artistid=336&pn=1&rn=20&httpsStatus=1&reqId=ad7a8ca0-495d-11ee-a623-43baf960ec91&plat=web_www&from='
    // })
    // console.log(result)

    // const result = await axios('https://netease-cloud-music-api-neon-beta.vercel.app/artist/songs?id=6452');
    // console.log(result)

   const res = await axios('https://cdn.jsdelivr.net/gh/claude-hub/node@main/packages/music/musics/artists/index.json');
    console.log(res.data);
  }

  useEffect(() => {
    test()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value)
  }

  const handleSearch = async () => {
    if (!searchKey) return;
    const result = await getMusicPageUrl(searchKey)
    console.log(result)
    setMusics(result);
  }

  const playMusic = (src: string) => {
    const sound = new Howl({
      src: [src],
      html5: true,
    });

    sound.play();
  }

  console.log(window.list)

  const goToDetail = (name: string) => () => {
    navigate(`/singers/${name}`)
  }

  return (
    <>
      {
        window.list.map(item => {
          const { name, pic } = item;
          return (
            <div key={name} onClick={goToDetail(name)}>
              <img src={pic} alt="图片" />
              <div>{name}</div>
            </div>
          )
        })
      }
      <div className="card">
        <input value={searchKey} onChange={handleChange} />
        <button onClick={handleSearch}>
          搜索
        </button>

        {musics.map(item => {
          return (
            <div onClick={() => playMusic(item.src)}>
              {item.name}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Home
