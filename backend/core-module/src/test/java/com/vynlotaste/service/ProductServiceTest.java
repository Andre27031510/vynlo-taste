package com.vynlotaste.service;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.dto.product.ProductRequestDto;
import com.vynlotaste.entity.Product;
import com.vynlotaste.repository.ProductRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * ============================================================================
 * Testes Unitários - ProductService
 * ============================================================================
 * 
 * COBERTURA:
 * ✅ Criação de produtos (com tenant_id correto)
 * ✅ Listagem de produtos (isolamento por tenant)
 * ✅ Validação de multi-tenancy
 * ✅ Segurança (não vazar dados entre tenants)
 * 
 * PADRÃO: AAA (Arrange, Act, Assert)
 * FRAMEWORK: JUnit 5 + Mockito
 * 
 * @version 1.0.0
 * @created 2025-10-20
 * ============================================================================
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService - Testes Unitários")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private TenantCacheService tenantCacheService;

    @InjectMocks
    private ProductService productService;

    private Long tenantId1 = 1L;
    private Long tenantId2 = 2L;

    @BeforeEach
    void setUp() {
        TenantContext.clear();
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    // ========================================================================
    // TESTES DE CRIAÇÃO COM TENANT_ID
    // ========================================================================

    @Test
    @DisplayName("Deve criar produto com tenant_id do contexto")
    void shouldCreateProductWithTenantIdFromContext() {
        // Arrange
        TenantContext.setCurrentTenantId(tenantId1);
        
        ProductRequestDto request = new ProductRequestDto();
        request.setName("Pizza Margherita");
        request.setDescription("Pizza clássica");
        request.setPrice(new BigDecimal("35.00"));
        request.setStockQuantity(10);
        
        Product savedProduct = createTestProduct(1L, "Pizza Margherita", tenantId1);
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);
        doNothing().when(tenantCacheService).evictProductCacheForCurrentTenant();

        // Act
        Product result = productService.createProduct(request);

        // Assert
        assertNotNull(result);
        assertEquals(tenantId1, result.getTenantId());
        assertEquals("Pizza Margherita", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
        verify(tenantCacheService, times(1)).evictProductCacheForCurrentTenant();
    }

    @Test
    @DisplayName("Deve criar produto como Super Admin (tenant_id = null)")
    void shouldCreateProductAsSuperAdmin() {
        // Arrange
        TenantContext.setIsSuperAdmin(true);
        
        ProductRequestDto request = new ProductRequestDto();
        request.setName("Produto Global");
        request.setPrice(new BigDecimal("100.00"));
        
        Product savedProduct = createTestProduct(1L, "Produto Global", null);
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);
        doNothing().when(tenantCacheService).evictProductCacheForCurrentTenant();

        // Act
        Product result = productService.createProduct(request);

        // Assert
        assertNotNull(result);
        assertNull(result.getTenantId());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // ========================================================================
    // TESTES DE ISOLAMENTO DE TENANT
    // ========================================================================

    @Test
    @DisplayName("Deve listar apenas produtos do tenant atual")
    void shouldListOnlyProductsFromCurrentTenant() {
        // Arrange
        TenantContext.setCurrentTenantId(tenantId1);
        
        Product product1 = createTestProduct(1L, "Produto 1", tenantId1);
        List<Product> products = Arrays.asList(product1);
        Page<Product> page = new PageImpl<>(products);
        Pageable pageable = PageRequest.of(0, 10);
        
        when(productRepository.findAllByTenantId(eq(tenantId1), any(Pageable.class)))
            .thenReturn(page);

        // Act
        Page<Product> result = productService.findAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(tenantId1, result.getContent().get(0).getTenantId());
        verify(productRepository, times(1)).findAllByTenantId(eq(tenantId1), any(Pageable.class));
    }

    @Test
    @DisplayName("Super Admin deve ver todos os produtos")
    void shouldListAllProductsAsSuperAdmin() {
        // Arrange
        TenantContext.setIsSuperAdmin(true);
        
        Product product1 = createTestProduct(1L, "Produto 1", tenantId1);
        Product product2 = createTestProduct(2L, "Produto 2", tenantId2);
        List<Product> products = Arrays.asList(product1, product2);
        Page<Product> page = new PageImpl<>(products);
        Pageable pageable = PageRequest.of(0, 10);
        
        when(productRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Act
        Page<Product> result = productService.findAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        verify(productRepository, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("Não deve vazar dados entre tenants diferentes")
    void shouldNotLeakDataBetweenTenants() {
        // Arrange
        TenantContext.setCurrentTenantId(tenantId1);
        
        Product product1 = createTestProduct(1L, "Produto Tenant 1", tenantId1);
        List<Product> products = Arrays.asList(product1);
        Page<Product> page = new PageImpl<>(products);
        
        when(productRepository.findAllByTenantId(eq(tenantId1), any(Pageable.class)))
            .thenReturn(page);

        // Act
        Page<Product> result = productService.findAll(PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        
        // Garantir que NENHUM produto do tenant2 aparece
        assertTrue(result.getContent().stream()
            .noneMatch(p -> tenantId2.equals(p.getTenantId())));
    }

    // ========================================================================
    // TESTES DE VALIDAÇÃO
    // ========================================================================

    @Test
    @DisplayName("Não deve permitir criar produto com dados inválidos")
    void shouldNotCreateProductWithInvalidData() {
        // Arrange
        TenantContext.setCurrentTenantId(tenantId1);
        
        ProductRequestDto request = new ProductRequestDto();
        // Nome vazio - inválido
        request.setName("");

        // Act & Assert
        assertThrows(Exception.class, () -> {
            productService.createProduct(request);
        });
        
        verify(productRepository, never()).save(any());
    }

    // ========================================================================
    // HELPERS
    // ========================================================================

    private Product createTestProduct(Long id, String name, Long tenantId) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setDescription("Descrição de teste");
        product.setPrice(new BigDecimal("35.00"));
        product.setStockQuantity(10);
        product.setAvailable(true);
        product.setTenantId(tenantId);
        return product;
    }
}

