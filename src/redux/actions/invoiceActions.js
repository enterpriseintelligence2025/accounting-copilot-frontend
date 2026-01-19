/*
  redux/actions/invoiceActions.js
  - Contains thunk actions for uploading files, generating invoices and running reconciliation.
  - Uses `axios` and environment variables for API endpoints.
*/
import axios from "axios"
import { GENERATE_INVOICE_REQUEST, GENERATE_INVOICE_SUCCESS, GENERATE_INVOICE_FAIL, RECONCILIATION_REQUEST, RECONCILIATION_SUCCESS, RECONCILIATION_FAIL } from "../constants/invoiceConstants"

const BASE_API_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000"

export const generateInvoiceAPI = (file) => async (dispatch) => {
  try {
    dispatch({ type: GENERATE_INVOICE_REQUEST })

    const formData = new FormData()
    formData.append("file", file)

    const { data } = await axios.post(
      `${BASE_API_URL}/invoice/generate`,
      formData,
      {
        headers: {
          // Backend expects a file upload; adjust `Content-Type` if required by the server
          "Content-Type": "application/pdf"
        }
      }
    )

    dispatch({
      type: GENERATE_INVOICE_SUCCESS,
      payload: data.data   // <- invoice JSON
    })
  } catch (error) {
    dispatch({
      type: GENERATE_INVOICE_FAIL,
      payload: error.response?.data || {
      issues: ["Unexpected error occurred"],
      next_steps: ["Try again later"]
    }
  })
  }
}





// import axios from "axios";

import {
    UPLOAD_FILE_REQUEST,
    UPLOAD_FILE_SUCCESS,
    UPLOAD_FILE_FAIL,
    // GENERATE_INVOICE_REQUEST,
    // GENERATE_INVOICE_SUCCESS,
    // GENERATE_INVOICE_FAIL,
    // RECONCILIATION_REQUEST,
    // RECONCILIATION_SUCCESS,
    // RECONCILIATION_FAIL,
    UPLOAD_PO_FAIL,
    UPLOAD_PO_REQUEST,
    UPLOAD_PO_SUCCESS,
    UPLOAD_INVOICE_REQUEST,
    UPLOAD_INVOICE_SUCCESS,
    UPLOAD_INVOICE_FAIL
} from '../constants/invoiceConstants';

// const baseUrl = 'https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io'
const baseUrl = import.meta.env.VITE_AI_PLAYGROUND_BASE_URL
// https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/run/adda70b1-e24a-4610-926a-ca8b80ed8a02?stream=false
// const flowId = '91a3d1f1-fa91-4aff-a334-140860535fae'

const API_KEY = import.meta.env.VITE_AI_PLAYGROUND_API_KEY

export const AI_PLAYGROUND_WORKFLOWS = {
    RAG: {flowId:'e322521c-1cd2-4126-a002-24458d3c6eaf'},
    INVOICING: {flowId:'1ce871a4-e87b-4e82-beb8-b4ca7791baf6', fileComponentId:'File-EKjxA'},
    RECONCILING : {flowId: 'f33346c4-5166-4341-83e9-3380fb00f07c',poComponent:'File-hGR2q', invoiceComponent:'File-pZRDa'}

}

// const WORKFLOWS = {
//     RAG: {flowId:'9e96ec5d-b3bc-4497-9006-97421cd8d7d9'},
//     INVOICING: {flowId:'70fc313b-4f6d-4e9b-b51e-ec803d845bb1', fileComponentId:'File-zeINU'},
//     RECONCILING: {flowId: 'adda70b1-e24a-4610-926a-ca8b80ed8a02', poComponent:'File-eclaI', invoiceComponent:'File-oqmWy'}
// }

