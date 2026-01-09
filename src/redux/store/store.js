import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { invoiceGenerationReducer } from "../reducers/invoiceReducers";
import { generateInvoiceReducer, reconciliationReducer, uploadFileReducer, uploadInvoiceReducer } from "../reducers/invoiceReducers";
// import InvoiceGeneration from "@//components/invoiceGeneration";

const reducers = combineReducers({
    fileUpload: uploadFileReducer,
    // poUpload: uploadPOReducer,
    invoiceUpload: uploadInvoiceReducer,
    invoiceGeneration: invoiceGenerationReducer,
    reconciliation: reconciliationReducer,
});

const initialState = {
  // userLogin: { userInfo: userInfoFromStorage },
  // domainsList: {domainsListInfo: domainsListInfoFromStorage},
  // learningPathDetails: { learningPathInfo: learningPathInfoFromStorage },
  // newsArticles: { newsInfo: newsArticlesFromStorage },
};

const store = configureStore({
  reducer: reducers,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
  devTools: true,
});

export default store;
