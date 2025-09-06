# 🧪 Sistema de Teste de Webhooks - Máquinas de Cartão

## 📋 Visão Geral

Este sistema permite testar a integração com máquinas de cartão **antes** de conectar a máquina real. Você pode simular transações e ver como o sistema processa os webhooks em tempo real.

## 🚀 Como Usar

### 1. Acesse o Dashboard
- Vá para **Pagamentos** no menu lateral
- Role até a seção **"Teste de Webhooks"**

### 2. Configure a Simulação
- **Provedor**: Escolha entre Stone, Cielo, Rede, PagSeguro ou PIX
- **Método**: Cartão de crédito, débito, PIX ou dinheiro
- **Valor**: Digite o valor da transação (ex: 45.90)
- **Status**: Aprovado, recusado ou pendente
- **Marca do Cartão**: Visa, Mastercard, etc.

### 3. Execute o Teste
- Clique em **"Simular Transação"**
- Aguarde o processamento
- Veja o resultado em tempo real

## 🔍 O Que o Sistema Faz

### ✅ Processamento Automático
1. **Recebe** dados simulados da "máquina"
2. **Valida** as informações
3. **Processa** a transação
4. **Responde** com status
5. **Atualiza** o histórico

### 📊 Resultados em Tempo Real
- **Status**: Sucesso, erro ou atenção
- **ID da Transação**: Identificador único
- **Tempo de Resposta**: Velocidade do processamento
- **Detalhes**: Resposta completa do sistema

## 🎯 Casos de Teste Recomendados

### Teste Básico
```
Provedor: Stone
Método: Cartão de Crédito
Valor: 45.90
Status: Aprovado
Marca: Visa
```

### Teste de Erro
```
Provedor: Cielo
Método: Cartão de Débito
Valor: 100.00
Status: Recusado
Marca: Mastercard
```

### Teste PIX
```
Provedor: PIX
Método: PIX
Valor: 25.50
Status: Aprovado
Marca: N/A
```

### Teste Sicred
```
Provedor: Sicred
Método: Cartão de Crédito
Valor: 75.00
Status: Aprovado
Marca: Mastercard
```

## 🔧 URLs de Teste Disponíveis

### Endpoints Principais
- **Stone**: `/api/webhooks/payment/stone`
- **Cielo**: `/api/webhooks/payment/cielo`
- **Rede**: `/api/webhooks/payment/rede`
- **PagSeguro**: `/api/webhooks/payment/pagseguro`
- **Sicred**: `/api/webhooks/payment/sicred`
- **PIX**: `/api/webhooks/payment/pix`

### Endpoint Genérico
- **Qualquer Provedor**: `/api/webhooks/payment/provider/{nome}`

### Endpoints de Verificação
- **Health Check**: `/api/webhooks/payment/health`
- **Teste**: `/api/webhooks/payment/test`

## 📱 Como Funciona no Backend

### 1. Recebimento do Webhook
```json
{
  "transaction_id": "TXN-123456",
  "provider": "stone",
  "status": "approved",
  "method": "credit_card",
  "amount": 45.90,
  "card_brand": "visa"
}
```

### 2. Processamento Automático
- ✅ Validação dos dados
- ✅ Criação/atualização da máquina
- ✅ Processamento da transação
- ✅ Atualização do banco de dados
- ✅ Resposta para a máquina

### 3. Resposta do Sistema
```json
{
  "status": "success",
  "message": "Transação processada com sucesso",
  "transactionId": "TXN-123456",
  "processed": true
}
```

## 🎨 Interface do Usuário

### Simulador de Transação
- **Formulário completo** com todos os campos
- **Validação em tempo real** dos dados
- **Botão de teste** com indicador de processamento
- **Feedback visual** durante a execução

### Resultado do Teste
- **Status colorido** (verde = sucesso, vermelho = erro)
- **Informações detalhadas** da transação
- **Tempo de resposta** em milissegundos
- **Detalhes técnicos** da resposta

### Histórico de Testes
- **Últimos 5 testes** executados
- **Cores por status** para fácil identificação
- **Informações resumidas** de cada teste
- **Botão para limpar** o histórico

## 🚨 Solução de Problemas

### Erro de Conexão
- **Verifique** se o backend está rodando
- **Confirme** se as URLs estão corretas
- **Teste** o endpoint de health check

### Transação Não Processada
- **Valide** os dados obrigatórios
- **Verifique** o formato dos valores
- **Confirme** se o provedor é suportado

### Resposta Lenta
- **Aguarde** o processamento completo
- **Verifique** a conexão com o banco
- **Monitore** os logs do sistema

## 🔄 Próximos Passos

### 1. Teste Completo
- Execute **todos os cenários** de teste
- **Valide** as respostas do sistema
- **Confirme** o funcionamento dos webhooks

### 2. Configuração da Máquina Real
- **Configure** a máquina com as URLs corretas
- **Teste** com uma transação real pequena
- **Monitore** o processamento no dashboard

### 3. Monitoramento Contínuo
- **Acompanhe** as transações em tempo real
- **Verifique** os logs do sistema
- **Monitore** o status das máquinas

## 💡 Dicas Importantes

### Para Desenvolvedores
- **Use o console** para ver logs detalhados
- **Monitore** as requisições no Network tab
- **Verifique** as respostas do backend

### Para Usuários Finais
- **Teste sempre** antes de usar em produção
- **Comece** com valores pequenos
- **Monitore** o dashboard durante os testes

### Para Administradores
- **Configure** as URLs corretas
- **Monitore** o status das integrações
- **Verifique** os logs de erro

## 🎉 Resultado Esperado

Após os testes bem-sucedidos, você terá:
- ✅ **Sistema funcionando** perfeitamente
- ✅ **Webhooks processando** transações
- ✅ **Dashboard atualizando** em tempo real
- ✅ **Confiança** para conectar a máquina real
- ✅ **Conhecimento** de como funciona a integração

---

**🎯 Agora você pode testar a integração completa antes de conectar a máquina real!**
