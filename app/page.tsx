import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Sparkles,
  BarChart3,
  Brain,
  Send,
  Home,
  Calendar,
  Goal,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  CheckCircle2,
  ListChecks,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-white">
      <header className="sticky top-0 z-40 w-full justify-center items-center border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C5CFC]">
              <span className="text-lg font-bold text-white">K</span>
            </div>
            <span className="text-xl font-bold tracking-tight">KALANA</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-[#7C5CFC] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-[#7C5CFC] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-[#7C5CFC] transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-medium hover:text-[#7C5CFC] transition-colors"
            >
              Login
            </Link>
            <Button className="bg-[#7C5CFC] hover:bg-[#6A4AE8] text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-12 md:py-10 lg:py-8 items-start">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
                Turn Your Goals Into Action with{" "}
                <span className="text-[#7C5CFC]">AI</span>
              </h1>
              <p className="text-lg text-gray-600 md:text-xl/relaxed">
                Our smart assistant helps you plan, refine, and achieve your
                goals step by step.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-[#7C5CFC] hover:bg-[#6A4AE8] text-white"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#7C5CFC] text-[#7C5CFC] hover:bg-[#7C5CFC]/10"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex -space-x-1">
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-[#7C5CFC]"></div>
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-[#7C5CFC]/80"></div>
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-[#7C5CFC]/60"></div>
                </div>
                <div>Joined by 10k+ users</div>
              </div>
            </div>
            <div className="relative mx-auto lg:ml-auto">
              <div className="relative rounded-xl border bg-white shadow-xl overflow-hidden">
                <div className="flex">
                  {/* Sidebar mockup */}
                  <div className="hidden md:block w-[240px] bg-white border-r p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C5CFC]">
                        <span className="text-lg font-bold text-white">K</span>
                      </div>
                      <div>
                        <div className="font-bold">KALANA</div>
                        <div className="text-xs text-gray-500">
                          AI Generate Schedule
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#7C5CFC]/10 text-[#7C5CFC]">
                      <Home size={18} />
                      <span className="font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                      <CalendarDays size={18} />
                      <span>Scheduler</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                      <Goal size={18} />
                      <span>Goals</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                      <Calendar size={18} />
                      <span>Calendar</span>
                    </div>
                  </div>

                  {/* Main content mockup */}
                  <div className="flex-1 p-4">
                    <div className="text-center space-y-2 py-8">
                      <h2 className="text-2xl font-bold">Hi There, User!</h2>
                      <p className="text-xl font-bold">
                        What Can I Help You Today? ✨
                      </p>
                      <p className="text-gray-600">
                        Setup your productivity with Kalana 😊
                      </p>
                    </div>

                    <div className="text-center mb-4">
                      <p className="text-gray-600">
                        Here are suggestions for your goals based on your
                        previous activities
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="border rounded-md p-3 text-center hover:border-[#7C5CFC] cursor-pointer">
                        <div className="mb-2">🧘</div>
                        <div className="font-medium">Mindfulness Practice</div>
                      </div>
                      <div className="border rounded-md p-3 text-center hover:border-[#7C5CFC] cursor-pointer">
                        <div className="mb-2">🌱</div>
                        <div className="font-medium">Sustainable Lifestyle</div>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        className="w-full border rounded-md p-3 pr-12 resize-none"
                        rows={3}
                        placeholder="I want to..."
                      ></textarea>
                      <button className="absolute right-3 bottom-3 bg-[#7C5CFC] text-white p-2 rounded-md">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-12 md:py-24 bg-gray-50">
          <div className="mx-auto text-center md:max-w-[58rem] mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
              Features that power your goals
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our AI-powered platform helps you turn ambitions into achievements
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Smart Goal Structuring</h3>
              <p className="mt-2 text-gray-600">
                AI breaks down your ideas into actionable steps that make sense
                for your schedule.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Time-Based Planning</h3>
              <p className="mt-2 text-gray-600">
                Set dates, deadlines, and get reminders that keep you on track
                toward your goals.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Personalized Suggestions</h3>
              <p className="mt-2 text-gray-600">
                Improve your goals with smart suggestions based on your habits
                and preferences.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Progress Tracker</h3>
              <p className="mt-2 text-gray-600">
                See how far you've come with visual progress indicators that
                celebrate your achievements.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container py-12 md:py-24">
          <div className="mx-auto text-center md:max-w-[58rem] mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to transform your goals into reality
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Describe your goal</h3>
                <p className="mt-2 text-gray-600">
                  Tell our AI what you want to achieve, whether it's personal,
                  professional, or anything in between.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 right-0 w-24 h-4">
                <ArrowRight className="w-24 h-4 text-[#7C5CFC]/30" />
              </div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">AI assists with planning</h3>
                <p className="mt-2 text-gray-600">
                  Our AI breaks down your goal into manageable steps and
                  suggests the best timeline for completion.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 right-0 w-24 h-4">
                <ArrowRight className="w-24 h-4 text-[#7C5CFC]/30" />
              </div>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Follow your roadmap</h3>
              <p className="mt-2 text-gray-600">
                Track your progress, get reminders, and adjust your plan as
                needed to stay on course to success.
              </p>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative max-w-2xl rounded-xl border bg-white shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFC]">
                    <ListChecks className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Learn Spanish in 6 months
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created by AI • 12 steps • 70% complete
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium line-through text-gray-500">
                        Set up Duolingo account and complete assessment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium line-through text-gray-500">
                        Complete first 10 lessons (basic greetings)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-[#7C5CFC] flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium">
                        Practice with language exchange partner (30 min)
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-[#7C5CFC] h-1.5 rounded-full"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-600">
                        Watch one Spanish movie with subtitles
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-600">
                        Learn 50 common food vocabulary words
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 md:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-[#7C5CFC] px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20">
            <div className="relative z-10 max-w-3xl text-white">
              <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
                Ready to achieve your goals?
              </h2>
              <p className="mt-4 text-lg text-white/90 md:text-xl">
                Join thousands of users who are turning their aspirations into
                achievements with our AI assistant.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-[#7C5CFC] hover:bg-white/90"
                >
                  Start Planning
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/10"></div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CFC]">
                  <span className="text-sm font-bold text-white">K</span>
                </div>
                <span className="font-bold">KALANA</span>
              </div>
              <p className="text-sm text-gray-500">
                Making goal achievement smarter since 2023.
              </p>
              <div className="mt-4 flex gap-4">
                <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-500 hover:text-[#7C5CFC]"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-gray-500 hover:text-[#7C5CFC]"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Download
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-[#7C5CFC]">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} KALANA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
