#!/usr/bin/env node

/**
 * Script para verificar acessibilidade usando Lighthouse
 * Executa testes de acessibilidade nos componentes do dashboard
 */

let cachedLighthouse;
let cachedChromeLauncher;

const loadDependencies = async () => {
  if (!cachedLighthouse) {
    const lighthouseModule = await import('lighthouse');
    cachedLighthouse = lighthouseModule.default ?? lighthouseModule;
  }

  if (!cachedChromeLauncher) {
    const chromeModule = await import('chrome-launcher');
    cachedChromeLauncher = chromeModule.default ?? chromeModule;
  }
};

const getLighthouse = async () => {
  await loadDependencies();
  return cachedLighthouse;
};

const getChromeLauncher = async () => {
  await loadDependencies();
  return cachedChromeLauncher;
};

// Configuração do Lighthouse focada em acessibilidade
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['accessibility'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    }
  }
};

// URLs para testar (assumindo que o servidor de desenvolvimento está rodando)
const urlsToTest = [
  {
    name: 'Dashboard Principal',
    url: 'http://localhost:3000/dashboard',
    description: 'Página principal do dashboard com sidebar e header'
  },
  {
    name: 'Configurações do Sistema',
    url: 'http://localhost:3000/dashboard/settings',
    description: 'Página de configurações com modais e toggles'
  }
];

async function runLighthouse(url, options = {}) {
  const chromeLauncher = await getChromeLauncher();
  const lighthouse = await getLighthouse();

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });
  
  options.port = chrome.port;
  
  try {
    const runnerResult = await lighthouse(url, options, lighthouseConfig);
    await chrome.kill();
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

async function generateAccessibilityReport() {
  console.log('🚀 Iniciando verificação de acessibilidade com Lighthouse...\n');
  
  const results = [];
  
  for (const testCase of urlsToTest) {
    console.log(`📊 Testando: ${testCase.name}`);
    console.log(`🔗 URL: ${testCase.url}`);
    
    try {
      const result = await runLighthouse(testCase.url);
      const accessibilityScore = result.lhr.categories.accessibility.score * 100;
      
      console.log(`✅ Score de Acessibilidade: ${accessibilityScore}/100\n`);
      
      results.push({
        ...testCase,
        score: accessibilityScore,
        audits: result.lhr.audits,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`❌ Erro ao testar ${testCase.name}:`, error.message);
      results.push({
        ...testCase,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Gerar relatório consolidado
  const consolidatedReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      averageScore: results.filter(r => r.score).reduce((acc, r) => acc + r.score, 0) / results.filter(r => r.score).length || 0,
      passedTests: results.filter(r => r.score >= 90).length,
      failedTests: results.filter(r => r.score < 90 || r.error).length
    },
    results: results
  };
  
  console.log('📋 Relatório de Acessibilidade:');
  console.log(`📊 Score Médio: ${consolidatedReport.summary.averageScore.toFixed(1)}/100`);
  console.log(`✅ Testes Aprovados: ${consolidatedReport.summary.passedTests}/${consolidatedReport.summary.totalTests}`);
  console.log(`❌ Testes Reprovados: ${consolidatedReport.summary.failedTests}/${consolidatedReport.summary.totalTests}\n`);
  
  return consolidatedReport;
}

// Executar se chamado diretamente
if (require.main === module) {
  generateAccessibilityReport()
    .then(() => {
      console.log('✅ Verificação de acessibilidade concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na verificação:', error);
      process.exit(1);
    });
}

module.exports = { generateAccessibilityReport };