import React from 'react';
import ReactDOM from 'react-dom';
import StarWars from './main.js';

window.onload = () => {
  ReactDOM.render(
    <StarWars />,
    document.querySelector('#container')
  );
};
