// Variables hold primitive(原始) data or rederences to data
// Variables are immutable(一成不变的) by default
// Rust is a block-scoped language

pub fn run() {
	let name = "Bard";
	let mut age = 37;
	println!("My name is {} and I am {}", name, age);

	age = 38;

	println!("My name is {} and I am {}", name, age);

	// Define constant
	const ID: i32 = 001;
	println!("ID: {}", ID);

	// Assign multiple vars
	let (my_name, my_age) = ("Bard", 37);
	println!("{} is {}", my_name, my_age);
}
