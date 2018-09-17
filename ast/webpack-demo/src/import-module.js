const importButton = document.createElement("button");
importButton.innerHTML = "Import";
importButton.addEventListener(
	"click",
	function() {
		import("./hello").then(({ default: sayHello }) => {
			sayHello("hello");
		});
	},
	false
);

document.body.appendChild(importButton);
