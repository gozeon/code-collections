// Loops - Used to iterate until a condition is met(变化)

pub fn run() {
	let mut count = 0;

	// Infinite Loop
	loop {
		count+=1;
		println!("Number: {}", count);

		if count == 20 {
			break;
		}
	}

	// While Loop(FizzBuzz)
	while count <= 100 {
		if count % 15 == 0 {
			println!("fizebuzz")
		} else if count % 3 == 0 {
			println!("fize");
		} else if count % 5 == 0 {
			println!("buzz");
		} else {
			println!("{}", count)
		}

		// Inc
		count += 1;
	}

	// For Range
	for x in 0..100 {
		println!("{}", x)
	}
}
