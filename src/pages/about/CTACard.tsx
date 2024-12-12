import { Button, Image } from 'antd'
interface CTACardProps {
  title: string
  description: string
  buttonText: string
  imageSrc: string
  variant?: 'default' | 'primary'
}

export function CTACard({
  title,
  description,
  buttonText,
  imageSrc,
  variant = 'default'
}: CTACardProps) {
  return (
    <div className="border rounded-lg p-6 flex gap-6 items-center">
      <div className="space-y-4 flex-1">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <Button
          type={variant === 'primary' ? 'primary' : 'default'}
          size="large"
          className={variant === 'primary' ? 'bg-blue-600' : ''}
        >
          {buttonText}
        </Button>
      </div>
      <Image
        src={imageSrc}
        alt={title}
        width={300}
        height={200}
        className="rounded-lg w-1/3 object-cover"
      />
    </div>
  )
}

