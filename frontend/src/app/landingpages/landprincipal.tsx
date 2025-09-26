'use client';

import React, { Suspense } from 'react';
import { useLandingPage } from '../../hooks/useLandingPage';
import ErrorBoundary from '../../components/ErrorBoundary';
import { logger } from '../../utils/logger';
import { retryImport } from '../../utils/performance';
import { useAuth } from '../../contexts/AuthContext';
import TokenDisplay from '../../components/debug/TokenDisplay';
import '../../styles/landing.css';

// Code splitting with React.lazy and retry logic for better performance
const Header = React.lazy(() => retryImport(() => import('./Header')));
const Hero = React.lazy(() => retryImport(() => import('../../components/institutional/InstitutionalHero')));
const QuemSomos = React.lazy(() => retryImport(() => import('../../components/landing/QuemSomos')));
const Segments = React.lazy(() => retryImport(() => import('../../components/landing/Segments')));
const Technology = React.lazy(() => retryImport(() => import('../../components/landing/Technology')));
const WhyChooseVynlo = React.lazy(() => retryImport(() => import('../../components/landing/WhyChooseVynlo')));
const HowToHire = React.lazy(() => retryImport(() => import('../../components/landing/HowToHire')));
const FAQ = React.lazy(() => retryImport(() => import('../../components/support/TechnicalFAQ')));
const Footer = React.lazy(() => retryImport(() => import('./Footer')));

// Enhanced loading component with logging
const LoadingSpinner = React.memo(({ componentName }: { componentName?: string }) => {
  React.useEffect(() => {
    if (componentName) {
      logger.debug(`Loading component: ${componentName}`);
    }
  }, [componentName]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
});

// Enhanced Suspense wrapper with error recovery
const SuspenseWrapper: React.FC<{ 
  children: React.ReactNode; 
  componentName: string;
}> = ({ children, componentName }) => {
  React.useEffect(() => {
    logger.debug(`Iniciando carregamento: ${componentName}`);
    const startTime = performance.now();

    return () => {
      const loadTime = performance.now() - startTime;
      logger.performanceMetric(`${componentName}_load_time`, loadTime);
    };
  }, [componentName]);

  return (
    <Suspense fallback={<LoadingSpinner componentName={componentName} />}>
      {children}
    </Suspense>
  );
};

const LandingPrincipal: React.FC = () => {
  const {
    segmentContent,
    showSegmentTab,
    nextSegment,
    previousSegment,
    currentSegmentIndex
  } = useLandingPage();

  // Enhanced error handling and performance tracking
  const [componentErrors, setComponentErrors] = React.useState<Record<string, Error>>({});
  const mountTimeRef = React.useRef<number>(performance.now());

  // Component mount with performance tracking
  React.useEffect(() => {
    try {
      const mountTime = performance.now() - mountTimeRef.current;
      logger.componentMount('LandingPrincipal');
      logger.performanceMetric('LandingPrincipal_mount_time', mountTime);
      logger.info('LandingPrincipal initialized successfully', {
        segmentContentAvailable: !!segmentContent,
        currentSegmentIndex,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erro crítico ao montar LandingPrincipal', error as Error, {
        segmentContent: !!segmentContent,
        currentSegmentIndex
      });
      setComponentErrors(prev => ({ ...prev, main: error as Error }));
    }

    return () => {
      try {
        logger.componentUnmount('LandingPrincipal');
      } catch (error) {
        logger.error('Erro durante cleanup do LandingPrincipal', error as Error);
      }
    };
  }, [segmentContent, currentSegmentIndex]);

  // Track segment changes
  React.useEffect(() => {
    if (segmentContent) {
      logger.userInteraction('segment_change', `segment_${currentSegmentIndex}`);
      logger.info('Segment content updated', {
        segmentIndex: currentSegmentIndex,
        hasContent: !!segmentContent
      });
    }
  }, [segmentContent, currentSegmentIndex]);

  return (
    <ErrorBoundary>
      <div>
        <SuspenseWrapper componentName="Header">
          <Header />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="Hero">
          <Hero />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="QuemSomos">
          <QuemSomos />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="Segments">
          <Segments 
            segmentContent={segmentContent}
            showSegmentTab={showSegmentTab}
            nextSegment={nextSegment}
            previousSegment={previousSegment}
            currentSegmentIndex={currentSegmentIndex}
          />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="Technology">
          <Technology />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="WhyChooseVynlo">
          <WhyChooseVynlo />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="HowToHire">
          <HowToHire />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="FAQ">
          <FAQ />
        </SuspenseWrapper>
        
        <SuspenseWrapper componentName="Footer">
          <Footer />
        </SuspenseWrapper>
        
        {/* Componente temporário para debug - remover em produção */}
        <TokenDisplay />
      </div>
    </ErrorBoundary>
  );
};

// Memoize the main component to prevent unnecessary re-renders
export default React.memo(LandingPrincipal);