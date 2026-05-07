CXX = g++
TARGET = app
LIBS = $(shell pkg-config --cflags --libs librtmp spdlog)

$(TARGET): main.cpp
	$(CXX) -g -Wall main.cpp lib/ada.cpp -o $(TARGET) $(LIBS) -std=c++2c

clean:
	rm -f $(TARGET)

run: $(TARGET)
	./$(TARGET)