export const uploadFileAPI = (flag, file) => async(dispatch) => {
    try{
        // Get the flowId based on the flag
        const flow = AI_PLAYGROUND_WORKFLOWS[flag];
        if (!flow) {
            throw new Error('Invalid flag provided');
        }
        
        const flowId = flow.flowId;
        console.log('uploading file to: ',flowId);
        
        
        dispatch({type: UPLOAD_FILE_REQUEST});
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${baseUrl}/api/v1/files/upload/${flowId}`, formData, {
        // const response = await axios.post("https://aiplayground.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/files/upload/1ce871a4-e87b-4e82-beb8-b4ca7791baf6", formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': `${API_KEY}`
            },
            // responseType: 'json'
        });
        
        console.log('file uploaded: ', response.data);
        dispatch({type: UPLOAD_FILE_SUCCESS, payload: response.data});
    } catch(error) {
        console.log('Error:', error);
        dispatch({
            type: UPLOAD_FILE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
}

export const uploadPOAPI = (file) => async(dispatch) => {
    try{
        dispatch({type: UPLOAD_PO_REQUEST});
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${baseUrl}/api/v1/files/upload/${AI_PLAYGROUND_WORKFLOWS.RECONCILING.flowId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': `${API_KEY}`
            }
        });
        
        console.log('PO file uploaded: ', response.data);
        dispatch({type: UPLOAD_PO_SUCCESS, payload: response.data});
    }catch(error){
        console.log('Error:', error)
        dispatch({type: UPLOAD_PO_FAIL,
            payload: error.response?.data?.message || error.message,
        })
    }
}

export const uploadInvoiceAPI = (file) => async(dispatch) => {
    try{
        dispatch({type: UPLOAD_INVOICE_REQUEST});
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${baseUrl}/api/v1/files/upload/${AI_PLAYGROUND_WORKFLOWS.RECONCILING.flowId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': `${API_KEY}`
            }
        });
        
        console.log('Invoice file uploaded: ', response.data);
        dispatch({type: UPLOAD_INVOICE_SUCCESS, payload: response.data});
    }catch(error){
        console.log('Error:', error)
        dispatch({type: UPLOAD_INVOICE_FAIL,
            payload: error.response?.data?.message || error.message,
        })
    }
}

// export const generateInvoiceAPI = (filePath) => async(dispatch) => {
//     try{
//         dispatch({type: GENERATE_INVOICE_REQUEST})
//         // e7fe8081-0b38-4985-820f-244a02347ccc/2025-03-19_16-43-05_TLE-EIS-2425-776-Kloudineer (1) (1).pdf
//         // const filePath = "e7fe8081-0b38-4985-820f-244a02347ccc/2025-03-19_11-57-16_TLE-EIS-2425-776-Kloudineer (1) (1).pdf"
//         console.log('Making api for generating invoice via file:', filePath);
//         const {data} = await axios.post(`${baseUrl}/api/v1/run/${AI_PLAYGROUND_WORKFLOWS.INVOICING.flowId}?stream=false`,{
//             // input_value: "What is inside the file.",
//             output_type: "chat",
//             input_type: "chat",
//             tweaks: {
//                 [AI_PLAYGROUND_WORKFLOWS.INVOICING.fileComponentId]: {
//                     "path":filePath
//                 }
//             }
//         },{
//             headers:{
//                 // 'Content-Type': 'multipart/form-data',
//                 'x-api-key': `${API_KEY}`
//             }
//         }
//     )

//         console.log('if: ',data.outputs[0].outputs[0].messages[0].message);
//         const invoiceData = JSON.parse(data.outputs[0].outputs[0].messages[0].message)
        
//         dispatch({type: GENERATE_INVOICE_SUCCESS, payload: invoiceData})
        
//         return invoiceData
//     }catch(error){
//         console.log('Error:', error)
//         dispatch({type: GENERATE_INVOICE_FAIL,
//             payload: error.response?.data?.message || error.message,
//         })
//     }
// }

export const reconcileAPI = (poFile, invoiceFile) => async (dispatch) => {
  try {
    dispatch({ type: RECONCILIATION_REQUEST })

    const formData = new FormData()
    formData.append("po", poFile)
    formData.append("invoice", invoiceFile)

    const { data } = await axios.post(
      `${BASE_API_URL}/reconcile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )

    if (data.status === "failure") {
      dispatch({
        type: RECONCILIATION_FAIL,
        payload: data
      })
      return
    }

    dispatch({
      type: RECONCILIATION_SUCCESS,
      payload: data.data
    })
  } catch (error) {
    dispatch({
      type: RECONCILIATION_FAIL,
      payload:
        error.response?.data?.issues ||
        ["Unexpected reconciliation failure"]
    })
  }
}
