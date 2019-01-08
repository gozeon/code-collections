colors = "RRGGBBYYKK"
lines = 20

count = 0
while count < lines
  start = count.modulo(colors.length)
  first_half = colors[start..-1]
  second_half = colors[0...start]
  puts first_half + second_half
  count += 1
end
