'use client';

import React, { Suspense } from 'react';
import { useLandingPage } from '../../hooks/useLandingPage';
import ErrorBoundary from '../../components/ErrorBoundary';
import { logger } from '../../utils/logger';
import '../../styles/landing.css';

// Code splitting with React.lazy for better performance
const Header = React.lazy(() => import('./Header'));
const Hero = React.lazy(() => import('../../components/landing/Hero'));
const QuemSomos = React.lazy(() => import('../../components/landing/QuemSomos'));
const Segments = React.lazy(() => import('../../components/landing/Segments'));
const Technology = React.lazy(() => import('../../components/landing/Technology'));
const WhyChooseVynlo = React.lazy(() => import('../../components/landing/WhyChooseVynlo'));
const HowToHire = React.lazy(() => import('../../components/landing/HowToHire'));
const FAQ = React.lazy(() => import('../../components/landing/FAQ'));
const Footer = React.lazy(() => import('./Footer'));

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const LandingPrincipal: React.FC = () => {
  const {
    segmentContent,
    showSegmentTab,
    nextSegment,
    previousSegment,
    currentSegmentIndex
  } = useLandingPage();

  React.useEffect(() => {
    try {
      logger.componentMount('LandingPrincipal');
    } catch (error) {
      logger.error('Erro ao montar LandingPrincipal', error as Error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Header />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Hero />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <QuemSomos />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Segments 
              segmentContent={segmentContent}
              showSegmentTab={showSegmentTab}
              nextSegment={nextSegment}
              previousSegment={previousSegment}
              currentSegmentIndex={currentSegmentIndex}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Technology />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <WhyChooseVynlo />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <HowToHire />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <FAQ />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default LandingPrincipal;