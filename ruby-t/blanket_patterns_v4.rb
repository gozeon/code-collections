colors = '|/|/|=|/|'
lines = 20
halfway = (lines / 2).floor

colors_array = colors.split('')
1.upto(lines) do |i|
  first = colors_array.shift
  colors_array << first
  puts colors_array.join
end

colors_array.length.times do |x|
  if colors_array[x] == '/'
    colors_array[x] = '\\'
  end
end
puts colors_array.join

halfway.upto(lines) do
  last = colors_array.pop
  colors_array.unshift(last)
  puts colors_array.join
end
