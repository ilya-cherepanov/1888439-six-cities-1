import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/header/header';
import EditForm from '../../components/edit-form/edit-form';
import { AppRoute, CITIES, DEFAULT_CITY_INDEX, TYPES } from '../../const';
import { NewOffer } from '../../types/new-offer';
import { useAppDispatch} from '../../hooks';
import { addOffer } from '../../store/api-actions';
import { useCallback } from 'react';

const emptyOffer: NewOffer = {
  title: '',
  description: '',
  city: CITIES[DEFAULT_CITY_INDEX],
  previewImage: '',
  isPremium: false,
  type: TYPES[0],
  bedrooms: 1,
  maxAdults: 1,
  price: 0,
  goods: [],
  location: CITIES[DEFAULT_CITY_INDEX].location,
};

function AddPage() {
  const dispatch = useAppDispatch();

  const handleSubmit = useCallback(async (offerData: NewOffer) => {
    const response = await dispatch(addOffer(offerData));
    if (response.meta.requestStatus === 'rejected') {
      toast.error('Can\'t add offer');
    }
  }, [dispatch]);

  return (
    <div className="page">
      <Header />
      <main className="page__main">
        <div className="container">
          <section>
            <h1>Add new offer</h1>
            <EditForm offer={emptyOffer} onSubmit={handleSubmit} />
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Main}>
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}

export default AddPage;
