import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import Content from './components/Content';

// css
import './styles/index.css';
import './styles/customize-progress-bar.css';
import './fonts/Oxanium-VariableFont_wght.ttf';
import store from './reduxToolkit';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Content />
    </Provider>
  </React.StrictMode>,
);
