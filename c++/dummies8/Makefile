CXX = g++
TARGET = app
LIBS = $(shell pkg-config --cflags --libs zlib)

$(TARGET): main.cpp
	$(CXX) -g -Wall main.cpp -o $(TARGET) $(LIBS) -std=c++2c

clean:
	rm -f $(TARGET)

run: $(TARGET)
	./$(TARGET)