CXX = g++
TARGET = rtmp_record
LIBS = $(shell pkg-config --cflags --libs librtmp)

$(TARGET): main.cpp
# 	$(CXX) -g -Wall main.cpp -o $(TARGET) $(LIBS)
# 	$(CXX) -g -Wall main.cpp lib/ada.cpp -o $(TARGET) $(LIBS) -Ilib -std=c++20
	$(CXX) -g -Wall main.cpp lib/ada.cpp -o $(TARGET) $(LIBS) -Ilib -lz -lgmp -lpthread -std=c++20

clean:
	rm -f $(TARGET)