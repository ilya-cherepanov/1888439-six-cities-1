import React from 'react';
import ReactDOM from 'react-dom';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import App from './components/app/app';
import { store } from './store';
import { fetchOffers } from './store/api-actions';
import 'react-toastify/dist/ReactToastify.css';
import { browserHistory } from './services/browser-history';

store.dispatch(fetchOffers());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={browserHistory}>
        <ToastContainer />
        <App />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
