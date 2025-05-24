using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gestion_stock_v3.Data;
using gestion_stock_v3.Models; // Assuming Product model is here
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

// Helper class to mock DbSet, adapted from MSDN or common examples
public static class DbSetMock
{
    public static Mock<DbSet<T>> Create<T>(params T[] elements) where T : class
    {
        return Create(elements.AsQueryable());
    }

    public static Mock<DbSet<T>> Create<T>(IQueryable<T> elements) where T : class
    {
        var mockSet = new Mock<DbSet<T>>();
        mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(elements.Provider);
        mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(elements.Expression);
        mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(elements.ElementType);
        mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(() => elements.GetEnumerator());

        // For Async operations
        mockSet.As<IAsyncEnumerable<T>>()
            .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
            .Returns(new TestAsyncEnumerator<T>(elements.GetEnumerator()));
        
        // Mock FindAsync
        mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>()))
               .ReturnsAsync((object[] ids) => elements.FirstOrDefault(p => GetId(p) == (int)ids[0]));

        return mockSet;
    }
    
    private static int GetId<T>(T entity) where T : class
    {
        // A simple way to get Id, assuming entity has an 'Id' property.
        // This might need to be more robust depending on your entity structure.
        var property = typeof(T).GetProperty("Id");
        if (property == null) throw new ArgumentException("Entity does not have an 'Id' property.");
        return (int)property.GetValue(entity);
    }
}

// Helper class for async enumeration
public class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
{
    private readonly IEnumerator<T> _enumerator;

    public TestAsyncEnumerator(IEnumerator<T> enumerator)
    {
        _enumerator = enumerator ?? throw new ArgumentNullException(nameof(enumerator));
    }

    public T Current => _enumerator.Current;

    public ValueTask DisposeAsync()
    {
        _enumerator.Dispose();
        return ValueTask.CompletedTask;
    }

    public ValueTask<bool> MoveNextAsync()
    {
        return new ValueTask<bool>(_enumerator.MoveNext());
    }
}


public class ProductControllerTests
{
    private readonly Mock<ApplicationDbContext> _mockContext;
    private readonly ProductController _controller;
    private readonly List<Product> _productList;

    public ProductControllerTests()
    {
        _mockContext = new Mock<ApplicationDbContext>(new DbContextOptions<ApplicationDbContext>());
        _productList = new List<Product>();

        // Setup DbSet mock
        var mockProductDbSet = DbSetMock.Create(_productList.AsQueryable());
        _mockContext.Setup(c => c.Products).Returns(mockProductDbSet.Object);
        
        // Mock SaveChangesAsync
        _mockContext.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1) // Simulate one record affected
            .Callback(() => { /* Can add logic here if needed after save */ });

        _controller = new ProductController(_mockContext.Object);

        // Mock User for [Authorize] - For controller actions that don't directly use UserManager,
        // this basic setup of HttpContext might be enough if the attribute is the only concern.
        // However, testing [Authorize] attributes in unit tests is often limited.
        // Integration tests are better for full authorization pipeline testing.
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Role, "Admin"),
        }, "mock"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    private void SeedProducts(params Product[] products)
    {
        _productList.AddRange(products);
    }

    [Fact]
    public async Task DeleteProduct_ValidId_ProductExists_ShouldSoftDeleteAndReturnNoContent()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Test Product", IsDeleted = false, Status = "In Stock", UpdatedAt = DateTime.UtcNow.AddDays(-1) };
        SeedProducts(product);
        
        // Act
        var result = await _controller.DeleteProduct(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
        Assert.True(product.IsDeleted);
        Assert.Equal("Archived", product.Status);
        Assert.True(product.UpdatedAt > DateTime.UtcNow.AddMinutes(-1)); // Check if UpdatedAt was recently set
        _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once());
    }

    [Fact]
    public async Task DeleteProduct_InvalidId_ProductNotFound_ShouldReturnNotFound()
    {
        // Arrange
        SeedProducts(new Product { Id = 1, Name = "Existing Product" });
        
        // Act
        var result = await _controller.DeleteProduct(99); // Non-existent ID

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("Product with ID 99 not found.", ((dynamic)notFoundResult.Value).Message);
        _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never());
    }

    [Fact]
    public async Task DeleteProduct_ValidId_ProductAlreadyDeleted_ShouldReturnBadRequest()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Test Product", IsDeleted = true, Status = "Archived" };
        SeedProducts(product);

        // Act
        var result = await _controller.DeleteProduct(1);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Product with ID 1 is already marked as deleted.", ((dynamic)badRequestResult.Value).Message);
        _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never());
    }
    
    [Fact]
    public async Task DeleteProduct_DbUpdateConcurrencyException_ShouldReturnStatusCode500()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Test Product", IsDeleted = false, Status = "In Stock" };
        SeedProducts(product);

        _mockContext.Setup(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DbUpdateConcurrencyException("Simulated concurrency error"));

        // Act
        var result = await _controller.DeleteProduct(1);

        // Assert
        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, statusCodeResult.StatusCode);
        Assert.Contains("A concurrency error occurred", ((dynamic)statusCodeResult.Value).Message);
    }
}
