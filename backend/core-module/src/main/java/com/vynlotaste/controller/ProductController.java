package com.vynlotaste.controller;

import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.dto.product.ProductRequestDto;
import com.vynlotaste.dto.product.ProductResponseDto;
import com.vynlotaste.entity.Product;
import com.vynlotaste.mapper.ProductMapper;
import com.vynlotaste.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestão de produtos
 * v2.1.2 - Added error handling e logging para produção
 * Fix: Payload mapeado para ProductRequestDto (stockQuantity)
 * Deploy: 2025-10-11 13:58 UTC
 */
@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @PostMapping
    @PreAuthorize("isAuthenticated()")  // Permitir usuários autenticados criarem produtos
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto productRequest) {
        try {
            log.info("📝 Criando produto: {}", productRequest.getName());
            Product product = productService.createProduct(productRequest);
            ProductResponseDto response = productMapper.toResponseDto(product);
            log.info("✅ Produto criado com sucesso: ID={}", product.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("❌ Erro ao criar produto: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao criar produto: " + e.getMessage(), e);
        }
    }

    @GetMapping
    public ResponseEntity<PagedResponseDto<ProductResponseDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productPage = productService.findAll(pageable);
            
            PagedResponseDto<ProductResponseDto> response = PagedResponseDto.of(
                productPage.getContent().stream()
                    .map(productMapper::toResponseDto)
                    .toList(),
                page, size, productPage.getTotalElements()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Fallback seguro - retornar lista vazia se houver erro
            return ResponseEntity.ok(PagedResponseDto.of(
                List.of(),
                page, size, 0L
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        Product product = productService.findById(id);
        ProductResponseDto response = productMapper.toResponseDto(product);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")  // Permitir usuários autenticados atualizarem produtos
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto productRequest) {
        
        Product product = productService.updateProduct(id, productRequest);
        ProductResponseDto response = productMapper.toResponseDto(product);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")  // Permitir usuários autenticados deletarem produtos
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDto>> searchProducts(@RequestParam String name) {
        List<Product> products = productService.searchByName(name);
        List<ProductResponseDto> response = products.stream()
            .map(productMapper::toResponseDto)
            .toList();
        return ResponseEntity.ok(response);
    }
}
// Modified: 2025-10-11-v20 | Products API with logging