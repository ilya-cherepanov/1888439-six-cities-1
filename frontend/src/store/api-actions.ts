import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import {
  setOffers,
  setOffer,
  setLoading as setOffersIsLoading,
} from './offers-data/offers-data';
import {
  setActiveOffer,
  setLoading as setOfferIsLoading,
} from './offer-data/offer-data';
import {
  setPremiumOffers,
  setLoading as setPremiumOffersIsLoading,
} from './premium-data/premium-data';
import {
  setReviews,
  setLoading as setReviewsIsLoading,
} from './reviews-data/reviews-data';
import {
  setFavoriteOffers,
  setLoading as setFavoriteOffersIsLoading,
} from './favorite-data/favorite-data';
import { setUser, setAuthorizationStatus } from './user-data/user-data';
import { AppDispatch, State } from '../types/state';
import { Offer } from '../types/offer';
// import { Review } from '../types/review';
import { NewReview } from '../types/new-review';
import { AuthData } from '../types/auth-data';
import { Token } from '../types/token';
import { APIRoute, AppRoute, AuthorizationStatus, NameSpace } from '../const';
import { saveToken, dropToken } from '../services/token';
import { NewOffer } from '../types/new-offer';
import { NewUser } from '../types/new-user';
import { ApiOffer } from '../types/api-offer';
import { ApiReview } from '../types/api-review';
import { transformApiOfferToOffer, transformApiReviewToReview, transformApiUserToUser, transformNewOfferToEditApiOffer, transformNewReviewToApiNewReview, transformNewUserToApiNewUser, transformOfferToEditApiOffer } from './transformation';
import { ApiUser } from '../types/api-user';
import { browserHistory } from '../services/browser-history';

type AsyncThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
};

export const fetchOffers = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Offers}/fetchOffers`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setOffersIsLoading(true));
    try {
      const { data } = await api.get<ApiOffer[]>(APIRoute.Offers);
      // dispatch(setOffers(data));
      const offers = data.map((apiOffer) => transformApiOfferToOffer(apiOffer));
      dispatch(setOffers(offers));
    } catch {
      toast.error('Can\'t fetch offers');
    } finally {
      dispatch(setOffersIsLoading(false));
    }
  }
);

export const fetchOffer = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Offer}/fetchOffer`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setOfferIsLoading(true));
    try {
      const { data } = await api.get<ApiOffer>(`${APIRoute.Offers}/${id}`);
      // dispatch(setActiveOffer(data));
      const offer = transformApiOfferToOffer(data);
      dispatch(setActiveOffer(offer));
    } catch {
      dispatch(setActiveOffer(null));
      toast.error('Can\'t fetch offer');
    } finally {
      dispatch(setOfferIsLoading(false));
    }
  }
);

export const editOffer = createAsyncThunk<void, Offer, AsyncThunkConfig>(
  `${NameSpace.Offer}/editOffer`,
  async (offerData, { dispatch, extra: api }) => {
    try {
      const editedOffer = transformOfferToEditApiOffer(offerData);
      const { data } = await api.put<ApiOffer>(
        `${APIRoute.Offers}/${offerData.id}`,
        editedOffer
      );
      const offer = transformApiOfferToOffer(data);
      dispatch(setActiveOffer(offer));
      browserHistory.push(`${AppRoute.OfferBase}${offer.id}`);
    } catch {
      throw new Error('Can\'t edit offer');
    }
  }
);

export const addOffer = createAsyncThunk<void, NewOffer, AsyncThunkConfig>(
  `${NameSpace.Offer}/addOffer`,
  async (offerData, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<ApiOffer>(
        APIRoute.Offers,
        transformNewOfferToEditApiOffer(offerData),
      );
      const offer = transformApiOfferToOffer(data);
      dispatch(setActiveOffer(offer));
      browserHistory.push(`${AppRoute.OfferBase}${offer.id}`);
    } catch {
      throw new Error('Can\'t add offer');
    }
  }
);

