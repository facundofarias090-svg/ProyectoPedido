using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoPedido.Migrations
{
    /// <inheritdoc />
    public partial class desccat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Categoria",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Categoria");
        }
    }
}
