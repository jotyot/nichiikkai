using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dictionary.Migrations
{
    /// <inheritdoc />
    public partial class Sentences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SentenceData_Words_WordDataId",
                table: "SentenceData");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SentenceData",
                table: "SentenceData");

            migrationBuilder.RenameTable(
                name: "SentenceData",
                newName: "Sentences");

            migrationBuilder.RenameIndex(
                name: "IX_SentenceData_WordDataId",
                table: "Sentences",
                newName: "IX_Sentences_WordDataId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sentences",
                table: "Sentences",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sentences_Words_WordDataId",
                table: "Sentences",
                column: "WordDataId",
                principalTable: "Words",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sentences_Words_WordDataId",
                table: "Sentences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sentences",
                table: "Sentences");

            migrationBuilder.RenameTable(
                name: "Sentences",
                newName: "SentenceData");

            migrationBuilder.RenameIndex(
                name: "IX_Sentences_WordDataId",
                table: "SentenceData",
                newName: "IX_SentenceData_WordDataId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SentenceData",
                table: "SentenceData",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SentenceData_Words_WordDataId",
                table: "SentenceData",
                column: "WordDataId",
                principalTable: "Words",
                principalColumn: "Id");
        }
    }
}
