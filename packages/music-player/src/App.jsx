import React from 'react';
import { Provider } from 'react-redux';
import { IconStyle } from "./assets/iconfont/iconfont";
import { GlobalStyle } from './style';
import store from './store/index';
import Player from './Player';
import Test from './Test';
import './fix.css';

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <Test />
      <Player />
    </Provider>
  );
}

export default App;
