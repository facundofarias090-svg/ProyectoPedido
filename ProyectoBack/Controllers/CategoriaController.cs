using ProyectoPedido.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoPedido.Models;

namespace ProyectoPedido.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriaController(ApplicationDbContext context)
        {
            _context = context;
        }



        [HttpGet]
        public async Task<IActionResult> ListadoCategoria()
        {
            var categoria = await _context.Categoria.ToListAsync();

            return Ok(categoria);
        }


        [HttpPost]
        public async Task<IActionResult> CrearCategoria([FromBody] Categoria categoria)
        {
            var nombreMayuscula = categoria.Nombre?.Trim().ToUpper();

            var existeCategoria = await _context.Categoria.AnyAsync(e => e.Nombre == nombreMayuscula);

            if (!existeCategoria)
            {
              var nuevaCategoria = new Categoria
                {
                    Nombre = nombreMayuscula
                };
                            _context.Add(nuevaCategoria);
                await _context.SaveChangesAsync();
                return Ok("Categoría creada correctamente");
        }
        return Ok();    
       }
    }
}