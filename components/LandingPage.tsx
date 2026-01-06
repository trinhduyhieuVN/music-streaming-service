"use client";

import { useRouter } from "next/navigation";
import { HiPlay, HiHeart, HiMusicalNote, HiSparkles } from "react-icons/hi2";
import { BsDiscord, BsGithub, BsTwitter } from "react-icons/bs";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

const LandingPage = () => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const handleGetStarted = () => {
    if (user) {
      router.push('/');
    } else {
      authModal.onOpen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-black to-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-x-2">
            <HiMusicalNote size={32} className="text-green-500" />
            <h1 className="text-2xl font-bold text-white">MusicStream</h1>
          </div>
          <div className="flex items-center gap-x-4">
            {!user ? (
              <>
                <button
                  onClick={() => authModal.onOpen()}
                  className="text-neutral-300 hover:text-white transition px-4 py-2"
                >
                  Log in
                </button>
                <button
                  onClick={() => authModal.onOpen()}
                  className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
                >
                  Sign up
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/')}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition"
              >
                Open App
              </button>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Music for everyone.
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Millions of songs. No credit card needed.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-400 hover:scale-105 transition transform animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Why you'll love it
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl hover:bg-neutral-800 transition group">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <HiPlay size={24} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Play everywhere
            </h3>
            <p className="text-neutral-300">
              Listen on your phone, tablet, computer, and more. Your music follows you everywhere.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl hover:bg-neutral-800 transition group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <HiHeart size={24} className="text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Your favorites
            </h3>
            <p className="text-neutral-300">
              Create playlists, like songs, and discover new music tailored to your taste.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl hover:bg-neutral-800 transition group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <HiSparkles size={24} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Premium quality
            </h3>
            <p className="text-neutral-300">
              Experience high-quality audio streaming with our premium subscription plans.
            </p>
          </div>
        </div>
      </div>

      {/* Premium Section */}
      <div className="bg-gradient-to-r from-purple-900/20 to-green-900/20 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Go Premium
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Unlock unlimited skips, offline listening, and ad-free experience.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* Monthly Plan */}
            <div className="bg-neutral-800 p-8 rounded-2xl w-full md:w-80 hover:scale-105 transition">
              <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-white mb-1">
                59,000 ₫
              </div>
              <p className="text-neutral-400 mb-6">per month</p>
              <button
                onClick={handleGetStarted}
                className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-neutral-200 transition"
              >
                Get Premium
              </button>
            </div>

            {/* Yearly Plan */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl w-full md:w-80 hover:scale-105 transition relative">
              <div className="absolute -top-3 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Yearly</h3>
              <div className="text-4xl font-bold text-white mb-1">
                590,000 ₫
              </div>
              <p className="text-white/80 mb-6">per year (2 months free)</p>
              <button
                onClick={handleGetStarted}
                className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-neutral-200 transition"
              >
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-x-2 mb-4">
                <HiMusicalNote size={24} className="text-green-500" />
                <h3 className="text-white font-bold text-lg">MusicStream</h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Your ultimate music streaming platform
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li className="hover:text-white cursor-pointer transition">About</li>
                <li className="hover:text-white cursor-pointer transition">Jobs</li>
                <li className="hover:text-white cursor-pointer transition">Press</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li className="hover:text-white cursor-pointer transition">Help Center</li>
                <li className="hover:text-white cursor-pointer transition">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition">Privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-x-4">
                <BsDiscord size={20} className="text-neutral-400 hover:text-white cursor-pointer transition" />
                <BsGithub size={20} className="text-neutral-400 hover:text-white cursor-pointer transition" />
                <BsTwitter size={20} className="text-neutral-400 hover:text-white cursor-pointer transition" />
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400 text-sm">
            <p>&copy; 2026 MusicStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
