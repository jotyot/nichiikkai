using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UserWordRedo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserWord_AspNetUsers_UserId",
                table: "UserWord");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserWord",
                table: "UserWord");

            migrationBuilder.DropIndex(
                name: "IX_UserWord_UserId",
                table: "UserWord");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserWord");

            migrationBuilder.RenameTable(
                name: "UserWord",
                newName: "UserWords");

            migrationBuilder.AddColumn<string>(
                name: "NIKUserId",
                table: "UserWords",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reading",
                table: "UserWords",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserWords",
                table: "UserWords",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserWords_NIKUserId",
                table: "UserWords",
                column: "NIKUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserWords_AspNetUsers_NIKUserId",
                table: "UserWords",
                column: "NIKUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserWords_AspNetUsers_NIKUserId",
                table: "UserWords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserWords",
                table: "UserWords");

            migrationBuilder.DropIndex(
                name: "IX_UserWords_NIKUserId",
                table: "UserWords");

            migrationBuilder.DropColumn(
                name: "NIKUserId",
                table: "UserWords");

            migrationBuilder.DropColumn(
                name: "Reading",
                table: "UserWords");

            migrationBuilder.RenameTable(
                name: "UserWords",
                newName: "UserWord");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "UserWord",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserWord",
                table: "UserWord",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserWord_UserId",
                table: "UserWord",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserWord_AspNetUsers_UserId",
                table: "UserWord",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
