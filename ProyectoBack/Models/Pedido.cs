using System.ComponentModel.DataAnnotations;
namespace ProyectoPedido.Models;

public class Pedido
{
    [Key]
    public int PedidoId { get; set; }
    
    public Estado Estado { get; set; }
    public decimal? Total { get; set; }
    public DateTime? Fecha { get; set; }

    public virtual ICollection<PedidoDetalle> PedidoDetalle { get; set; } = new List<PedidoDetalle>();
}

public enum Estado
{
    Pendiente,
    Confirmado,
    Enviado,
    Entregado,
    Cancelado
}
