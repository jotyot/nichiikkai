﻿// <auto-generated />
using System;
using DictionaryAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Dictionary.Migrations
{
    [DbContext(typeof(DictionaryContext))]
    [Migration("20240806002745_WordPair")]
    partial class WordPair
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("DictionaryAPI.Data.SentenceData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("English")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Japanese")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("WordDataId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("WordDataId");

                    b.ToTable("Sentences");
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordData", b =>
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

                    b.Property<string>("Meanings")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PartsOfSpeech")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Readings")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("WordPairId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("WordPairId");

                    b.ToTable("Words");
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordPair", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Reading")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Word")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("WordPairs");
                });

            modelBuilder.Entity("DictionaryAPI.Data.SentenceData", b =>
                {
                    b.HasOne("DictionaryAPI.Data.WordData", null)
                        .WithMany("Sentences")
                        .HasForeignKey("WordDataId");
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordData", b =>
                {
                    b.HasOne("DictionaryAPI.Data.WordPair", "WordPair")
                        .WithMany()
                        .HasForeignKey("WordPairId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("WordPair");
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordData", b =>
                {
                    b.Navigation("Sentences");
                });
#pragma warning restore 612, 618
        }
    }
}
