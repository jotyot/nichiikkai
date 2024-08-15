using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Dictionary.Migrations
{
    /// <inheritdoc />
    public partial class Postgre : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "word_bases",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    word = table.Column<string>(type: "text", nullable: false),
                    reading = table.Column<string>(type: "text", nullable: false),
                    frequency_rank = table.Column<int>(type: "integer", nullable: false),
                    jlpt_level = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_word_bases", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "words",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    word_baseid = table.Column<int>(type: "integer", nullable: false),
                    readings = table.Column<List<string>>(type: "text[]", nullable: false),
                    meanings = table.Column<List<string>>(type: "text[]", nullable: false),
                    parts_of_speech = table.Column<List<string>>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_words", x => x.id);
                    table.ForeignKey(
                        name: "FK_words_word_bases_word_baseid",
                        column: x => x.word_baseid,
                        principalTable: "word_bases",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sentences",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    japanese = table.Column<string>(type: "text", nullable: false),
                    english = table.Column<string>(type: "text", nullable: false),
                    WordDataid = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sentences", x => x.id);
                    table.ForeignKey(
                        name: "FK_sentences_words_WordDataid",
                        column: x => x.WordDataid,
                        principalTable: "words",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_sentences_WordDataid",
                table: "sentences",
                column: "WordDataid");

            migrationBuilder.CreateIndex(
                name: "IX_words_word_baseid",
                table: "words",
                column: "word_baseid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "sentences");

            migrationBuilder.DropTable(
                name: "words");

            migrationBuilder.DropTable(
                name: "word_bases");
        }
    }
}
