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
                    Nombre = nombreMayuscula,
                    Descripcion = categoria.Descripcion?.Trim()
                };
                _context.Add(nuevaCategoria);
                await _context.SaveChangesAsync();
                return Ok("Categoría creada correctamente");
            }

            return Ok("Ya existe una categoría con ese nombre");
        }


       [HttpPut("{categoriaId}")]
       public async Task<IActionResult> EditarCategoria(int categoriaId, [FromBody] Categoria categoria)
       {
            var nombreMayuscula = categoria.Nombre?.Trim().ToUpper(); //guardamos el nombre en mayuscula

                var editarCategoria = await _context.Categoria.Where(e => e.CategoriaId == categoriaId).SingleOrDefaultAsync();
                //le decimos que busque en el contexto un ID que coincida con el parametro que le pasamos

            if (editarCategoria == null)
            {
                return Ok ("Categoría a editar no encontrada");
            };

            var existeNombre = await _context.Categoria.AnyAsync(e => e.Nombre == nombreMayuscula && e.CategoriaId != categoriaId);
            // si Nombre es igual a la variable NombreMayuscula y que sea distinto al id guardado

            if (!existeNombre)
            {
                editarCategoria.Nombre = nombreMayuscula;
                editarCategoria.Descripcion = categoria.Descripcion?.Trim();
                await _context.SaveChangesAsync();

                return Ok("Categoría editada correctamente");
            }

            return Ok("Ya existe una categoría con ese nombre");
        }

        [HttpDelete("{categoriaId}")]
        public async Task<IActionResult> Eliminar(int categoriaId)
        {
            var categoria = await _context.Categoria.FindAsync(categoriaId);
            //pedimos que busque la categoria por el id que le pasamos por parametro
            if (categoria == null)
            {
                return Ok("Categoría no encontrada");
            }

            _context.Categoria.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        [HttpGet("{categoriaId}")]
        public async Task<IActionResult> ObtenerCategoria(int categoriaId)
        {
            var categoria = await _context.Categoria.FirstOrDefaultAsync(c => c.CategoriaId == categoriaId);

            if (categoria == null)
            {
                return NotFound("Categoría no encontrada");
            }

            return Ok(categoria);
        }
    }
}