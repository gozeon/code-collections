// Arrays - Fixed list where elements are the same data types

pub fn run() {
	let mut numbers: [i32; 5] = [1, 2, 3, 4, 5];

	// Re-assign value
	numbers[2] = 20;

	println!("{:?}", numbers);

	// Get single val
	println!("Single Value: {}", numbers[0]);

	// Get array length
	println!("Array length: {}", numbers.len());

	// Arrays are stack(栈) allocated(分配)
	println!("Array occuopies {} bytes", std::mem::size_of_val(&numbers));

	// Get Slice
	let slice: &[i32] = &numbers[0..2];

	println!("Slice: {:?}", slice);
}
