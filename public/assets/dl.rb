require 'open-uri'

119.times do |index|
	puts index
	number_with_zeros = (index + 1).to_s.rjust(3, "0")
	File.open("e#{number_with_zeros}.png", "wb") do |file|
	  file.write open("https://elements.wlonk.com/elems/e#{number_with_zeros}.png").read
	end
end