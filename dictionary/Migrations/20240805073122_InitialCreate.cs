using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dictionary.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WordPair",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Word = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reading = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WordPair", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Words",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WordPairId = table.Column<int>(type: "int", nullable: false),
                    JLPTLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Readings = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Meanings = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartsOfSpeech = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FrequencyRank = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Words", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Words_WordPair_WordPairId",
                        column: x => x.WordPairId,
                        principalTable: "WordPair",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SentenceData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Japanese = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    English = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WordDataId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentenceData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SentenceData_Words_WordDataId",
                        column: x => x.WordDataId,
                        principalTable: "Words",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_SentenceData_WordDataId",
                table: "SentenceData",
                column: "WordDataId");

            migrationBuilder.CreateIndex(
                name: "IX_Words_WordPairId",
                table: "Words",
                column: "WordPairId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SentenceData");

            migrationBuilder.DropTable(
                name: "Words");

            migrationBuilder.DropTable(
                name: "WordPair");
        }
    }
}
