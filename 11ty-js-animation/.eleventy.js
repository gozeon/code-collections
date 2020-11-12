module.exports = function (eleventyConfig) {
	// Input directory: src
	// Output directory: _site

	// The following copies to `_site/img`
	// https://www.11ty.dev/docs/copy/
	eleventyConfig.addPassthroughCopy("images");
};
