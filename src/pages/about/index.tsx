import { Image, Rate } from 'antd'
import { UserIcon as UserGroupIcon, BuildingIcon as BuildingOfficeIcon, BriefcaseIcon } from 'lucide-react'
import { CTACard } from './CTACard'
import { StatsCard } from './StatsCard'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">Who we are</span>
            <h1 className="text-4xl font-bold">
              We're highly skilled and professionals team.
            </h1>
            <p className="text-gray-600">
              Praesent non sem facilisis, hendrerit nisi vitae, vivamus quam. Aliquam
              metus elit, ultrices eu justo sed, dignissim tristique metus. Vestibulum
              maximus nec ante eget maximus.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatsCard
              icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />}
              number="175,324"
              label="Live Job"
            />
            <StatsCard
              icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600" />}
              number="97,354"
              label="Công ty"
            />
            <StatsCard
              icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />}
              number="38,47,154"
              label="Candidates"
            />
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="container mx-auto px-4 py-12 border-y">
        <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
          {['amazon', 'google', 'enigma', 'nio', 'ieee'].map((logo) => (
            <Image
              key={logo}
              src={`/placeholder.svg?height=40&width=120`}
              alt={logo}
              width={120}
              height={40}
              className="h-8 object-contain"
            />
          ))}
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <Image
                src={`/placeholder.svg?height=300&width=400`}
                alt={`Team member ${index}`}
                width={400}
                height={300}
                className="w-full h-[300px] object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">Our mission</span>
            <h2 className="text-3xl font-bold">
              Our mission is help people to find the perfect job.
            </h2>
            <p className="text-gray-600">
              Praesent non sem facilisis, hendrerit nisi vitae, vivamus quam. Aliquam
              metus elit, ultrices eu justo sed, dignissim tristique metus. Vestibulum
              maximus nec ante eget maximus.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Mission illustration"
              width={500}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Image
            src="/placeholder.svg?height=400&width=500"
            alt="Testimonial"
            width={500}
            height={400}
            className="rounded-lg object-cover"
          />
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">Testimonial</span>
            <h2 className="text-3xl font-bold">What our people says</h2>
            <Rate defaultValue={5} disabled className="text-blue-600" />
            <blockquote className="text-gray-600 italic">
              "Curabitur non tortor nisi. Mauris quis vehicula elit, sed commodo
              ipsum. Praesent tempor orci at dolor elementum, ut vestibulum felis
              commodo. Integer facilisis portitor vehicula. Maecenas venenatis dictum
              ligula. Quis vitae ultrices efficitur anteullam."
            </blockquote>
            <div className="font-medium">
              <p className="text-gray-900">John Wick</p>
              <p className="text-gray-500">Senior Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <CTACard
            title="Become a Ứng Viên"
            description="Find the most exciting jobs from top employers. Register now!"
            buttonText="Register Now"
            imageSrc="/placeholder.svg?height=200&width=300"
          />
          <CTACard
            title="Become a Employer"
            description="Find the best talents for your company. Register now!"
            buttonText="Register Now"
            imageSrc="/placeholder.svg?height=200&width=300"
            variant="primary"
          />
        </div>
      </section>
    </main>
  )
}

