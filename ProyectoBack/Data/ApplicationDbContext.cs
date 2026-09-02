using Microsoft.EntityFrameworkCore;
using ProyectoPedido.Models;

namespace ProyectoPedido.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Producto> Producto { get; set; } 
    public DbSet<Categoria> Categoria { get; set; }
    public DbSet<Pedido> Pedido { get; set; }
    public DbSet<PedidoDetalle> PedidoDetalle { get; set; }
}
