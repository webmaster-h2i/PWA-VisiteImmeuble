import errorReducer from "./errorSlice";
import tokenReducer from "./tokenSlice";
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
    reducer: {
        errorstate: errorReducer,
        token: tokenReducer,
    },
})