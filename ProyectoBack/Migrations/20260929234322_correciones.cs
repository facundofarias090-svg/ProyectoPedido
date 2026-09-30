using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoPedido.Migrations
{
    /// <inheritdoc />
    public partial class correciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Producto_Categoria_CategoriaId",
                table: "Producto");

            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1
                    FROM Producto AS p
                    LEFT JOIN Categoria AS c ON c.CategoriaId = p.CategoriaId
                    WHERE c.CategoriaId IS NULL
                )
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM Categoria WHERE Nombre = N'Sin categoría')
                        INSERT INTO Categoria (Nombre) VALUES (N'Sin categoría');

                    UPDATE p
                    SET CategoriaId = (
                        SELECT TOP (1) CategoriaId
                        FROM Categoria
                        WHERE Nombre = N'Sin categoría'
                        ORDER BY CategoriaId
                    )
                    FROM Producto AS p
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM Categoria AS c
                        WHERE c.CategoriaId = p.CategoriaId
                    );
                END");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Producto",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CategoriaId",
                table: "Producto",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Categoria",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Producto_Categoria_CategoriaId",
                table: "Producto",
                column: "CategoriaId",
                principalTable: "Categoria",
                principalColumn: "CategoriaId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Producto_Categoria_CategoriaId",
                table: "Producto");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Producto",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "CategoriaId",
                table: "Producto",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Categoria",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_Producto_Categoria_CategoriaId",
                table: "Producto",
                column: "CategoriaId",
                principalTable: "Categoria",
                principalColumn: "CategoriaId");
        }
    }
}
