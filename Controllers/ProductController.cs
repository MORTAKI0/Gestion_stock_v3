using gestion_stock_v3.Data;
using Microsoft.AspNetCore.Authorization; // Added for [Authorize]
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System; // Added for DateTime
using System.Linq;
using System.Threading.Tasks;

namespace gestion_stock_v3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetProducts")]
        public async Task<IActionResult> GetProducts(string search = null, int? categoryId = null, int? supplierId = null, string status = null)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Reference.Contains(search));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            if (supplierId.HasValue)
            {
                query = query.Where(p => p.SupplierId == supplierId);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(p => p.Status == status);
            }

            var products = await query
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Reference,
                    p.Price,
                    p.Status,
                    CategoryName = p.CategoryNavigation.Name,
                    SupplierName = p.Supplier.Name
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                product.CreatedAt = DateTime.UtcNow;
                product.UpdatedAt = DateTime.UtcNow;
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    product.Id,
                    product.Name,
                    product.Reference,
                    product.Price,
                    product.Status,
                    CategoryName = product.CategoryNavigation?.Name,
                    SupplierName = product.Supplier?.Name
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only Admins can delete products
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { Message = $"Product with ID {id} not found." });
            }

            if (product.IsDeleted)
            {
                // Optionally, return a specific message or status if already deleted
                return BadRequest(new { Message = $"Product with ID {id} is already marked as deleted." });
            }

            product.IsDeleted = true;
            product.Status = "Archived"; // Set status to indicate it's archived/deleted
            product.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent(); // Standard response for successful DELETE
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Log the exception details if necessary
                return StatusCode(500, new { Message = "A concurrency error occurred while trying to delete the product. " + ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details if necessary
                return StatusCode(500, new { Message = "An error occurred while deleting the product. " + ex.Message });
            }
        }
    }
}
