import React from 'react';

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.number ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  currentStep >= step.number ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                  currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'
                }`} style={{ marginTop: '-20px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
