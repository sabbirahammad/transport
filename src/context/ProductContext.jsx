import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [apiStates, setApiStates] = useState({
    customer: { data: null, loading: true, error: null },
    vehicle: { data: null, loading: true, error: null },
    product: { data: null, loading: true, error: null },
  });

  const [additionalApis, setAdditionalApis] = useState({});

  // Memoize fetchApi to prevent unnecessary re-renders
  const fetchApi = useCallback(async (key, url) => {
    console.log(`Fetching ${key} from: ${url}`);
    setApiStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null },
    }));

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch ${key} data`);
      }
      const data = await response.json();
      console.log(`Successfully fetched ${key} data:`, data);

      setApiStates((prev) => ({
        ...prev,
        [key]: { data, loading: false, error: null },
      }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      setApiStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], loading: false, error: error.message },
      }));
    }
  }, []);

  // Fetch customer data on mount
  useEffect(() => {
    fetchApi('customer', 'http://192.168.0.106:8080/api/v1/customer');
  }, [fetchApi]);

  // Fetch product data on mount
  useEffect(() => {
    fetchApi('product', 'http://192.168.0.106:8080/api/v1/product');
  }, [fetchApi]);

  // Fetch vehicle data when page or itemsPerPage changes
  useEffect(() => {
    fetchApi('vehicle', `http://192.168.0.106:8080/api/v1/vehicle?page=${page}&page_size=${itemsPerPage}`);
  }, [page, itemsPerPage, fetchApi]);

  // Fetch additional APIs when additionalApis state changes
  useEffect(() => {
    Object.entries(additionalApis).forEach(([key, { url, dependencies }]) => {
      // Check if dependencies are met before fetching
      const depsMet = dependencies.every(dep => {
        const depState = apiStates[dep];
        return depState && !depState.loading && !depState.error && depState.data;
      });

      if (depsMet) {
        fetchApi(key, url);
      }
    });
  }, [additionalApis, apiStates, fetchApi]);

  // Function to add a new API easily
  const addApi = useCallback((key, url, dependencies = []) => {
    console.log(`Adding API: ${key} with URL: ${url}`);
    setAdditionalApis((prev) => ({
      ...prev,
      [key]: { url, dependencies },
    }));
    setApiStates((prev) => ({
      ...prev,
      [key]: { data: null, loading: true, error: null },
    }));
  }, []);

  // Function to refetch specific API
  const refetchApi = useCallback((key) => {
    const apiConfig = additionalApis[key];
    if (apiConfig) {
      fetchApi(key, apiConfig.url);
    } else if (key === 'customer') {
      fetchApi('customer', 'http://192.168.0.106:8080/api/v1/customer');
    } else if (key === 'vehicle') {
      fetchApi('vehicle', `http://192.168.0.106:8080/api/v1/vehicle?page=${page}&page_size=${itemsPerPage}`);
    } else if (key === 'product') {
      fetchApi('product', 'http://192.168.0.106:8080/api/v1/product');
    }
  }, [additionalApis, fetchApi, page, itemsPerPage]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    apiStates,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    addApi,
    refetchApi,
  }), [apiStates, page, itemsPerPage, addApi, refetchApi]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider');
  }
  return context;
};