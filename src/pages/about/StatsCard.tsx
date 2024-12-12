interface StatsCardProps {
    icon: React.ReactNode
    number: string
    label: string
  }
  
  export function StatsCard({ icon, number, label }: StatsCardProps) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <div className="text-2xl font-bold">{number}</div>
        <div className="text-gray-600 text-sm">{label}</div>
      </div>
    )
  }
  
  