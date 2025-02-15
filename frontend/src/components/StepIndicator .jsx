import React from 'react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Adım 1', description: 'Adres Bilgileri' },
    { id: 2, label: 'Adım 2', description: 'Ödeme Bilgileri' },
  ];

  return (
    <div className="flex justify-center items-center gap-3 sm:gap-4 mb-2 border-t py-5 sm:py-7">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-1 sm:gap-2">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
              currentStep >= step.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step.id}
          </div>
          <div className={`${currentStep >= step.id ? 'text-black' : 'text-gray-500'}`}>
            <p className="text-xs sm:text-sm font-medium">{step.label}</p>
            <p className="text-[10px] sm:text-xs">{step.description}</p>
          </div>
          {step.id < steps.length && (
            <div className="w-6 sm:w-10 h-0.5 bg-gray-200 mx-1 sm:mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;