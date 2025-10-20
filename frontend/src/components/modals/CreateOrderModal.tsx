'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Plus, Minus, ShoppingCart, Trash2, Search, User, MapPin, CreditCard } from 'lucide-react'
import { useCreateOrderMutation, type CreateOrderData } from '@/hooks/useOrdersQuery'
import { useProductsQuery, type Product } from '@/hooks/useProductsQuery'
import { useClientsQuery, type Client } from '@/hooks/useClientsQuery'
import { formatCurrency } from '@/utils/format'

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CartItem {
  productId: number
  name: string
  price: number
  quantity: number
  itemNotes?: string
}

export default function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  // State
  const [step, setStep] = useState<'customer' | 'products' | 'delivery' | 'payment'>('customer')
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP' | 'DINE_IN'>('DELIVERY')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
  const [notes, setNotes] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [searchProduct, setSearchProduct] = useState('')
  const [searchCustomer, setSearchCustomer] = useState('')

  // Queries
  const { data: productsData, isLoading: productsLoading } = useProductsQuery({ status: 'active' })
  const { data: clientsData, isLoading: clientsLoading } = useClientsQuery({ status: 'active' })
  const createOrderMutation = useCreateOrderMutation()

  // Extract data
  const products = (productsData as any)?.products || []
  const clients = (clientsData as any)?.clients || []

  // Filtrar produtos por busca
  const filteredProducts = useMemo(() => {
    if (!searchProduct) return products
    return products.filter((p: Product) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase())
    )
  }, [products, searchProduct])

  // Filtrar clientes por busca
  const filteredClients = useMemo(() => {
    if (!searchCustomer) return clients
    return clients.filter((c: Client) =>
      c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      c.email.toLowerCase().includes(searchCustomer.toLowerCase())
    )
  }, [clients, searchCustomer])

  // Calcular total
  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cart]
  )

  const total = useMemo(() =>
    subtotal + deliveryFee - discount,
    [subtotal, deliveryFee, discount]
  )

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setStep('customer')
      setSelectedCustomer(null)
      setCart([])
      setOrderType('DELIVERY')
      setDeliveryAddress('')
      setContactPhone('')
      setPaymentMethod('CREDIT_CARD')
      setNotes('')
      setDeliveryFee(0)
      setDiscount(0)
      setSearchProduct('')
      setSearchCustomer('')
    }
  }, [isOpen])

  // Funções do carrinho
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === Number(product.id))
    if (existing) {
      setCart(cart.map(item =>
        item.productId === Number(product.id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        productId: Number(product.id),
        name: product.name,
        price: product.price,
        quantity: 1
      }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ))
    }
  }

  const handleSubmit = () => {
    if (!selectedCustomer) {
      return alert('Selecione um cliente')
    }
    if (cart.length === 0) {
      return alert('Adicione pelo menos um produto')
    }
    if (orderType === 'DELIVERY' && !deliveryAddress) {
      return alert('Informe o endereço de entrega')
    }

    const orderData: CreateOrderData = {
      type: orderType,
      customerId: Number(selectedCustomer.id),
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        itemNotes: item.itemNotes
      })),
      deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
      notes,
      paymentMethod,
      contactPhone: contactPhone || selectedCustomer.phone,
      deliveryFee,
      discount
    }

    createOrderMutation.mutate(orderData, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Novo Pedido</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step === 'customer' && 'Selecione o cliente'}
                {step === 'products' && 'Adicione produtos ao pedido'}
                {step === 'delivery' && 'Informações de entrega'}
                {step === 'payment' && 'Finalizar pedido'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {['customer', 'products', 'delivery', 'payment'].map((s, index) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center space-x-2 ${index < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : cart.length > 0 && (s === 'products' || s === 'delivery' || s === 'payment')
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:inline ${
                    step === s ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                  }`}>
                    {s === 'customer' && 'Cliente'}
                    {s === 'products' && 'Produtos'}
                    {s === 'delivery' && 'Entrega'}
                    {s === 'payment' && 'Pagamento'}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    cart.length > 0 && index < (['customer', 'products', 'delivery', 'payment'].indexOf(step))
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Selecionar Cliente */}
          {step === 'customer' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente por nome ou email..."
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {clientsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredClients.map((client: Client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedCustomer(client)
                        setContactPhone(client.phone || '')
                        setDeliveryAddress(client.address || '')
                        setStep('products')
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                        selectedCustomer?.id === client.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                          {client.phone && (
                            <p className="text-xs text-gray-400">{client.phone}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Adicionar Produtos */}
          {step === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lista de Produtos */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Produtos Disponíveis</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar produto..."
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {productsLoading ? (
                    [1, 2, 3, 4].map(i => (
                      <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                    ))
                  ) : (
                    filteredProducts.map((product: Product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(product.price)}</p>
                            {product.stock && (
                              <p className="text-xs text-gray-400">Est: {product.stock}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Carrinho */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Carrinho ({cart.length})</h3>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p>Nenhum produto adicionado</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">{formatCurrency(item.price)} cada</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resumo */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      {deliveryFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Taxa de Entrega</span>
                          <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Desconto</span>
                          <span className="font-medium">-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>Total</span>
                        <span className="text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Informações de Entrega */}
          {step === 'delivery' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Pedido
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'DELIVERY', label: 'Entrega', icon: '🚗' },
                    { value: 'PICKUP', label: 'Retirada', icon: '🏪' },
                    { value: 'DINE_IN', label: 'Local', icon: '🍽️' }
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setOrderType(type.value as any)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        orderType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {orderType === 'DELIVERY' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Endereço de Entrega *
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Rua, número, complemento, bairro, cidade..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Taxa de Entrega
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone de Contato
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observações
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruções especiais, sem cebola, etc..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Step 4: Pagamento */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Método de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="CREDIT_CARD">Cartão de Crédito</option>
                  <option value="DEBIT_CARD">Cartão de Débito</option>
                  <option value="PIX">PIX</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="VOUCHER">Vale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Desconto (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(parseFloat(e.target.value) || 0, subtotal))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Resumo Final */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resumo do Pedido</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
                    <span className="font-medium">{selectedCustomer?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                    <span className="font-medium">
                      {orderType === 'DELIVERY' && '🚗 Entrega'}
                      {orderType === 'PICKUP' && '🏪 Retirada'}
                      {orderType === 'DINE_IN' && '🍽️ No Local'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Itens:</span>
                    <span className="font-medium">{cart.length} produtos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pagamento:</span>
                    <span className="font-medium">
                      {paymentMethod === 'CREDIT_CARD' && 'Cartão Crédito'}
                      {paymentMethod === 'DEBIT_CARD' && 'Cartão Débito'}
                      {paymentMethod === 'PIX' && 'PIX'}
                      {paymentMethod === 'CASH' && 'Dinheiro'}
                      {paymentMethod === 'VOUCHER' && 'Vale'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Taxa Entrega</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com Navegação */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                if (step === 'customer') onClose()
                else if (step === 'products') setStep('customer')
                else if (step === 'delivery') setStep('products')
                else if (step === 'payment') setStep('delivery')
              }}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {step === 'customer' ? 'Cancelar' : 'Voltar'}
            </button>

            <div className="flex space-x-3">
              {selectedCustomer && cart.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'} • {formatCurrency(total)}
                </div>
              )}

              {step !== 'payment' ? (
                <button
                  onClick={() => {
                    if (step === 'customer' && selectedCustomer) setStep('products')
                    else if (step === 'products' && cart.length > 0) setStep('delivery')
                    else if (step === 'delivery') setStep('payment')
                  }}
                  disabled={
                    (step === 'customer' && !selectedCustomer) ||
                    (step === 'products' && cart.length === 0)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={createOrderMutation.isPending}
                  className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {createOrderMutation.isPending ? 'Criando...' : 'Criar Pedido'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

