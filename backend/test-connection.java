import java.sql.*;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/vynlo_taste";
        String user = "postgres";
        String password = "96043020";
        
        try {
            System.out.println("🔌 Testando conexão com PostgreSQL...");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✅ Conexão estabelecida com sucesso!");
            
            // Testar consulta
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM users");
            
            if (rs.next()) {
                System.out.println("📊 Total de usuários: " + rs.getInt("total"));
            }
            
            rs.close();
            stmt.close();
            conn.close();
            System.out.println("🔌 Conexão fechada.");
            
        } catch (SQLException e) {
            System.err.println("❌ Erro na conexão: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

