import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-violet-600">Rumered</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate platform for college students to showcase their style
            and dorm room setups. Vote on outfits and room tours, and get
            inspired by your peers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fit-check">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Fit Check
              </Button>
            </Link>
            <Link href="/rooms">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Dorm Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-violet-600">Fit Check</CardTitle>
                <CardDescription>
                  Discover amazing outfits from college students around the
                  world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Browse curated outfit collections</li>
                  <li>• Vote on aestheticness, cleanliness, and creativity</li>
                  <li>• Get inspired by the latest trends</li>
                  <li>• See what&apos;s trending on campus</li>
                </ul>
                <div className="mt-6">
                  <Link href="/fit-check">
                    <Button className="w-full">Start Voting</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-violet-600">
                  Dorm Room Tours
                </CardTitle>
                <CardDescription>
                  Explore incredible dorm room setups and get decorating ideas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• View stunning dorm room transformations</li>
                  <li>• Vote on room aesthetics and creativity</li>
                  <li>• Apply to feature your own room</li>
                  <li>• Find inspiration for your space</li>
                </ul>
                <div className="mt-6">
                  <Link href="/rooms">
                    <Button className="w-full">Explore Rooms</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-violet-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of college students sharing their style and room
            setups. Create an account to start voting and submitting your own
            content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
