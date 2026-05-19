CXX = g++
TARGET = app
SRC = main.cpp
# 基础编译选项
CXXFLAGS = -Wall -std=c++2c $(shell pkg-config --cflags spdlog)
LIBS = -I./ext/include -L./ext/lib -lae $(shell pkg-config --libs spdlog)

# 1. 默认目标（如果不带参数直接执行 make）
all: release

# 默认 Debug 模式
debug: CXXFLAGS += -g
debug: $(TARGET)

# 上线 Release 模式
release: CXXFLAGS += -O3 -DNDEBUG -s
release: clean $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) $(SRC) -o $(TARGET) $(LIBS)

.PHONY: clean run check debug release all
clean:
	rm -f $(TARGET)

run: debug
	./$(TARGET)

# 添加 valgrind 检查目标
check: debug
	valgrind --leak-check=full \
	         --show-leak-kinds=all \
	         --track-origins=yes \
	         ./$(TARGET)
# 	         --verbose \
