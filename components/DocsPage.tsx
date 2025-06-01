import React from 'react';
import RoadmapSection from './docs/RoadmapSection';
import GettingStartedSection from './docs/GettingStartedSection';
import KeyComponentsSection from './docs/KeyComponentsSection';
import FutureFeaturesSection from './docs/FutureFeaturesSection';
import ForgeSystemWeaverSection from './docs/ForgeSystemWeaverSection'; // Added import

const DocsPage: React.FC = () => {
  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gpt-dark text-gpt-text">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Mia's Gem Chat Studio - Project Documentation</h1>

        <RoadmapSection />
        <GettingStartedSection />
        <KeyComponentsSection />
        <FutureFeaturesSection />
        <ForgeSystemWeaverSection /> {/* Added section */}
        
      </div>
    </div>
  );
};

export default DocsPage;
