﻿// <auto-generated />
using System.Collections.Generic;
using DictionaryAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Dictionary.Migrations
{
    [DbContext(typeof(DictionaryContext))]
    [Migration("20240818000306_WordDataIds")]
    partial class WordDataIds
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("DictionaryAPI.Data.SentenceData", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("WordDataid")
                        .HasColumnType("integer");

                    b.Property<string>("english")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("japanese")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.HasIndex("WordDataid");

                    b.ToTable("sentences");
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordBase", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("frequency_rank")
                        .HasColumnType("integer");

                    b.Property<string>("jlpt_level")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("meaning")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("reading")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("word")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("word_bases");
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordData", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<List<string>>("meanings")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<List<string>>("parts_of_speech")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<List<string>>("readings")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<int>("word_baseid")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("word_baseid");

                    b.ToTable("words");
                });

            modelBuilder.Entity("DictionaryAPI.Data.SentenceData", b =>
                {
                    b.HasOne("DictionaryAPI.Data.WordData", null)
                        .WithMany("sentences")
                        .HasForeignKey("WordDataid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordData", b =>
                {
                    b.HasOne("DictionaryAPI.Data.WordBase", "word_base")
                        .WithMany()
                        .HasForeignKey("word_baseid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("word_base");
                });

            modelBuilder.Entity("DictionaryAPI.Data.WordData", b =>
                {
                    b.Navigation("sentences");
                });
#pragma warning restore 612, 618
        }
    }
}
