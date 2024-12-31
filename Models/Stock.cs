using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gestion_stock_v3.Models
{
    public class Stock
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int CurrentQuantity { get; set; }
        public bool IsCritical { get; set; }
        public float Value { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}
