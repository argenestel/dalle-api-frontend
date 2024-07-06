import React from 'react';

const History = ({ history }) => {
  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl text-primary-800 font-bold mb-4">History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((url, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-md bg-secondary-100">
            <img src={url} alt={`Generated ${index}`} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;