export const deleteOffer = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Offer}/deleteOffer`,
  async (id, { dispatch, extra: api }) => {
    try {
      await api.delete(`${APIRoute.Offers}/${id}`);
      dispatch(setActiveOffer(null));
    } catch {
      throw new Error('Can\'t delete offer');
    }
  }
);


export const fetchPremiumOffers = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(
  `${NameSpace.Premium}/fetchPremiumOffers`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setPremiumOffersIsLoading(true));
    try {
      const { data } = await api.get<ApiOffer[]>(
        // `${APIRoute.Offers}/${id}${APIRoute.Premium}`
        APIRoute.Premium,
      );
      const offers = data.map((apiOffer) => transformApiOfferToOffer(apiOffer));
      dispatch(setPremiumOffers(offers));
    } catch {
      toast.error('Can\'t fetch premium offers');
    } finally {
      dispatch(setPremiumOffersIsLoading(false));
    }
  }
);

export const fetchReviews = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Reviews}/fetchReviews`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setReviewsIsLoading(true));
    try {
      const { data } = await api.get<ApiReview[]>(`${APIRoute.Offers}/${id}/comments`);
      const reviews = data.map((apiReview) => transformApiReviewToReview(apiReview));
      dispatch(setReviews(reviews));
    } catch {
      toast.error('Can\'t fetch reviews');
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const postReview = createAsyncThunk<
  void,
  { id: string; review: NewReview },
  AsyncThunkConfig
>(
  `${NameSpace.Reviews}/postReview`,
  async ({ id, review }, { dispatch, extra: api }) => {
    try {
      const newApiReview = transformNewReviewToApiNewReview(review);
      await api.post<ApiReview>(`${APIRoute.Offers}/${id}/comments`, newApiReview);
      await dispatch(fetchReviews(id));
    } catch {
      toast.error('Can\'t post review');
    }
  }
);

export const checkAuth = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      const { data } = await api.get<ApiUser>(APIRoute.Login);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      const user = transformApiUserToUser(data);
      dispatch(setUser(user));
    } catch {
      dropToken();
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    }
  }
);

export const login = createAsyncThunk<void, AuthData, AsyncThunkConfig>(
  `${NameSpace.User}/login`,
  async (authData, { dispatch, extra: api }) => {
    try {
      const {
        data: { token },
      } = await api.post<{ token: Token }>(APIRoute.Login, authData);
      saveToken(token);
      dispatch(checkAuth());
    } catch {
      toast.error('Can\'t login');
    }
  }
);

export const logout = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/logout`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      // await api.delete(APIRoute.Logout);
      dropToken();
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    } catch {
      toast.error('Can\'t logout');
    }
  }
);

export const fetchFavoriteOffers = createAsyncThunk<
  void,
  undefined,
  AsyncThunkConfig
>(
  `${NameSpace.Favorite}/fetchFavoriteFilms`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setFavoriteOffersIsLoading(true));
    try {
      const { data } = await api.get<ApiOffer[]>(`${APIRoute.Favorite}`);
      const offers = data.map((apiOffer) => transformApiOfferToOffer(apiOffer));
      dispatch(setFavoriteOffers(offers));
    } catch {
      toast.error('Can\'t fetch favorite films');
    } finally {
      dispatch(setFavoriteOffersIsLoading(false));
    }
  }
);

export const setFavorite = createAsyncThunk<
  void,
  { id: string; status: number },
  AsyncThunkConfig
>(
  `${NameSpace.Favorite}/setFavorite`,
  async ({ id, status }, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<ApiOffer>(
        `${APIRoute.Favorite}/${id}/${status}`
      );
      const offer = transformApiOfferToOffer(data);
      dispatch(setOffer(offer));
      dispatch(fetchFavoriteOffers());
    } catch {
      toast.error('Can\'t add to or remove from MyList');
    }
  }
);

// type CreatedApiUser = ApiUser & {
//   id: string,
//   token: string,
// };

export const registerUser = createAsyncThunk<void, NewUser, AsyncThunkConfig>(
  `${NameSpace.User}/register`,
  async (userData, { extra: api }) => {
    const { avatar } = userData;
    delete userData.avatar;

    try {
      const { data } = await api.post<{id: string}>(APIRoute.Register, transformNewUserToApiNewUser(userData));

      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        await api.post(`/users/${data.id}${APIRoute.SetAvatar}`, formData);
      }


    } catch {
      throw new Error('Can\'t sign up');
    }
  }
);
