using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RazorPagesMovie.Models
{
	public class Movie
	{
		public int Id { get; set; }
		[StringLength(60, MinimumLength = 3)]
		[Required]
		public string? Title { get; set; }
		[Display(Name = "发布日期")]
		[Required]
		public DateTime ReleaseDate { get; set; }
		[RegularExpression(@"^[A-Z]+[a-zA-Z\s]*$")]
		[Required]
		[StringLength(30)]
		public string? Genre { get; set; }
		[Column(TypeName = "decimal(18,2)")]
		[Range(1, 100)]
		[DataType(DataType.Currency)]
		public decimal Price { get; set; }
		[RegularExpression(@"^[A-Z]+[a-zA-Z0-9""'\s-]*$")]
		[StringLength(5)]
		[Required]
		public string Rating { get; set; } = string.Empty;
	}
}
