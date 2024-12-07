

import * as React from "react"

interface Step {
  id: string
  label: string
  icon: React.ElementType
}

interface ProgressStepperProps {
  steps: any[]
  activeStep: any
  className?: any
}

export default function ProgressStepper({ steps, activeStep, className }: ProgressStepperProps) {
  // Calculate progress percentage
  const progress = (activeStep / (steps.length - 1)) * 100

  return (
    <div className={"w-full max-w-4xl mx-auto py-8 px-4"}>
      <div className="relative flex justify-between items-center px-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center z-10"
            style={{ width: `${100 / steps.length}%` }}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center mb-3 text-base",
                index <= activeStep
                  ? "bg-primaryColor text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "text-sm text-center",
                index <= activeStep ? "text-primaryColor" : "text-gray-500"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
        
        {/* Background line */}
        <div className="absolute top-3 left-[10%] right-[10%] h-[3px] bg-gray-200 -z-0" />
        
        {/* Progress line */}
        <div 
          className="h-full bg-primaryColor transition-all duration-300" 
          style={{ 
            width: `${progress}%`,
            position: 'absolute',
            top: '0.75rem',
            left: '10%',
            height: '3px',
            zIndex: -1,
          }} 
        />
      </div>
    </div>
  )
}

// Example usage
export function Example() {
  const [activeStep, setActiveStep] = React.useState(3)
  
  const steps = [
    { id: "company", label: "Company Info", icon: null },
    { id: "founding", label: "Founding Info", icon: null },
    { id: "social", label: "Social Media Profile", icon: null },
    { id: "contact", label: "Contact", icon: null },
    { id: "completed", label: "Completed", icon: null },
  ]

  return (
    <div className="w-full p-4">
      <ProgressStepper steps={steps} activeStep={activeStep} />
      
      {/* Demo controls */}
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-md hover:bg-red-50"
        >
          Previous Step
        </button>
        <button
          onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}

