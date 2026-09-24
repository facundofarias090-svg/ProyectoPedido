using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ProyectoPedido.Models;

public class Producto
{
    [Key]
    public int ProductoId { get; set; }
    [ForeignKey("CategoriaId")]
    public int CategoriaId { get; set; }

    public string Nombre { get; set; }
    public string? Descripcion { get; set; }
    public decimal? PrecioCosto { get; set; }
    public decimal? PrecioVenta { get; set; }
    public int? Stock { get; set; }

    public virtual Categoria Categoria { get; set; }
    public virtual ICollection<PedidoDetalle> PedidoDetalle { get; set; } = new List<PedidoDetalle>();
}
