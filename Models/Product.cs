using gestion_stock_v3.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Product
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Reference is required.")]
    public string Reference { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Current Quantity must be a positive number.")]
    public int CurrentQuantity { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Minimum Threshold must be a positive number.")]
    public int MinThreshold { get; set; }

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
    public float Price { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    public string Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public bool IsDeleted { get; set; } = false;

    [ForeignKey("Category")]
    public int? CategoryId { get; set; } // Nullable to handle optional category

    [JsonIgnore] // Prevent circular references in JSON serialization
    public virtual Category? CategoryNavigation { get; set; }

    [ForeignKey("Supplier")]
    public int? SupplierId { get; set; } // Nullable to handle optional supplier

    [JsonIgnore] // Prevent circular references in JSON serialization
    public virtual Supplier? Supplier { get; set; }

    // Define StockMovements as a virtual collection to handle relationships
    public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}
