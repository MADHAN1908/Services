import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import themeConfigSlice from './themeConfigSlice';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  user: userReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});

export default store;

export type IRootState = ReturnType<typeof rootReducer>;
