using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dictionary.Migrations
{
    /// <inheritdoc />
    public partial class MeaningPreview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "meaning",
                table: "word_bases",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "meaning",
                table: "word_bases");
        }
    }
}
