# Maven Wrapper

Este diretório contém o **Maven Wrapper** - uma ferramenta que garante que todos usem a mesma versão do Maven.

## O que é Maven Wrapper?

Maven Wrapper permite executar Maven sem precisar instalá-lo. Ele baixa automaticamente a versão correta do Maven quando você executa `./mvnw` (Linux/Mac) ou `mvnw.cmd` (Windows).

## Como usar

### Linux/Mac:
```bash
./mvnw clean install
./mvnw spring-boot:run
./mvnw test
```

### Windows:
```cmd
mvnw.cmd clean install
mvnw.cmd spring-boot:run
mvnw.cmd test
```

## Versão do Maven

- **Maven Version:** 3.9.6 (fixada no wrapper)
- **Wrapper Version:** 3.2.0

## Configuração

- `wrapper/maven-wrapper.properties` - Configuração do wrapper (URLs, versões)
- `wrapper/maven-wrapper.jar` - JAR do wrapper (não editar)
- `jvm.config` - Configurações JVM para builds

## Benefícios

✅ **Reprodutibilidade:** Todos usam mesma versão Maven  
✅ **Sem instalação:** Não precisa instalar Maven localmente  
✅ **CI/CD:** Garante mesma versão em CI e local  
✅ **Onboarding:** Novos devs só precisam de Java  

## Documentação

- [Maven Wrapper Oficial](https://maven.apache.org/wrapper/)
- [GitHub Maven Wrapper](https://github.com/apache/maven-wrapper)

