'use client'

import { useState, useEffect } from 'react'
import { 
  Package, Plus, Edit, Trash2, Eye, Settings, 
  TrendingUp, AlertTriangle, CheckCircle, X, Save,
  Search, Filter, Download, Upload, BarChart3,
  PieChart, Target, Zap, Brain, Lightbulb
} from 'lucide-react'

export default function MenuManagement() {
  // Estados principais
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Hambúrguer Gourmet',
      category: 'Lanches',
      price: 28.90,
      cost: 12.50,
      stock: 45,
      minStock: 10,
      status: 'active',
      description: 'Hambúrguer artesanal com queijo, alface e tomate',
      image: null,
      sales: 156,
      revenue: 4508.40,
      aiPrediction: 'Alta demanda - Reabastecer estoque'
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      category: 'Pizzas',
      price: 42.00,
      cost: 18.00,
      stock: 23,
      minStock: 15,
      status: 'active',
      description: 'Pizza tradicional com molho, mussarela e manjericão',
      image: null,
      sales: 89,
      revenue: 3738.00,
      aiPrediction: 'Demanda estável - Manter estoque atual'
    },
    {
      id: 3,
      name: 'Refrigerante Cola',
      category: 'Bebidas',
      price: 8.50,
      cost: 3.20,
      stock: 67,
      minStock: 20,
      status: 'active',
      description: 'Refrigerante cola 350ml',
      image: null,
      sales: 234,
      revenue: 1989.00,
      aiPrediction: 'Alta rotatividade - Aumentar estoque'
    }
  ])

  // Estados para funcionalidades
  const [showNewProduct, setShowNewProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Formulário para novo produto
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    description: ''
  })

  // Categorias disponíveis
  const categories = ['Lanches', 'Pizzas', 'Bebidas', 'Sobremesas', 'Acompanhamentos']

  // Função para adicionar novo produto
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simular criação
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newProduct = {
        id: products.length + 1,
        ...newProductForm,
        price: parseFloat(newProductForm.price),
        cost: parseFloat(newProductForm.cost),
        stock: parseInt(newProductForm.stock),
        minStock: parseInt(newProductForm.minStock),
        status: 'active',
        image: null,
        sales: 0,
        revenue: 0,
        aiPrediction: 'Novo produto - Monitorar demanda'
      }
      
      setProducts([...products, newProduct])
      alert('Produto cadastrado com sucesso!')
      
      // Limpar formulário
      setNewProductForm({
        name: '', category: '', price: '', cost: '', stock: '', minStock: '', description: ''
      })
      setShowNewProduct(false)
      
    } catch (error) {
      alert('Erro ao cadastrar produto')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para editar produto
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...newProductForm, price: parseFloat(newProductForm.price), cost: parseFloat(newProductForm.cost), stock: parseInt(newProductForm.stock), minStock: parseInt(newProductForm.minStock) }
          : p
      )
      
      setProducts(updatedProducts)
      alert('Produto atualizado com sucesso!')
      setShowEditProduct(false)
      setSelectedProduct(null)
      
    } catch (error) {
      alert('Erro ao atualizar produto')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para remover produto
  const removeProduct = (product: any) => {
    if (confirm(`Tem certeza que deseja remover ${product.name}?`)) {
      setProducts(products.filter(p => p.id !== product.id))
      alert('Produto removido com sucesso!')
    }
  }

  // Função para análise de IA
  const runAIAnalysis = async () => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular análise de IA
      const aiInsights = [
        'Hambúrguer Gourmet: Alta demanda - Reabastecer estoque',
        'Pizza Margherita: Demanda estável - Manter estoque atual',
        'Refrigerante Cola: Alta rotatividade - Aumentar estoque'
      ]
      
      alert('Análise de IA concluída! Verifique as recomendações.')
      setShowAIAnalysis(true)
      
    } catch (error) {
      alert('Erro na análise de IA')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para exportar cardápio
  const exportMenu = async (format: string) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert(`Cardápio exportado em ${format} com sucesso!`)
    } catch (error) {
      alert('Erro ao exportar cardápio')
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-manrope font-bold mb-3">Cardápio & Estoque</h1>
            <p className="text-green-200 font-manrope text-lg">Gestão inteligente de produtos com IA preditiva</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={runAIAnalysis}
              disabled={isLoading}
              className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 group"
            >
              <Brain className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-manrope font-medium">Análise de IA</span>
            </button>
            <button
              onClick={() => setShowNewProduct(true)}
              className="bg-white hover:bg-gray-100 text-green-700 px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-white/25"
            >
              <Plus className="w-5 h-4" />
              <span className="font-manrope font-medium">Novo Produto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => exportMenu('PDF')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3"
          >
            <Download className="w-4 h-4" />
            <span className="font-manrope font-medium">Exportar</span>
          </button>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-manrope font-bold text-gray-900">Produtos ({filteredProducts.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-manrope font-bold text-gray-900">{product.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="font-manrope">{product.category}</span>
                      <span className="font-manrope">Preço: R$ {product.price.toFixed(2)}</span>
                      <span className="font-manrope">Estoque: {product.stock}</span>
                      <span className={`font-manrope flex items-center space-x-1 ${
                        product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.stock <= product.minStock ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>{product.stock <= product.minStock ? 'Estoque Baixo' : 'OK'}</span>
                      </span>
                    </div>
                    
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800 font-medium">{product.aiPrediction}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setNewProductForm({
                        name: product.name,
                        category: product.category,
                        price: product.price.toString(),
                        cost: product.cost.toString(),
                        stock: product.stock.toString(),
                        minStock: product.minStock.toString(),
                        description: product.description
                      })
                      setShowProductDetails(true)
                    }}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setNewProductForm({
                        name: product.name,
                        category: product.category,
                        price: product.price.toString(),
                        cost: product.cost.toString(),
                        stock: product.stock.toString(),
                        minStock: product.minStock.toString(),
                        description: product.description
                      })
                      setShowEditProduct(true)
                    }}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeProduct(product)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para Novo Produto */}
      {showNewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-manrope font-bold">Novo Produto</h3>
                <button
                  onClick={() => setShowNewProduct(false)}
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Nome do Produto</label>
                    <input
                      type="text"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Categoria</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Preço de Venda</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Custo</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProductForm.cost}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, cost: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Estoque Inicial</label>
                    <input
                      type="number"
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, stock: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Estoque Mínimo</label>
                    <input
                      type="number"
                      value={newProductForm.minStock}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, minStock: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Descrição</label>
                  <textarea
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                    rows={3}
                    placeholder="Descreva o produto..."
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-adaptive">
                  <button
                    type="button"
                    onClick={() => setShowNewProduct(false)}
                    className="btn-ghost px-6 py-3 font-manrope font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-success px-8 py-3 rounded-xl transition-all duration-200 font-manrope font-bold flex items-center space-x-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Cadastrando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Cadastrar Produto</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Produto */}
      {showEditProduct && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-manrope font-bold">Editar Produto</h3>
                <button
                  onClick={() => setShowEditProduct(false)}
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleEditProduct} className="space-y-6">
                {/* Mesmo formulário do novo produto */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Nome do Produto</label>
                    <input
                      type="text"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Categoria</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Preço de Venda</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Custo</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProductForm.cost}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, cost: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Estoque Atual</label>
                    <input
                      type="number"
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, stock: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Estoque Mínimo</label>
                    <input
                      type="number"
                      value={newProductForm.minStock}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, minStock: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Descrição</label>
                  <textarea
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="input-primary w-full px-4 py-3 rounded-xl transition-all duration-200"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-adaptive">
                  <button
                    type="button"
                    onClick={() => setShowEditProduct(false)}
                    className="btn-ghost px-6 py-3 font-manrope font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary px-8 py-3 rounded-xl transition-all duration-200 font-manrope font-bold flex items-center space-x-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Salvar Alterações</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Detalhes do Produto */}
      {showProductDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-manrope font-bold">Detalhes do Produto</h3>
                <button
                  onClick={() => setShowProductDetails(false)}
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-manrope font-bold text-primary">{selectedProduct.name}</h4>
                    <p className="text-lg text-secondary">{selectedProduct.category}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedProduct.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedProduct.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-adaptive p-4 rounded-xl">
                      <h5 className="font-semibold text-primary mb-2">Informações de Preço</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary">Preço de Venda:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">R$ {selectedProduct.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Custo:</span>
                          <span className="font-bold text-red-600 dark:text-red-400">R$ {selectedProduct.cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Margem:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">R$ {(selectedProduct.price - selectedProduct.cost).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-adaptive p-4 rounded-xl">
                      <h5 className="font-semibold text-primary mb-2">Estoque</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary">Atual:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{selectedProduct.stock}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Mínimo:</span>
                          <span className="font-bold text-yellow-600 dark:text-yellow-400">{selectedProduct.minStock}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Status:</span>
                          <span className={`font-bold ${
                            selectedProduct.stock <= selectedProduct.minStock ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                          }`}>
                            {selectedProduct.stock <= selectedProduct.minStock ? 'Estoque Baixo' : 'OK'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <h5 className="font-semibold text-primary mb-2 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Análise de IA</span>
                  </h5>
                  <p className="text-blue-800 dark:text-blue-200">{selectedProduct.aiPrediction}</p>
                </div>

                <div className="bg-adaptive p-4 rounded-xl">
                  <h5 className="font-semibold text-primary mb-2">Descrição</h5>
                  <p className="text-secondary">{selectedProduct.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
