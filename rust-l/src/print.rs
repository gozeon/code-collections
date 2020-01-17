pub fn run() {
	// Print to console
	println!("Hello from the print.rs file");

	println!("Number: {}", 1);

	// Base Formatting
	println!("{} is from {}", "Bard", "Mass");

	// Positional Arguments
	println!("{0} is from {1} and {0} link to {2}", "Bard", "Mass", "code");

	// Named Arguments
	println!("{name} likes to play {activity}", name="John", activity="Baseball" );

	// Placeholder traits(特质)
	println!("Binary: {:b} Hex: {:x} Octal: {:o}",10, 10, 10 );

	// Placeholder for debug trait
	println!("{:?}",(12, true, "hello") );

	// Basic math
	println!("10 + 10 ={}", 10 + 10);
}
