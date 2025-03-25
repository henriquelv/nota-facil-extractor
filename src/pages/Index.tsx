
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
