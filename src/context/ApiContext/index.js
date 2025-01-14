// src/context/ApiContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Set your API base URL (replace with your actual API URL)
const API_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL + '/.netlify/functions';

// Create a context for the API
const ApiContext = createContext();

// Custom hook to use the API context
export const useApi = () => {
  return useContext(ApiContext);
};

// Provider component to wrap the app and provide the API context
export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to make API calls with error handling and logging
  const apiRequest = async (endpoint, method = 'GET', data = null) => {
    console.log(`*** [API CONTEXT] Making ${method} request to: ${endpoint}`);
    setLoading(true);
    try {
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`*** [API CONTEXT] Response received from: ${endpoint}`);
      setLoading(false);
      return Promise.resolve(response.data);
    } catch (err) {
      console.error(
        `*** [API CONTEXT] Error during request to: ${endpoint}`,
        err
      );
      console.log('Api error happened', err.response, err.response.data);
      setLoading(false);
      setError(err.message || 'Something went wrong');
      return Promise.reject(
        err.response.data.message ||
          err.data.message ||
          e.message ||
          'Something went wrong'
      );
    }
  };

  // API functions to interact with the server
  const register = async (userData) => {
    console.log('*** [API CONTEXT] Registering new user...');
    return await apiRequest('/register', 'POST', userData);
  };

  const login = async (credentials) => {
    console.log('*** [API CONTEXT] Logging in user...');
    return await apiRequest('/login', 'POST', credentials);
  };

  const restoreUser = async (token) => {
    console.log('*** [API CONTEXT] Logging in user...');
    return await apiRequest('/restoreUser', 'POST', token);
  };

  const getUser = async () => {
    console.log('*** [API CONTEXT] Fetching current user...');
    return await apiRequest('/user');
  };

  const addSubscription = async (subscription) => {
    console.log('*** [API CONTEXT] Adding subscription...');
    return await apiRequest('/addSubscription', 'POST', subscription);
  };

  const listNetworkTransactions = async () => {
    console.log('*** [API CONTEXT] Listing network transactions...');
    return await apiRequest('/getTransactions');
  };

  const getNPO = async (npoId) => {
    console.log(`*** [API CONTEXT] Fetching NPO with ID: ${npoId}...`);
    return await apiRequest(`/npo/getPartner`);
  };

  const listNpos = async () => {
    console.log('*** [API CONTEXT] Listing all NPOs...');
    return await apiRequest('/getPartners');
  };

  const addNpo = async (data) => {
    console.log('*** [API CONTEXT] Adding partner...');
    return await apiRequest('/addPartner', 'POST', data);
  };

  const addPost = async (postData) => {
    console.log('*** [API CONTEXT] Adding a new post...');
    return await apiRequest('/posts', 'POST', postData);
  };

  const updatePost = async (postId, postData) => {
    console.log(`*** [API CONTEXT] Updating post with ID: ${postId}...`);
    return await apiRequest(`/posts/${postId}`, 'PUT', postData);
  };

  const deletePost = async (postId) => {
    console.log(`*** [API CONTEXT] Deleting post with ID: ${postId}...`);
    return await apiRequest(`/posts/${postId}`, 'DELETE');
  };

  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        register,
        login,
        getUser,
        listNetworkTransactions,
        getNPO,
        listNpos,
        addPost,
        updatePost,
        deletePost,
        addSubscription,
        restoreUser,
        addNpo,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
