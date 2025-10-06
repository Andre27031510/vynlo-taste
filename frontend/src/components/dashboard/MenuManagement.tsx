'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { 
  Package, Plus, Edit, Trash2, Eye, 
  AlertTriangle, CheckCircle, X, Save,
  Search, RefreshCw, Clock
} from 'lucide-react'
import { 
  useProductsQuery, 
  useProductStatsQuery, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  Product,
  CreateProductData,
  UpdateProductData
} from '@/hooks/useProductsQuery'
import { useDebounce } from '@/hooks/useDebounce'

// Skeleton components - Memoizados
const ProductSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
    <div className="flex justify-between items-center">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="flex space-x-2">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  </div>
))
ProductSkeleton.displayName = 'ProductSkeleton'

// Componente de card de produto memoizado
const ProductCard = memo(({ product, onView, onEdit, onDelete }: {
  product: Product
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}) => {
  const formattedPrice = useMemo(() => product.price.toFixed(2), [product.price])
  
  const stockStatus = useMemo(() => ({
    isLow: product.stock <= product.minStock,
    color: product.stock <= product.minStock 
      ? 'text-red-600 dark:text-red-400' 
      : 'text-green-600 dark:text-green-400',
    text: product.stock <= product.minStock ? 'Baixo' : 'OK',
    icon: product.stock <= product.minStock ? AlertTriangle : CheckCircle
  }), [product.stock, product.minStock])
  
  const statusBadgeColor = useMemo(() => 
    product.status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    [product.status]
  )
  
  const StatusIcon = stockStatus.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white font-manrope truncate">{product.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-manrope">{product.category}</p>
          </div>
        </div>
        <div className="flex justify-between sm:block sm:text-right">
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-manrope">
            R$ {formattedPrice}
          </p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor}`}>
            {product.status === 'active' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-manrope flex items-center space-x-2">
          <span>Estoque: {product.stock}</span>
          <span className={`flex items-center space-x-1 ${stockStatus.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{stockStatus.text}</span>
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="text-xs text-gray-500 dark:text-gray-500 font-manrope truncate order-2 sm:order-1">
          {product.description}
        </div>
        
        <div className="flex space-x-2 order-1 sm:order-2">
          <button
            onClick={() => onView(product)}
            className="p-2 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Remover"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})
ProductCard.displayName = 'ProductCard'

