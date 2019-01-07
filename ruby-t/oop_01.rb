class Mage
  attr_accessor :name, :spell

  def enchant(target)
    puts "#{@name} casts #{@spell} on #{target.name}"
  end
end

merlin = Mage.new
merlin.name = 'Merlin'
merlin.spell = 'Shrink'
merlin.enchant(merlin)

# set
# attr_writer :name
#
# def name=(new_name)
#   @name = new_name
# end
#
# get
# attr_reader :name
#
# def name
#   @name
# end
#
# all
# attr_accessor :name
#
# def name=(new_name)
#   @name = new_name
# end
# def name
#   @name
# end
