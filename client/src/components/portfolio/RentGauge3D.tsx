'use client';

import React, { useState, useEffect } from 'react';

// Define props for RentGauge
type RentGauge3DProps = {
  monthlyRent: number;
  targetAmount: number;
  height?: number;
};

// Simple placeholder component that matches the dimensions
const Placeholder = ({ height }: { height: number }) => (
  <div style={{
    height,
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const RentGauge3D: React.FC<RentGauge3DProps> = ({
  monthlyRent,
  targetAmount,
  height = 400
}) => {
  const [ThreeComponents, setThreeComponents] = useState<React.ComponentType<{ monthlyRent: number, targetAmount: number }> | null>(null);

  useEffect(() => {
    // Only import the 3D components on the client side
    import('./ThreeComponents')
      .then(module => {
        setThreeComponents(() => module.default);
      })
      .catch(err => {
        console.error('Failed to load 3D components:', err);
      });
  }, []);

  // Return placeholder until the component is loaded
  if (!ThreeComponents) {
    return <Placeholder height={height} />;
  }

  // Render the actual 3D component once loaded
  return (
    <div style={{ height, position: 'relative' }}>
      <ThreeComponents
        monthlyRent={monthlyRent}
        targetAmount={targetAmount}
      />
    </div>
  );
};

export default RentGauge3D;