# 🏢 MULTI-TENANCY - GUIA DE IMPLEMENTAÇÃO COMPLETO

## ✅ **STATUS: 80% IMPLEMENTADO**

### **O QUE JÁ FOI FEITO:**

```
✅ FASE 1: Migration V11 - Tabela tenants (CONCLUÍDO)
✅ FASE 2: Migration V12 - tenant_id em products, orders, users, drivers (CONCLUÍDO)
✅ FASE 3: Tenant.java + TenantRepository.java (CONCLUÍDO)
✅ FASE 4: TenantContext.java (ThreadLocal) (CONCLUÍDO)
✅ FASE 5: JwtAuthenticationFilter - extrai tenantId do JWT (CONCLUÍDO)
✅ FASE 7: ClientManagementController - cria tenant no BD (CONCLUÍDO)
✅ FASE 8: tenant_id nas entidades Product, Order, User, Driver (CONCLUÍDO)
```

### **O QUE FALTA FAZER:**

```
⏰ FASE 9: Modificar repositories para filtrar por tenant_id (MANUAL)
⏰ FASE 10: Testes de isolamento (MANUAL)
```

---

## 📋 **FASE 9: MODIFICAR REPOSITORIES (INSTRUÇÕES DETALHADAS)**

### **ESTRATÉGIA 1: MODIFICAR CADA QUERY MANUALMENTE (RECOMENDADO PARA PRODUÇÃO)**

#### **ProductRepository.java**

```java
// ANTES (SEM FILTRO):
List<Product> findByAvailableTrue();

// DEPOIS (COM FILTRO):
@Query("SELECT p FROM Product p WHERE p.available = true AND p.tenantId = :tenantId")
List<Product> findByAvailableTrue(@Param("tenantId") Long tenantId);

// Adicionar sobrecarga para Super Admin (sem filtro):
@Query("SELECT p FROM Product p WHERE p.available = true")
List<Product> findByAvailableTrueForSuperAdmin();
```

#### **Exemplo completo ProductRepository:**

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    /**
     * Buscar produtos disponíveis do tenant específico
     * USO: Clientes normais (Admin Restaurante X vê apenas produtos do Restaurante X)
     */
    @Query("SELECT p FROM Product p WHERE p.available = true AND p.tenantId = :tenantId AND p.deleted = false")
    List<Product> findByAvailableTrue(@Param("tenantId") Long tenantId);
    
    /**
     * Buscar produtos disponíveis GLOBAL (Super Admin)
     * USO: Super Admins (Vynlo Tech vê TODOS os produtos)
     */
    @Query("SELECT p FROM Product p WHERE p.available = true AND p.deleted = false")
    List<Product> findByAvailableTrueForSuperAdmin();
    
    /**
     * Buscar produtos por categoria do tenant
     */
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.tenantId = :tenantId AND p.deleted = false")
    List<Product> findByCategory(@Param("category") String category, @Param("tenantId") Long tenantId);
    
    /**
     * Buscar produtos por categoria GLOBAL (Super Admin)
     */
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.deleted = false")
    List<Product> findByCategoryForSuperAdmin(@Param("category") String category);
    
    /**
     * Contar produtos disponíveis do tenant
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.available = true AND p.tenantId = :tenantId AND p.deleted = false")
    long countByAvailableTrue(@Param("tenantId") Long tenantId);
    
    /**
     * Contar produtos disponíveis GLOBAL (Super Admin)
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.available = true AND p.deleted = false")
    long countByAvailableTrueForSuperAdmin();
}
```

---

### **ESTRATÉGIA 2: USAR AOP (ASPECT-ORIENTED PROGRAMMING) - AUTOMÁTICO**

#### **TenantAspect.java** (NÃO IMPLEMENTADO AINDA)

```java
package com.vynlotaste.aspect;

import com.vynlotaste.context.TenantContext;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Aspect
@Component
public class TenantAspect {

    /**
     * Intercepta TODAS as queries dos repositories
     * Adiciona tenant_id automaticamente
     */
    @Around("execution(* com.vynlotaste.repository.*.*(..))")
    public Object addTenantFilter(ProceedingJoinPoint joinPoint) throws Throwable {
        // Se Super Admin: deixa passar sem filtro
        if (TenantContext.isSuperAdmin()) {
            return joinPoint.proceed();
        }
        
        // Se cliente normal: adiciona tenant_id aos parâmetros
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId != null) {
            Object[] args = joinPoint.getArgs();
            Object[] newArgs = Arrays.copyOf(args, args.length + 1);
            newArgs[args.length] = tenantId;
            return joinPoint.proceed(newArgs);
        }
        
        return joinPoint.proceed();
    }
}
```

⚠️ **PROBLEMA DO AOP:** Complexo de implementar corretamente, pode quebrar queries existentes.

---

### **ESTRATÉGIA 3: USAR HIBERNATE FILTERS (RECOMENDADO PARA REFATORAÇÃO)**

#### **Product.java** (adicionar anotação)

```java
@Entity
@Table(name = "products")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = Long.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class Product {
    // ... campos existentes
}
```

#### **TenantFilter.java** (novo arquivo)

```java
package com.vynlotaste.config;