const MenuManagement = memo(() => {
  // Estados para funcionalidades
  const [showNewProduct, setShowNewProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Debounce da busca para melhor performance
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Reset da página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedCategory])

  // Usando TanStack Query para buscar dados com filtros
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts 
  } = useProductsQuery({
    category: selectedCategory,
    search: debouncedSearchTerm,
    page: currentPage,
    limit: pageSize
  })

  const products = productsData?.products || []
  const totalPages = productsData?.totalPages || 1
  const totalProducts = productsData?.total || 0

  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useProductStatsQuery()

  // Mutations
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  // Schema de validação memoizado para evitar recriação
  const productSchema = useMemo(() => yup.object().shape({
    name: yup.string()
      .required('Nome do produto é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    category: yup.string()
      .required('Categoria é obrigatória'),
    price: yup.number()
      .required('Preço é obrigatório')
      .positive('Preço deve ser positivo')
      .min(0.01, 'Preço mínimo é R$ 0,01')
      .max(9999.99, 'Preço máximo é R$ 9.999,99'),
    cost: yup.number()
      .required('Custo é obrigatório')
      .positive('Custo deve ser positivo')
      .min(0.01, 'Custo mínimo é R$ 0,01')
      .test('cost-less-than-price', 'Custo deve ser menor que o preço de venda', function(value) {
        const { price } = this.parent;
        return !value || !price || value < price;
      }),
    stock: yup.number()
      .required('Estoque é obrigatório')
      .integer('Estoque deve ser um número inteiro')
      .min(0, 'Estoque não pode ser negativo')
      .max(99999, 'Estoque máximo é 99.999 unidades'),
    minStock: yup.number()
      .required('Estoque mínimo é obrigatório')
      .integer('Estoque mínimo deve ser um número inteiro')
      .min(0, 'Estoque mínimo não pode ser negativo')
      .test('min-stock-less-than-stock', 'Estoque mínimo deve ser menor que o estoque atual', function(value) {
        const { stock } = this.parent;
        return !value || !stock || value <= stock;
      }),
    description: yup.string()
      .required('Descrição é obrigatória')
      .min(10, 'Descrição deve ter pelo menos 10 caracteres')
      .max(500, 'Descrição deve ter no máximo 500 caracteres')
  }), [])

  // Hook form para adicionar produto
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
    watch: watchAdd
  } = useForm({
    resolver: yupResolver(productSchema)
  })

  // Hook form para editar produto
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit
  } = useForm({
    resolver: yupResolver(productSchema)
  })



  // Categorias disponíveis - memoizadas
  const categories = useMemo(() => ['Lanches', 'Pizzas', 'Bebidas', 'Sobremesas', 'Acompanhamentos'], [])

  // Função para adicionar novo produto
  const handleAddProduct = useCallback(async (formData: CreateProductData) => {
    try {
      await createProductMutation.mutateAsync(formData)
      setShowNewProduct(false)
      resetAdd()
    } catch (error) {
      // Error já tratado no mutation
    }
  }, [createProductMutation, resetAdd])

  // Função para editar produto (submit)
  const handleEditProductSubmit = useCallback(async (formData: CreateProductData) => {
    if (!selectedProduct) return
    
    try {
      const updateData: UpdateProductData = {
        ...formData,
        id: selectedProduct.id
      }
      await updateProductMutation.mutateAsync(updateData)
      setShowEditProduct(false)
      setSelectedProduct(null)
      resetEdit()
    } catch (error) {
      // Error já tratado no mutation
    }
  }, [selectedProduct, updateProductMutation, resetEdit])

  // Função para remover produto
  const removeProduct = useCallback((product: Product) => {
    if (confirm(`Tem certeza que deseja remover ${product.name}?`)) {
      deleteProductMutation.mutate(product.id)
    }
  }, [deleteProductMutation])

  // Handlers memoizados para ProductCard
  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowProductDetails(true)
  }, [])

  const handleEditProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setValueEdit('name', product.name)
    setValueEdit('category', product.category)
    setValueEdit('price', product.price)
    setValueEdit('cost', product.cost)
    setValueEdit('stock', product.stock)
    setValueEdit('minStock', product.minStock)
    setValueEdit('description', product.description)
    setShowEditProduct(true)
  }, [setValueEdit])

  // Os filtros agora são aplicados no backend via query parameters
  const filteredProducts = products

  return (
    <div className="space-y-8">
      {/* Header - Simplificado */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-manrope font-bold text-gray-900 dark:text-white">Cardápio & Estoque</h1>
          <p className="text-gray-600 dark:text-gray-400 font-manrope text-sm sm:text-base">Gerencie produtos e estoque</p>
          {productsError && (
            <div className="mt-2 flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Usando dados de demonstração - API em desenvolvimento</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {!productsError && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">API Conectada</span>
            </div>
          )}
          <button
            onClick={() => refetchProducts()}
            disabled={productsLoading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowNewProduct(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2 text-sm min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Produto</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      {/* Filtros - Simplificado */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
        >
          <option value="">Todas</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Lista de Produtos - Simplificada */}
      <div className="space-y-4">
        {productsLoading ? (
          // Skeleton loading para produtos
          Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : productsError ? (
          // Estado de erro
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <X className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar produtos
            </h3>
            <button
              onClick={() => refetchProducts()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          // Estado vazio
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory !== '' 
                ? 'Ajuste os filtros.' 
                : 'Cadastre um novo produto.'}
            </p>
          </div>
        ) : (
          // Lista de produtos memoizada
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={removeProduct}
            />
          ))
        )}
      </div>

      {/* Paginação - Responsiva */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Página {currentPage} de {totalPages} • {totalProducts} produtos
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || productsLoading}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center"
            >
              Anterior
            </button>
            
            <span className="px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {currentPage}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || productsLoading}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* Modal para Novo Produto */}
      {showNewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 p-4 sm:p-6 text-white rounded-t-2xl">
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
              <form onSubmit={handleSubmitAdd(handleAddProduct)} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Nome do Produto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Nome do Produto *
                    </label>
                    <input
                      {...registerAdd('name')}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsAdd.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Ex: Hambúrguer Artesanal"
                    />
                    {errorsAdd.name && (
                      <p className="text-red-500 text-sm mt-1">{errorsAdd.name.message}</p>
                    )}
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Categoria *
                    </label>
                    <select
                      {...registerAdd('category')}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsAdd.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errorsAdd.category && (
                      <p className="text-red-500 text-sm mt-1">{errorsAdd.category.message}</p>
                    )}
                  </div>

                  {/* Preço de Venda */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Preço de Venda (R$) *
                    </label>
                    <input
                      {...registerAdd('price')}
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="9999.99"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsAdd.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="25.90"
                    />
                    {errorsAdd.price && (
                      <p className="text-red-500 text-sm mt-1">{errorsAdd.price.message}</p>
                    )}
                  </div>

                  {/* Custo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Custo (R$) *
                    </label>
                    <input
                      {...registerAdd('cost')}
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsAdd.cost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="12.50"
                    />
                    {errorsAdd.cost && (
                      <p className="text-red-500 text-sm mt-1">{errorsAdd.cost.message}</p>
                    )}
                  </div>

                  {/* Estoque Inicial */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Estoque Inicial *
                    </label>
                    <input
                      {...registerAdd('stock')}
                      type="number"
                      min="0"
                      max="99999"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsAdd.stock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="50"
                    />
                    {errorsAdd.stock && (
                      <p className="text-red-500 text-sm mt-1">{errorsAdd.stock.message}</p>
                    )}
                  </div>

                  {/* Estoque Mínimo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Estoque Mínimo *
                    </label>
                    <input
                      {...registerAdd('minStock')}
                      type="number"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsAdd.minStock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="10"
                    />
                    {errorsAdd.minStock && (
                      <p className="text-red-500 text-sm mt-1">{errorsAdd.minStock.message}</p>
                    )}
                  </div>
                </div>



                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Descrição do Produto *
                  </label>
                  <textarea
                    {...registerAdd('description')}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none ${
                      errorsAdd.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Descreva o produto, ingredientes, características especiais..."
                  />
                  {errorsAdd.description && (
                    <p className="text-red-500 text-sm mt-1">{errorsAdd.description.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewProduct(false)
                      resetAdd()
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-manrope font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createProductMutation.isPending}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-manrope font-bold flex items-center space-x-3"
                  >
                    {createProductMutation.isPending ? (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 p-4 sm:p-6 text-white rounded-t-2xl">
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
              <form onSubmit={handleSubmitEdit(handleEditProductSubmit)} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Nome do Produto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Nome do Produto *
                    </label>
                    <input
                      {...registerEdit('name')}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsEdit.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Ex: Hambúrguer Artesanal"
                    />
                    {errorsEdit.name && (
                      <p className="text-red-500 text-sm mt-1">{errorsEdit.name.message}</p>
                    )}
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Categoria *
                    </label>
                    <select
                      {...registerEdit('category')}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsEdit.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errorsEdit.category && (
                      <p className="text-red-500 text-sm mt-1">{errorsEdit.category.message}</p>
                    )}
                  </div>

                  {/* Preço de Venda */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Preço de Venda (R$) *
                    </label>
                    <input
                      {...registerEdit('price')}
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="9999.99"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsEdit.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="25.90"
                    />
                    {errorsEdit.price && (
                      <p className="text-red-500 text-sm mt-1">{errorsEdit.price.message}</p>
                    )}
                  </div>

                  {/* Custo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Custo (R$) *
                    </label>
                    <input
                      {...registerEdit('cost')}
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsEdit.cost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="12.50"
                    />
                    {errorsEdit.cost && (
                      <p className="text-red-500 text-sm mt-1">{errorsEdit.cost.message}</p>
                    )}
                  </div>

                  {/* Estoque Atual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Estoque Atual *
                    </label>
                    <input
                      {...registerEdit('stock')}
                      type="number"
                      min="0"
                      max="99999"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsEdit.stock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="50"
                    />
                    {errorsEdit.stock && (
                      <p className="text-red-500 text-sm mt-1">{errorsEdit.stock.message}</p>
                    )}
                  </div>

                  {/* Estoque Mínimo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Estoque Mínimo *
                    </label>
                    <input
                      {...registerEdit('minStock')}
                      type="number"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                        errorsEdit.minStock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="10"
                    />
                    {errorsEdit.minStock && (
                      <p className="text-red-500 text-sm mt-1">{errorsEdit.minStock.message}</p>
                    )}
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Descrição do Produto *
                  </label>
                  <textarea
                    {...registerEdit('description')}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none ${
                      errorsEdit.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Descreva o produto, ingredientes, características especiais..."
                  />
                  {errorsEdit.description && (
                    <p className="text-red-500 text-sm mt-1">{errorsEdit.description.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditProduct(false)
                      setSelectedProduct(null)
                      resetEdit()
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-manrope font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={updateProductMutation.isPending}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-manrope font-bold flex items-center space-x-3"
                  >
                    {updateProductMutation.isPending ? (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-purple-600 p-4 sm:p-6 text-white rounded-t-2xl">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                          <span className="font-bold text-blue-600 dark:text-blue-400">{(((selectedProduct.price - selectedProduct.cost) / selectedProduct.price) * 100).toFixed(1)}%</span>
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
})
MenuManagement.displayName = 'MenuManagement'

export default MenuManagement
