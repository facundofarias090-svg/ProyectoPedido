using ProyectoPedido.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoPedido.Models;

namespace ProyectoPedido.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> ListadoProducto()
        {
            var productos = await _context.Producto.ToListAsync();
            productos = productos.Select(p => new Producto
            {
                ProductoId = p.ProductoId,
                CategoriaId = p.CategoriaId,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                PrecioCosto = p.PrecioCosto,
                PrecioVenta = p.PrecioVenta,
                Stock = p.Stock
            }).ToList();
        
            return Ok(productos);
        }

        [HttpPost]
        public async Task<IActionResult> CrearProducto([FromBody] Producto producto)
        {
            var nombreMayuscula = producto.Nombre?.Trim().ToUpper();
            var existeProducto = await _context.Producto.AnyAsync(e => e.Nombre == nombreMayuscula);

            if (!existeProducto)
            {
                producto.Nombre = nombreMayuscula;
                _context.Add(producto);
                await _context.SaveChangesAsync();
                return Ok("Producto creado correctamente");
            }

            return Conflict("El producto ya existe");
        }
    }
}