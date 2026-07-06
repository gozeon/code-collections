using SimpleERP.Data;

namespace SimpleERP.Services
{
    public interface IIdGeneratorService
    {
        Task<string> GetNextIdAsync(string prefix = "DO");
    }

    public class IdGeneratorService : IIdGeneratorService
    {
        private readonly ApplicationDbContext _context;

        public IdGeneratorService(ApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }

        public async Task<string> GetNextIdAsync(string prefix = "DO")
        {
            // 确保大写 & 去掉空格
            prefix = prefix.Trim().ToUpper();

            string currentDay = DateTime.Now.ToString("yyyyMMdd");

            string dbKey = $"{prefix}-{currentDay}";
            int nextValue = 1;

            // 开启事务，确保并发安全
            using(var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // 查询前缀是否有记录
                    var sequence = await _context.IdSequences.FindAsync(dbKey);
                    if(sequence == null)
                    {
                        // 没有，初始化为1
                        sequence = new IdSequence
                        {
                            PrefixDayKey = dbKey,
                            CurrentValue = 1
                        };
                        await _context.IdSequences.AddAsync(sequence);
                    }
                    else
                    {
                        // 自增
                        sequence.CurrentValue++;
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    nextValue = sequence.CurrentValue;
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }

            // nextValue:D5 最大是 99999 单/天, 可以使用ToHex36进行扩容

            return $"{prefix}-{currentDay}-{nextValue:D5}";
        }

        // 36进制转换辅助方法（0-9，A-Z）
        private static string ToHex36(long value, int width)
        {
            const string candidates = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string result = string.Empty;

            if (value == 0) return "0".PadLeft(width, '0');

            while (value > 0)
            {
                result = candidates[(int)(value % 36)] + result;
                value /= 36;
            }
            return result.PadLeft(width, '0');
        }
    }
}
