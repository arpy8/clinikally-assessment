import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Threads from "./bits/Threads";
import GradientText from "./bits/GradientText";

export default function HomePage() {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* Threads Background */}
      <div className="fixed inset-0 z-0">
        <Threads
          color={[1, 1, 1]}
          amplitude={1.2}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-screen bg-gradient-to-b from-blue-50/80 to-white/80 backdrop-blur-sm">
        <Navbar />

        {/* Hero Section - Full Screen */}
        <div className="h-[calc(100vh-64px)] flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8">
              Connect with Top
              <span className="block">
                <GradientText
                  colors={[
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                  ]}
                  animationSpeed={6}
                  showBorder={false}
                >
                  Dermatologists
                </GradientText>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              This is a demo application.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/doctors">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg"
                >
                  Browse Doctors
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg"
                >
                  Join as Doctor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}