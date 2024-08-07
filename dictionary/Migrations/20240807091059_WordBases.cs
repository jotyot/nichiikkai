using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dictionary.Migrations
{
    /// <inheritdoc />
    public partial class WordBases : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Words_WordPairs_WordPairId",
                table: "Words");

            migrationBuilder.DropTable(
                name: "WordPairs");

            migrationBuilder.DropColumn(
                name: "FrequencyRank",
                table: "Words");

            migrationBuilder.DropColumn(
                name: "JLPTLevel",
                table: "Words");

            migrationBuilder.RenameColumn(
                name: "WordPairId",
                table: "Words",
                newName: "WordBaseId");

            migrationBuilder.RenameIndex(
                name: "IX_Words_WordPairId",
                table: "Words",
                newName: "IX_Words_WordBaseId");

            migrationBuilder.CreateTable(
                name: "WordBases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Word = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reading = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FrequencyRank = table.Column<int>(type: "int", nullable: false),
                    JLPTLevel = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WordBases", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Words_WordBases_WordBaseId",
                table: "Words",
                column: "WordBaseId",
                principalTable: "WordBases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Words_WordBases_WordBaseId",
                table: "Words");

            migrationBuilder.DropTable(
                name: "WordBases");

            migrationBuilder.RenameColumn(
                name: "WordBaseId",
                table: "Words",
                newName: "WordPairId");

            migrationBuilder.RenameIndex(
                name: "IX_Words_WordBaseId",
                table: "Words",
                newName: "IX_Words_WordPairId");

            migrationBuilder.AddColumn<int>(
                name: "FrequencyRank",
                table: "Words",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "JLPTLevel",
                table: "Words",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "WordPairs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Reading = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Word = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WordPairs", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Words_WordPairs_WordPairId",
                table: "Words",
                column: "WordPairId",
                principalTable: "WordPairs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
