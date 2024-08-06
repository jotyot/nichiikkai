using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dictionary.Migrations
{
    /// <inheritdoc />
    public partial class WordPair : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Words_WordPair_WordPairId",
                table: "Words");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WordPair",
                table: "WordPair");

            migrationBuilder.RenameTable(
                name: "WordPair",
                newName: "WordPairs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WordPairs",
                table: "WordPairs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Words_WordPairs_WordPairId",
                table: "Words",
                column: "WordPairId",
                principalTable: "WordPairs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Words_WordPairs_WordPairId",
                table: "Words");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WordPairs",
                table: "WordPairs");

            migrationBuilder.RenameTable(
                name: "WordPairs",
                newName: "WordPair");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WordPair",
                table: "WordPair",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Words_WordPair_WordPairId",
                table: "Words",
                column: "WordPairId",
                principalTable: "WordPair",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