import com.vynlotaste.context.TenantContext;
import jakarta.persistence.EntityManager;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

@Component
public class TenantFilter {

    @Autowired
    private EntityManager entityManager;

    @PostConstruct
    @Transactional
    public void enableTenantFilter() {
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId != null && !TenantContext.isSuperAdmin()) {
            Session session = entityManager.unwrap(Session.class);
            Filter filter = session.enableFilter("tenantFilter");
            filter.setParameter("tenantId", tenantId);
        }
    }
}
```

---

## 📊 **FASE 10: TESTES DE ISOLAMENTO**

### **TESTE 1: CRIAR 2 TENANTS E VERIFICAR ISOLAMENTO**

```bash
# 1. Criar Tenant A (Restaurante Nunes)
curl -X POST http://localhost:8080/api/v1/super-admin/create-client \
  -H "Authorization: Bearer <SUPER_ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Restaurante Nunes",
    "adminEmail": "admin.nunes@gmail.com",
    "adminPassword": "senha123",
    "vynloProduct": "TASTE",
    "role": "ADMIN",
    "cnpj": "12.345.678/0001-90"
  }'

# 2. Criar Tenant B (Restaurante Silva)
curl -X POST http://localhost:8080/api/v1/super-admin/create-client \
  -H "Authorization: Bearer <SUPER_ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Restaurante Silva",
    "adminEmail": "admin.silva@gmail.com",
    "adminPassword": "senha123",
    "vynloProduct": "TASTE",
    "role": "ADMIN",
    "cnpj": "98.765.432/0001-10"
  }'

# 3. Fazer login como Admin Nunes
# Obter TOKEN_NUNES

# 4. Criar produto como Admin Nunes
curl -X POST http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer <TOKEN_NUNES>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margherita",
    "price": 35.00,
    "category": "Pizza"
  }'

# 5. Fazer login como Admin Silva
# Obter TOKEN_SILVA

# 6. Listar produtos como Admin Silva
curl -X GET http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer <TOKEN_SILVA>"

# ✅ RESULTADO ESPERADO:
# Admin Silva NÃO deve ver "Pizza Margherita" (pertence ao Tenant Nunes)
# Admin Silva deve ver lista vazia (ainda não criou produtos)

# ❌ RESULTADO ERRADO (SE MULTI-TENANCY NÃO FUNCIONAR):
# Admin Silva vê "Pizza Margherita" (VAZAMENTO DE DADOS!)
```

### **TESTE 2: SUPER ADMIN VÊ TUDO**

```bash
# 1. Fazer login como Super Admin (superadmin@vynlotech.com)
# Obter TOKEN_SUPER_ADMIN

# 2. Listar produtos como Super Admin
curl -X GET http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer <TOKEN_SUPER_ADMIN>"

# ✅ RESULTADO ESPERADO:
# Super Admin VÊ TODOS os produtos de TODOS os tenants
# - Pizza Margherita (Tenant Nunes)
# - Hamburguer (Tenant Silva, se criou)
# - Sushi (Tenant X, se criou)
```

---

## 🚀 **COMO APLICAR O MULTI-TENANCY (PASSO A PASSO)**

### **OPÇÃO A: MODIFICAÇÃO MANUAL (RECOMENDADO)**

1. ✅ **Migrations já aplicadas** (V11, V12)
2. ✅ **Entidades atualizadas** (tenant_id adicionado)
3. ✅ **JwtAuthenticationFilter extrai tenantId** (TenantContext)
4. ⏰ **Modificar ProductService:**

```java
// ANTES:
public List<Product> findAll() {
    return productRepository.findAll();
}

