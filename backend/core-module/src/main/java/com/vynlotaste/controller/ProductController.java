package com.vynlotaste.controller;

import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.dto.product.ProductRequestDto;
import com.vynlotaste.dto.product.ProductResponseDto;
import com.vynlotaste.entity.Product;
import com.vynlotaste.mapper.ProductMapper;
import com.vynlotaste.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto productRequest) {
        Product product = productService.createProduct(productRequest);
        ProductResponseDto response = productMapper.toResponseDto(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PagedResponseDto<ProductResponseDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productService.findAll(pageable);
        
        PagedResponseDto<ProductResponseDto> response = PagedResponseDto.of(
            productPage.getContent().stream()
                .map(productMapper::toResponseDto)
                .toList(),
            page, size, productPage.getTotalElements()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        Product product = productService.findById(id);
        ProductResponseDto response = productMapper.toResponseDto(product);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto productRequest) {
        
        Product product = productService.updateProduct(id, productRequest);
        ProductResponseDto response = productMapper.toResponseDto(product);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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