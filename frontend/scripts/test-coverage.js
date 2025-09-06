#!/usr/bin/env node

/**
 * Script para executar testes com cobertura e gerar relatórios
 * Executa Jest com configurações de cobertura e gera relatórios detalhados
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configurações de cobertura
const coverageConfig = {
  // Limites mínimos de cobertura
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Diretórios e arquivos para incluir na cobertura
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/test-utils.tsx'
  ],
  
  // Formatos de relatório
  coverageReporters: ['text', 'text-summary', 'lcov', 'html', 'json'],
  
  // Diretório de saída
  coverageDirectory: 'coverage'
}

// Função para executar testes com cobertura
function runTestsWithCoverage() {
  console.log('🧪 Executando testes com análise de cobertura...\n')
  
  try {
    // Comando Jest com configurações de cobertura
    const jestCommand = [
      'npx jest',
      '--coverage',
      '--ci',
      '--watchAll=false',
      '--passWithNoTests',
      `--coverageThreshold='${JSON.stringify(coverageConfig.thresholds)}'`,
      `--collectCoverageFrom='${coverageConfig.collectCoverageFrom.join("' --collectCoverageFrom='")}'`,
      `--coverageReporters=${coverageConfig.coverageReporters.join(' --coverageReporters=')}`,
      `--coverageDirectory=${coverageConfig.coverageDirectory}`
    ].join(' ')
    
    // Executar testes
    execSync(jestCommand, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    console.log('\n✅ Testes executados com sucesso!')
    
    // Gerar relatório resumido
    generateSummaryReport()
    
  } catch (error) {
    console.error('\n❌ Falha na execução dos testes:')
    console.error(error.message)
    
    // Ainda assim, tentar gerar relatório se houver dados
    try {
      generateSummaryReport()
    } catch (reportError) {
      console.error('Erro ao gerar relatório:', reportError.message)
    }
    
    process.exit(1)
  }
}

// Função para gerar relatório resumido
function generateSummaryReport() {
  const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json')
  
  if (!fs.existsSync(coveragePath)) {
    console.log('📊 Arquivo de cobertura não encontrado')
    return
  }
  
  try {
    const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
    const total = coverageData.total
    
    console.log('\n📊 Resumo da Cobertura de Testes:')
    console.log('=====================================')
    console.log(`📈 Linhas:      ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})`)
    console.log(`🔀 Branches:    ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})`)
    console.log(`⚡ Funções:     ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})`)
    console.log(`📝 Statements:  ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})`)
    
    // Verificar se atende aos limites mínimos
    const meetsThreshold = (
      total.lines.pct >= coverageConfig.thresholds.global.lines &&
      total.branches.pct >= coverageConfig.thresholds.global.branches &&
      total.functions.pct >= coverageConfig.thresholds.global.functions &&
      total.statements.pct >= coverageConfig.thresholds.global.statements
    )
    
    if (meetsThreshold) {
      console.log('\n✅ Cobertura atende aos limites mínimos!')
    } else {
      console.log('\n⚠️  Cobertura abaixo dos limites mínimos:')
      console.log(`   Mínimo: ${coverageConfig.thresholds.global.lines}% para todas as métricas`)
    }
    
    // Gerar relatório detalhado por arquivo
    generateDetailedReport(coverageData)
    
    // Informações sobre relatórios gerados
    console.log('\n📁 Relatórios gerados:')
    console.log(`   📄 HTML: coverage/lcov-report/index.html`)
    console.log(`   📊 JSON: coverage/coverage-final.json`)
    console.log(`   📈 LCOV: coverage/lcov.info`)
    
  } catch (error) {
    console.error('Erro ao processar dados de cobertura:', error.message)
  }
}

// Função para gerar relatório detalhado por arquivo
function generateDetailedReport(coverageData) {
  console.log('\n📋 Cobertura por Componente:')
  console.log('============================')
  
  // Filtrar apenas arquivos de componentes
  const componentFiles = Object.keys(coverageData)
    .filter(file => file.includes('/components/') && file.endsWith('.tsx'))
    .sort()
  
  if (componentFiles.length === 0) {
    console.log('   Nenhum componente testado encontrado')
    return
  }
  
  componentFiles.forEach(file => {
    const data = coverageData[file]
    const fileName = path.basename(file, '.tsx')
    const linesPct = data.lines?.pct || 0
    
    // Emoji baseado na cobertura
    let emoji = '🔴' // < 50%
    if (linesPct >= 90) emoji = '🟢' // >= 90%
    else if (linesPct >= 70) emoji = '🟡' // 70-89%
    else if (linesPct >= 50) emoji = '🟠' // 50-69%
    
    console.log(`   ${emoji} ${fileName.padEnd(20)} ${linesPct}%`)
  })
}

// Função para executar testes específicos
function runSpecificTests(pattern) {
  console.log(`🎯 Executando testes para: ${pattern}\n`)
  
  try {
    const jestCommand = `npx jest --coverage --testNamePattern="${pattern}"`
    
    execSync(jestCommand, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    console.log('\n✅ Testes específicos executados com sucesso!')
    
  } catch (error) {
    console.error('\n❌ Falha na execução dos testes específicos:')
    console.error(error.message)
    process.exit(1)
  }
}

// Função para executar testes em modo watch
function runWatchMode() {
  console.log('👀 Executando testes em modo watch...\n')
  
  try {
    const jestCommand = 'npx jest --watch --coverage'
    
    execSync(jestCommand, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
  } catch (error) {
    console.error('\n❌ Erro no modo watch:')
    console.error(error.message)
    process.exit(1)
  }
}

// Processar argumentos da linha de comando
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'watch':
    runWatchMode()
    break
  case 'specific':
    const pattern = args[1]
    if (!pattern) {
      console.error('❌ Padrão de teste não fornecido')
      console.log('Uso: node test-coverage.js specific "nome-do-teste"')
      process.exit(1)
    }
    runSpecificTests(pattern)
    break
  case 'help':
    console.log('📚 Comandos disponíveis:')
    console.log('  node test-coverage.js          - Executar todos os testes com cobertura')
    console.log('  node test-coverage.js watch    - Executar em modo watch')
    console.log('  node test-coverage.js specific "pattern" - Executar testes específicos')
    console.log('  node test-coverage.js help     - Mostrar esta ajuda')
    break
  default:
    runTestsWithCoverage()
    break
}

module.exports = {
  runTestsWithCoverage,
  generateSummaryReport,
  runSpecificTests,
  runWatchMode
}