// DEPOIS:
public List<Product> findAll() {
    if (TenantContext.isSuperAdmin()) {
        return productRepository.findAll();  // Super Admin vê tudo
    }
    
    Long tenantId = TenantContext.getCurrentTenantId();
    if (tenantId == null) {
        throw new IllegalStateException("Tenant não definido - Acesso negado");
    }
    
    return productRepository.findByTenantId(tenantId);  // Cliente vê apenas seus dados
}
```

5. ⏰ **Modificar ProductController (ao criar produto):**

```java
// ANTES:
@PostMapping
public Product createProduct(@RequestBody ProductDto productDto) {
    Product product = new Product();
    product.setName(productDto.getName());
    product.setPrice(productDto.getPrice());
    return productService.save(product);
}

// DEPOIS:
@PostMapping
public Product createProduct(@RequestBody ProductDto productDto) {
    Product product = new Product();
    product.setName(productDto.getName());
    product.setPrice(productDto.getPrice());
    
    // ✅ MULTI-TENANCY: Setar tenant_id automaticamente
    Long tenantId = TenantContext.getCurrentTenantId();
    product.setTenantId(tenantId);  // null para Super Admin, ID para clientes
    
    return productService.save(product);
}
```

---

### **OPÇÃO B: HIBERNATE FILTERS (MAIS ELEGANTE, MAS COMPLEXO)**

1. Adicionar `@FilterDef` e `@Filter` em todas as entidades (Product, Order, User, Driver)
2. Criar `TenantFilterInterceptor` para habilitar filtro automaticamente
3. Registrar interceptor no `HibernateConfig`

---

## 🔒 **SEGURANÇA: VALIDAÇÕES CRÍTICAS**

### **1. NUNCA permitir cliente definir tenantId manualmente:**

```java
// ❌ ERRADO (VULNERABILIDADE!):
@PostMapping("/products")
public Product createProduct(@RequestBody ProductDto productDto) {
    Product product = new Product();
    product.setTenantId(productDto.getTenantId());  // ❌ Cliente pode forjar tenantId!
    return productService.save(product);
}

// ✅ CORRETO:
@PostMapping("/products")
public Product createProduct(@RequestBody ProductDto productDto) {
    Product product = new Product();
    Long tenantId = TenantContext.getCurrentTenantId();  // ✅ Vem do JWT (confiável)
    product.setTenantId(tenantId);
    return productService.save(product);
}
```

### **2. SEMPRE validar tenantId antes de operações sensíveis:**

```java
public void deleteProduct(Long productId) {
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
    
    // ✅ VALIDAÇÃO CRÍTICA: Verificar se produto pertence ao tenant
    Long tenantId = TenantContext.getCurrentTenantId();
    if (!TenantContext.isSuperAdmin() && !product.getTenantId().equals(tenantId)) {
        throw new AccessDeniedException("Você não tem permissão para deletar este produto");
    }
    
    productRepository.delete(product);
}
```

---

## 📈 **IMPACTO ESPERADO**

### **ANTES (SEM MULTI-TENANCY):**
```
Admin Nunes faz GET /products:
  → Retorna 150 produtos (TODOS os restaurantes) ❌

Admin Silva faz GET /products:
  → Retorna 150 produtos (MESMOS dados do Admin Nunes) ❌
```

### **DEPOIS (COM MULTI-TENANCY):**
```
Admin Nunes faz GET /products:
  → Retorna 50 produtos (APENAS Restaurante Nunes) ✅

Admin Silva faz GET /products:
  → Retorna 35 produtos (APENAS Restaurante Silva) ✅

Super Admin faz GET /products:
  → Retorna 150 produtos (TODOS os restaurantes) ✅
```

---

## 🎯 **PRÓXIMOS PASSOS**

1. **TESTAR migrations:** Deploy e verificar se tabela `tenants` foi criada
2. **TESTAR criação de tenant:** Super Admin cria cliente via `/v1/super-admin/create-client`
3. **MODIFICAR ProductService:** Adicionar filtro tenant_id em `findAll()`
4. **MODIFICAR ProductController:** Setar tenant_id ao criar produto
5. **TESTAR isolamento:** Criar produtos em 2 tenants e verificar separação
6. **EXPANDIR para outros serviços:** OrderService, UserService, DriverService

---

## 📞 **SUPORTE**

Se encontrar dúvidas ou erros, verificar:
1. **Logs do backend:** Procurar por `TenantContext` e `tenant_id`
2. **JWT claims:** Verificar se `firebaseUid` está correto
3. **Migrations:** `SELECT * FROM tenants;` para ver registros
4. **Relacionamento:** `SELECT * FROM products WHERE tenant_id = 1;`

---

**AUTOR:** Vynlo Tech - Multi-Tenancy Implementation Team  
**DATA:** 2025-10-17  
**VERSÃO:** 1.0.0  
**STATUS:** 80% Implementado - Aguardando refatoração manual dos Services

