import React from 'react';
import { useProduct } from '../context/ProductContext';

export default function ExampleUsage() {
  const { apiStates, addApi, refetchApi } = useProduct();

  // Example: Add a new API endpoint
  const handleAddNewApi = () => {
    addApi('products', 'http://192.168.0.106:8080/api/v1/products');
  };

  // Example: Refetch customer data
  const handleRefetchCustomer = () => {
    refetchApi('customer');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ProductContext Usage Example</h1>

      {/* Customer Data Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Customer Data</h2>
        {apiStates.customer.loading && (
          <div className="text-blue-600">Loading customers...</div>
        )}
        {apiStates.customer.error && (
          <div className="text-red-600">Error: {apiStates.customer.error}</div>
        )}
        {apiStates.customer.data && (
          <div>
            <p className="text-green-600 mb-2">Successfully loaded {apiStates.customer.data.length} customers</p>
            <button
              onClick={handleRefetchCustomer}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refetch Customers
            </button>
          </div>
        )}
      </div>

      {/* Vehicle Data Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Vehicle Data</h2>
        {apiStates.vehicle.loading && (
          <div className="text-blue-600">Loading vehicles...</div>
        )}
        {apiStates.vehicle.error && (
          <div className="text-red-600">Error: {apiStates.vehicle.error}</div>
        )}
        {apiStates.vehicle.data && (
          <div>
            <p className="text-green-600 mb-2">Successfully loaded {apiStates.vehicle.data.length} vehicles</p>
          </div>
        )}
      </div>

      {/* Additional APIs Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Additional APIs</h2>
        <button
          onClick={handleAddNewApi}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
        >
          Add Products API
        </button>

        {apiStates.products && (
          <div>
            {apiStates.products.loading && <div className="text-blue-600">Loading products...</div>}
            {apiStates.products.error && <div className="text-red-600">Error: {apiStates.products.error}</div>}
            {apiStates.products.data && (
              <div className="text-green-600">Successfully loaded {apiStates.products.data.length} products</div>
            )}
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <pre className="text-xs bg-white p-2 rounded border overflow-auto">
          {JSON.stringify({
            customer: {
              hasData: !!apiStates.customer.data,
              loading: apiStates.customer.loading,
              error: apiStates.customer.error
            },
            vehicle: {
              hasData: !!apiStates.vehicle.data,
              loading: apiStates.vehicle.loading,
              error: apiStates.vehicle.error
            },
            additionalApis: Object.keys(apiStates).filter(key => !['customer', 'vehicle'].includes(key))
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}