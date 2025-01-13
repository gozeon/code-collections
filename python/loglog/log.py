import sys

from loguru import logger
from settings import settings  # 从 settings 中导入配置

# 移除默认的日志处理器
logger.remove()

# 设置日志输出到 stdout，日志级别为 INFO
logger.add(sys.stdout, level=settings.LOG_LEVEL)
logger.add("loglog.log", level=settings.LOG_LEVEL, rotation="1 week")


# 返回配置好的 logger 供其他模块使用
def get_logger():
    return logger
