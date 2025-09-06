package com.vynlotaste.service;

import com.vynlotaste.config.CacheConfig;
import com.vynlotaste.dto.product.ProductRequestDto;
import com.vynlotaste.entity.Product;
import com.vynlotaste.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    @CacheEvict(value = {CacheConfig.PRODUCTS_CACHE, CacheConfig.PRODUCT_CATEGORIES_CACHE}, allEntries = true)
    public Product createProduct(ProductRequestDto productRequest) {
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setImageUrl(productRequest.getImageUrl());
        product.setAvailable(productRequest.getAvailable() != null ? productRequest.getAvailable() : true);
        product.setPreparationTime(productRequest.getPreparationTime());
        product.setStockQuantity(productRequest.getStockQuantity() != null ? productRequest.getStockQuantity() : 0);
        Product savedProduct = productRepository.save(product);
        log.debug("Produto criado e cache invalidado: {}", savedProduct.getId());
        return savedProduct;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'page:' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<Product> findAll(Pageable pageable) {
        log.debug("Buscando produtos paginados: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return productRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'id:' + #id")
    public Product findById(Long id) {
        log.debug("Buscando produto por ID: {}", id);
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    @CachePut(value = CacheConfig.PRODUCTS_CACHE, key = "'id:' + #result.id")
    @CacheEvict(value = CacheConfig.PRODUCT_CATEGORIES_CACHE, allEntries = true)
    public Product updateProduct(Long id, ProductRequestDto productRequest) {
        Product product = findById(id);
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        Product savedProduct = productRepository.save(product);
        log.debug("Produto atualizado e cache renovado: {}", savedProduct.getId());
        return savedProduct;
    }

    @CacheEvict(value = {CacheConfig.PRODUCTS_CACHE, CacheConfig.PRODUCT_CATEGORIES_CACHE}, allEntries = true)
    public void deleteProduct(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
        log.debug("Produto deletado e cache invalidado: {}", id);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'search:' + #name")
    public List<Product> searchByName(String name) {
        log.debug("Buscando produtos por nome: {}", name);
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'available'")
    public List<Product> findAvailableProducts() {
        log.debug("Buscando produtos disponíveis");
        return productRepository.findByAvailableTrue();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'id:' + #id")
    public Product getProductById(Long id) {
        return findById(id);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'category:' + #category")
    public List<Product> getProductsByCategory(String category) {
        log.debug("Buscando produtos por categoria: {}", category);
        return productRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'available-page:' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<Product> getAvailableProducts(Pageable pageable) {
        log.debug("Buscando produtos disponíveis paginados: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return productRepository.findByAvailableTrue(pageable);
    }

    @Transactional(readOnly = true)
    public boolean isStockAvailable(Long productId, int quantity) {
        Product product = findById(productId);
        return product.getStockQuantity() >= quantity;
    }

    @Transactional
    @CacheEvict(value = {CacheConfig.PRODUCTS_CACHE, CacheConfig.PRODUCT_CATEGORIES_CACHE}, allEntries = true)
    public void decrementStock(Long productId, int quantity) {
        Product product = findById(productId);
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Estoque insuficiente");
        }
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
        log.debug("Estoque decrementado para produto {}: quantidade={}", productId, quantity);
    }

    @Transactional
    @CacheEvict(value = {CacheConfig.PRODUCTS_CACHE, CacheConfig.PRODUCT_CATEGORIES_CACHE}, allEntries = true)
    public void incrementStock(Long productId, int quantity) {
        Product product = findById(productId);
        product.setStockQuantity(product.getStockQuantity() + quantity);
        productRepository.save(product);
        log.debug("Estoque incrementado para produto {}: quantidade={}", productId, quantity);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'price-range:' + #minPrice + ':' + #maxPrice")
    public List<Product> getProductsByPriceRange(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
        log.debug("Buscando produtos por faixa de preço: {} - {}", minPrice, maxPrice);
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Transactional(readOnly = true)
    public boolean validateProductData(ProductRequestDto productRequest) {
        if (productRequest.getName() == null || productRequest.getName().trim().isEmpty()) {
            return false;
        }
        if (productRequest.getPrice() == null || productRequest.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            return false;
        }
        return true;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'low-stock'")
    public List<Product> getLowStockProducts() {
        log.debug("Buscando produtos com estoque baixo");
        return productRepository.findByStockQuantityLessThan(10);
    }
}