using gestion_stock_v3.Data;
using gestion_stock_v3.Models; // Ensure your User model and other custom models are imported
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add DbContext for Entity Framework Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity with the custom User class
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Add MVC services
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Role and user seeding logic
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = services.GetRequiredService<UserManager<User>>(); // Ensure UserManager uses the custom User class
    await SeedRolesAndAdminAsync(roleManager, userManager);
}

// Middleware pipeline for React and API
if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles(); // Serve React index.html
    app.UseStaticFiles();  // Serve static files from wwwroot
    app.MapFallbackToFile("index.html"); // Handle React routing
}

app.UseRouting();

app.UseAuthentication(); // Enable Authentication Middleware
app.UseAuthorization();  // Enable Authorization Middleware

// Map API controllers
app.MapControllers();

// Proxy Vite dev server during development
if (app.Environment.IsDevelopment())
{
    app.UseWhen(context => !context.Request.Path.StartsWithSegments("/api"), builder =>
    {
        builder.Run(async context =>
        {
            var viteDevServerUrl = "http://localhost:5173"; // Vite dev server URL

            try
            {
                using var httpClient = new HttpClient();
                var requestMessage = new HttpRequestMessage(
                    new HttpMethod(context.Request.Method),
                    $"{viteDevServerUrl}{context.Request.Path}{context.Request.QueryString}");

                foreach (var header in context.Request.Headers)
                {
                    if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray()))
                    {
                        requestMessage.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                    }
                }

                var responseMessage = await httpClient.SendAsync(requestMessage);

                context.Response.StatusCode = (int)responseMessage.StatusCode;

                foreach (var header in responseMessage.Headers)
                {
                    context.Response.Headers[header.Key] = header.Value.ToArray();
                }

                foreach (var header in responseMessage.Content.Headers)
                {
                    context.Response.Headers[header.Key] = header.Value.ToArray();
                }

                await responseMessage.Content.CopyToAsync(context.Response.Body);
            }
            catch (HttpRequestException ex)
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync($"Proxy Error: Unable to connect to Vite dev server at {viteDevServerUrl}. Please make sure the Vite server is running.\nError: {ex.Message}");
            }
        });
    });
}

app.Run();
// Seed roles and admin user
async Task SeedRolesAndAdminAsync(RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
{
    Console.WriteLine("Starting Role and User Seeding...");

    // Create roles
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        Console.WriteLine("Creating Admin role...");
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }
    if (!await roleManager.RoleExistsAsync("Client"))
    {
        Console.WriteLine("Creating Client role...");
        await roleManager.CreateAsync(new IdentityRole("Client"));
    }

    // Create admin user
    var adminEmail = "admin@example.com";
    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        Console.WriteLine("Creating Admin user...");
        var adminUser = new User
        {
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true,
            Role = "Admin", // Custom property
            Status = "Active" // Provide a default value for Status
        };

        var result = await userManager.CreateAsync(adminUser, "Admin@1234");

        if (result.Succeeded)
        {
            Console.WriteLine("Assigning Admin role to Admin user...");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
        else
        {
            Console.WriteLine($"Failed to create Admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }
    }
    else
    {
        Console.WriteLine("Admin user already exists.");
    }
}

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
