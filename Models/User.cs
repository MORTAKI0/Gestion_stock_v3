using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace gestion_stock_v3.Models
{
    public class User : IdentityUser
    {
        public string Role { get; set; } = "User"; // Example default value
        public string Status { get; set; } = "Active"; // Ensure default value for Status
        public DateTime LastLogin { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public virtual ICollection<StockMovement> StockMovements { get; set; }
    }
}
