﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NIKAPI.Data;

#nullable disable

namespace backend.Migrations.DictionaryDb
{
    [DbContext(typeof(DictionaryDbContext))]
    partial class DictionaryDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("NIKAPI.Data.DictionaryWord", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("FrequencyRank")
                        .HasColumnType("int");

                    b.Property<string>("JLPTLevel")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Meaning")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PartsOfSpeech")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Reading")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Sentences")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Synonyms")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Word")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("DictionaryWords");
                });
#pragma warning restore 612, 618
        }
    }
}
