package com.vynlotaste.dto.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@Schema(description = "Resposta paginada genérica")
public class PagedResponseDto<T> {
    
    @Schema(description = "Lista de itens da página atual")
    private List<T> content;
    
    @Schema(description = "Número da página atual (começa em 0)", example = "0")
    private int page;
    
    @Schema(description = "Tamanho da página", example = "20")
    private int size;
    
    @Schema(description = "Total de elementos", example = "100")
    private long totalElements;
    
    @Schema(description = "Total de páginas", example = "5")
    private int totalPages;
    
    @Schema(description = "Se é a primeira página", example = "true")
    private boolean first;
    
    @Schema(description = "Se é a última página", example = "false")
    private boolean last;

    public static <T> PagedResponseDto<T> of(List<T> content, int page, int size, long totalElements) {
        return PagedResponseDto.<T>builder()
            .content(content)
            .page(page)
            .size(size)
            .totalElements(totalElements)
            .totalPages((int) Math.ceil((double) totalElements / size))
            .first(page == 0)
            .last(page >= (int) Math.ceil((double) totalElements / size) - 1)
            .build();
    }
}