import React from 'react';
import ReactDOM from 'react-dom';
import Comp from './Component';

window.onload = () => {
  ReactDOM.render(
    <Comp />,
    document.querySelector('#container')
  );
};
