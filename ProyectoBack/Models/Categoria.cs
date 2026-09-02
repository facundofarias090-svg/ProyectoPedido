using System.ComponentModel.DataAnnotations;
namespace ProyectoPedido.Models;

public class Categoria
{
    [Key]
    public int CategoriaId { get; set; }

    public string? Nombre { get; set; }

    public virtual ICollection<Producto>? Producto { get; set; }
}