using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Niffer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSubscription",
                table: "UserSubscription");

            migrationBuilder.RenameTable(
                name: "UserSubscription",
                newName: "UserSubscriptions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSubscriptions",
                table: "UserSubscriptions",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSubscriptions",
                table: "UserSubscriptions");

            migrationBuilder.RenameTable(
                name: "UserSubscriptions",
                newName: "UserSubscription");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSubscription",
                table: "UserSubscription",
                column: "Id");
        }
    }
}
