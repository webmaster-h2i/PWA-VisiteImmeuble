import tokenReducer from "./tokenSlice";
import visiteReducer from "./visiteSlice";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
    token: tokenReducer,
    visite: visiteReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['']
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});