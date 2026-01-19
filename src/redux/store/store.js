/*
  redux/store/store.js
  - Configures the Redux store used by the app.
  - Exposes preloaded state and applies `redux-thunk` middleware for async actions.
*/
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { invoiceGenerationReducer } from "../reducers/invoiceReducers";
import { generateInvoiceReducer, reconciliationReducer, uploadFileReducer, uploadInvoiceReducer } from "../reducers/invoiceReducers";

const reducers = combineReducers({
    fileUpload: uploadFileReducer,
    // poUpload: uploadPOReducer,
    invoiceUpload: uploadInvoiceReducer,
    invoiceGeneration: invoiceGenerationReducer,
    reconciliation: reconciliationReducer,
});

const initialState = {
};

const store = configureStore({
  reducer: reducers,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
  devTools: true,
});

export default store;
