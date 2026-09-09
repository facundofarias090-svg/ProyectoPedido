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

        [HttpPut("{productoId}")]
        public async Task<IActionResult> EditarProducto(int productoId, [FromBody] Producto producto)
        {
            var nombreMayuscula = producto.Nombre?.Trim().ToUpper();

            var editarProducto = await _context.Producto.FindAsync(productoId);

            if (editarProducto == null)
            {
                return Ok("Producto a editar no encontrado");
            }

            var existeNombre = await _context.Producto.AnyAsync(e =>
                e.Nombre == nombreMayuscula && e.ProductoId != productoId);

            if (existeNombre)
            {
                return Ok("Ya existe un producto con ese nombre");
            }

            editarProducto.CategoriaId = producto.CategoriaId;
            editarProducto.Nombre = nombreMayuscula;
            editarProducto.Descripcion = producto.Descripcion;
            editarProducto.PrecioCosto = producto.PrecioCosto;
            editarProducto.PrecioVenta = producto.PrecioVenta;
            editarProducto.Stock = producto.Stock;

            await _context.SaveChangesAsync();

            return Ok("Producto editado correctamente");
        }

        [HttpDelete("{productoId}")]
        public async Task<IActionResult> EliminarProducto(int productoId)
        {
            var producto = await _context.Producto.FindAsync(productoId);

            if (producto == null)
            {
                return Ok("Producto no encontrado");
            }

            _context.Producto.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{productoId}")]
        public async Task<IActionResult> ObtenerProductoPorId(int productoId)
        {
            var producto = await _context.Producto
                .FirstOrDefaultAsync(p => p.ProductoId == productoId);

            if (producto == null)
            {
                return NotFound("Producto no encontrado");
            }

            return Ok(producto);
        }
    }
}