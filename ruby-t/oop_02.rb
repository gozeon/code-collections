class Dog
  attr_reader :name, :age

  # if value == ''
  #   raise "Name can't be blank."
  # end
  def name=(value)
    raise "Name can't be blank." if value == ''

    @name = value
  end

  def age=(value)
    raise "An age of #{value} isn't valid!" if value < 0

    @age = value
  end

  def move(destination)
    puts "#{@name} run to the #{destination}."
  end

  def talk
    puts "#{@name} says Bark!"
  end

  def report_age
    puts "#{@name} is #{@age} years old."
  end
end

dog = Dog.new
dog.name = 'Tom'
dog.age = 2

dog.talk
dog.report_age
dog.move('bed')
