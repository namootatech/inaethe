import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { data } from 'autoprefixer';

const API_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL + '/.netlify/functions';

const ApiContext = createContext();

export const useApi = () => {
  return useContext(ApiContext);
};

// Provider component to wrap the app and provide the API context
export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to make API calls with error handling and logging
  const apiRequest = async (endpoint, method = 'GET', data = null) => {
    console.log(
      `*** [API CONTEXT] Making ${method} request to: ${endpoint}`,
      data
    );
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
          err.data?.message ||
          err.message ||
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

  const loginNpo = async (credentials) => {
    console.log('*** [API CONTEXT] Logging in user...');
    return await apiRequest('/loginNpo', 'POST', credentials);
  };

  const restoreUser = async (token) => {
    console.log('*** [API CONTEXT] Logging in user...');
    return await apiRequest('/restoreUser', 'POST', token);
  };

  const restorePartner = async (token) => {
    console.log('*** [API CONTEXT] Logging in user...');
    return await apiRequest('/restorePartner', 'POST', token);
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

  const createReferralLink = async (data) => {
    console.log(
      `*** [API CONTEXT] Creating referral link for user ID: ${data.userId}...`
    );
    return await apiRequest(`/createReferralLink`, 'POST', data);
  };

  const getUserReferralLink = async (userId) => {
    console.log(
      `*** [API CONTEXT] Fetching referral link for user ID: ${userId}...`
    );
    return await apiRequest('/getUserReferralLink', 'POST', { userId });
  };

  const getUserEarnings = async (userId, page, limit) => {
    console.log('*** [API CONTEXT] Fetching user earnings...', {
      userId,
      page,
      limit,
    });
    return await apiRequest(`/getUserEarnings`, 'POST', {
      userId,
      page,
      limit,
    });
  };

  const getUserTransactions = async (userId, page, limit) => {
    console.log('*** [API CONTEXT] Fetching user transactions...', {
      userId,
      page,
      limit,
    });
    return await apiRequest(`/getUserTransactions`, 'POST', {
      userId,
      page,
      limit,
    });
  };

  const getUserNetworkTransactions = async (userId) => {
    console.log('*** [API CONTEXT] Fetching user network transactions...', {
      userId,
    });
    return await apiRequest(`/getUserNetworkTransactions`, 'POST', {
      userId,
    });
  };

  const getUserNetworkSubscriptions = async (userId) => {
    console.log('*** [API CONTEXT] Fetching user network subscriptions...', {
      userId,
    });
    return await apiRequest(`/getUserNetworkSubscriptions`, 'POST', {
      userId,
    });
  };

  const getUserNetwork = async (userId) => {
    console.log('*** [API CONTEXT] Fetching user network...', {
      userId,
    });
    return await apiRequest(`/getUserNetwork`, 'POST', {
      userId,
    });
  };

  const getUserWithdrawalRequests = async (userId, page, limit) => {
    console.log('*** [API CONTEXT] Fetching user withdrawal requests...', {
      userId,
      page,
      limit,
    });
    return await apiRequest(`/getUserWithdrawalRequests`, 'POST', {
      userId,
      page,
      limit,
    });
  };

  const createWithdrawalRequest = async (withdrawalRequest) => {
    console.log(
      '*** [API CONTEXT] Creating user withdrawal request...',
      withdrawalRequest
    );
    return await apiRequest(
      `/createWithdrawalRequest`,
      'POST',
      withdrawalRequest
    );
  };

  const addBlogPost = async (blogData) => {
    console.log('*** [API CONTEXT] Adding a new blog post...');
    return await apiRequest('/addBlogPost', 'POST', blogData);
  };

  const updateBlogPost = async (blogId, blogData) => {
    console.log(`*** [API CONTEXT] Updating blog post with ID: ${blogId}...`);
    return await apiRequest(`/updateBlogPost`, 'POST', {
      postId: blogId,
      data: blogData,
    });
  };

  const deleteBlogPost = async (blogId) => {
    console.log(`*** [API CONTEXT] Deleting blog post with ID: ${blogId}...`);
    return await apiRequest(`/deleteBlogPost/`, 'POST', { blogId });
  };

  const getAllPublicBlogPosts = async () => {
    console.log('*** [API CONTEXT] Fetching all public blog posts...');
    return await apiRequest('/blogPosts/public', 'GET');
  };

  const getUserBlogPosts = async (userId) => {
    console.log(
      `*** [API CONTEXT] Fetching blog posts for user ID: ${userId}...`
    );
    return await apiRequest(`/getUserBlogPosts`, 'POST', { userId });
  };

  const getBlogPostContent = async (postId) => {
    console.log(
      `*** [API CONTEXT] Fetching blog posts for user ID: ${postId}...`
    );
    return await apiRequest(`/getBlogPostContent`, 'POST', { id: postId });
  };

  const addSubscriber = async (email, organisationId) => {
    console.log(`*** [API CONTEXT] Uadding subscriber`);
    return await apiRequest(`/addSubscriber`, 'POST', {
      email,
      organisationId,
    });
  };
  const addSiteConfig = async (data) => {
    console.log(`*** [API CONTEXT] Uadding subscriber`);
    return await apiRequest(`/addConfig`, 'POST', data);
  };

  const checkLiveStatus = async (url) => {
    console.log(`*** [API CONTEXT] Uadding subscriber`);
    return await apiRequest(`/checkLiveStatus`, 'POST', { url });
  };

  const saveTransaction = async (data) => {
    console.log(`*** [API CONTEXT] Saving transaction`);
    return await apiRequest(`/saveTransaction`, 'POST', data);
  };

  const getLinkOwner = async (id) => {
    console.log(`*** [API CONTEXT] Saving transaction`);
    return await apiRequest(`/getLinkOwner`, 'POST', { id });
  };

  const incrementLinkVisits = async (id) => {
    console.log(`*** [API CONTEXT] Saving transaction`);
    return await apiRequest(`/incrementLinkVisits`, 'POST', { id });
  };

  const getPartnerId = async (slug) => {
    console.log(`*** [API CONTEXT] Saving transaction`);
    return await apiRequest(`/getPartnerId`, 'POST', { slug });
  };

  const getUserSubscriptions = async (userId, page, limit) => {
    console.log('*** [API CONTEXT] Fetching user transactions...', {
      userId,
      page,
      limit,
    });
    return await apiRequest(`/getUserSubscriptions`, 'POST', {
      userId,
      page,
      limit,
    });
  };

  const createYocoCheckout = async (data) => {
    console.log(`*** [API CONTEXT] Creating checkout session...`);
    return await apiRequest(`/createYocoCheckout`, 'POST', data);
  };

  const addBlogPostComment = async (data) => {
    console.log(`*** [API CONTEXT] Creating checkout session...`);
    return await apiRequest(`/addBlogPostComment`, 'POST', data);
  };

  const getBlogPostComments = async (postId) => {
    console.log(`*** [API CONTEXT] Get BLOG post comments ${postId}.`);
    return await apiRequest(`/getBlogPostComments`, 'POST', { postId });
  };

  const getBlogPosts = async (page, limit) => {
    console.log(`*** [API CONTEXT] Get BLOG posts ${page} ${limit}.`);
    return await apiRequest(`/getBlogPosts`, 'POST', { page, limit });
  };

  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        login,
        register,
        loginNpo,
        restoreUser,
        restorePartner,
        addBlogPost,
        getBlogPostContent,
        getBlogPosts,
        getUserBlogPosts,
        getAllPublicBlogPosts,
        deleteBlogPost,
        updateBlogPost,
        addBlogPostComment,
        getBlogPostComments,
        getUser,
        listNetworkTransactions,
        getNPO,
        listNpos,
        addPost,
        updatePost,
        deletePost,
        addSubscription,
        addNpo,
        createReferralLink,
        getUserReferralLink,
        getLinkOwner,
        incrementLinkVisits,
        getUserEarnings,
        getUserTransactions,
        getUserWithdrawalRequests,
        createWithdrawalRequest,
        addSubscriber,
        addSiteConfig,
        checkLiveStatus,
        saveTransaction,
        getUserSubscriptions,
        getPartnerId,
        createYocoCheckout,
        getUserNetworkTransactions,
        getUserNetwork,
        getUserNetworkSubscriptions,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
