using MySqlConnector;
using System.Data;

namespace UserProfileApi.Interfaces
{
    public interface IUserDbConnectionFactory { IDbConnection CreateConnection(); }
    public interface IMediaDbConnectionFactory { IDbConnection CreateConnection(); }
    public interface IFaqDbConnectionFactory { IDbConnection CreateConnection(); }

    public class UserDbConnectionFactory : IUserDbConnectionFactory
    {
        private readonly string _connectionString;
        public UserDbConnectionFactory(string connectionString) => _connectionString = connectionString;
        public IDbConnection CreateConnection() => new MySqlConnection(_connectionString);
    }

    public class MediaDbConnectionFactory : IMediaDbConnectionFactory
    {
        private readonly string _connectionString;
        public MediaDbConnectionFactory(string connectionString) => _connectionString = connectionString;
        public IDbConnection CreateConnection() => new MySqlConnection(_connectionString);
    }

    public class FaqDbConnectionFactory : IFaqDbConnectionFactory
    {
        private readonly string _connectionString;
        public FaqDbConnectionFactory(string connectionString) => _connectionString = connectionString;
        public IDbConnection CreateConnection() => new MySqlConnection(_connectionString);
    }

}
