using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ProyectoPedido.Models;

public class PedidoDetalle
{
    [Key]
    public int PedidoDetalleId { get; set; }
    [ForeignKey("PedidoId")]
    public int PedidoId { get; set; }
    [ForeignKey("ProductoId")]
    public int ProductoId { get; set; }

    public decimal? PrecioUnitario { get; set; }
    public int? Cantidad { get; set; }

    public virtual Pedido Pedido { get; set; }
    public virtual Producto Producto { get; set; }
}
