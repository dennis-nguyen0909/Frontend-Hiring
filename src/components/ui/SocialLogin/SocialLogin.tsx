import { Github, Chrome } from 'lucide-react'
import { Button, Card } from 'antd'

interface OAuthProvider {
  name: string
  icon: React.ReactNode
  enabled: boolean
}

export default function SocialLogin() {
  const providers: OAuthProvider[] = [
    {
      name: "Google",
      icon: <Chrome className="h-5 w-5" />,
      enabled: true,
    },
    {
      name: "Github",
      icon: <Github className="h-5 w-5" />,
      enabled: true,
    },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div>
        <div className="text-3xl font-bold">Social Login</div>
        <p className="text-lg text-muted-foreground mt-2">
          You can log into your Tiny account using these third-party services. To
          connect your account, use the corresponding social login button when
          logging in.
        </p>
      </div>
      <div className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">OAuth Provider</h2>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="flex items-center justify-between bg-background p-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {provider.icon}
                  <span className="text-lg font-medium">{provider.name}</span>
                  <span className="text-emerald-500 ml-4">Enabled</span>
                </div>
                <Button
                  variant="link"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Manage Permissions
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

