import React from 'react';

const StatsCard = ({ title, value, change, changeType, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <div className="absolute top-0 right-0 w-20 h-20 -m-6 transform rotate-45 opacity-10">
          <div className="w-full h-full bg-blue-500 rounded-md"></div>
        </div>
        
        <div>
          <div className="text-gray-500 text-sm">{title}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
        </div>
        
        <div className="text-blue-500 p-2 rounded-full bg-blue-50">
          {icon}
        </div>
      </div>
      
      {change !== undefined && (
        <div className={`text-sm flex items-center mt-2 ${
          changeType === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>
            {changeType === 'up' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </span>
          <span>{Math.abs(change).toFixed(1)}%</span>
          <span className="text-gray-500 ml-2">from last week</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;