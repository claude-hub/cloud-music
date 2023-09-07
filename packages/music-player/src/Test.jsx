import React from "react";
import { connect } from 'react-redux';
import { changePlayList, changeCurrentIndex, changeSequecePlayList } from './Player/store/actionCreators';
import songs from './mock.json';

const Test = (props) => {
  const {
    changePlayListDispatch,
    changeCurrentIndexDispatch,
    changeSequecePlayListDispatch
  } = props;

  const handleClick = (index) => {
    changePlayListDispatch(songs);
    changeSequecePlayListDispatch(songs);
    changeCurrentIndexDispatch(index);
  }

  return (
    <div>
      <button onClick={() => handleClick(0)}>播放</button>
    </div>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    changeSequecePlayListDispatch(data) {
      dispatch(changeSequecePlayList(data))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Test));;
