// <auto-generated />
using AlgoVisBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AlgoVisBackend.Migrations
{
    [DbContext(typeof(AlgorithmContext))]
    partial class AlgorithmContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("AlgoVisBackend.Models.Algorithm", b =>
                {
                    b.Property<int>("AlgorithmId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<string>("AlgorithmName")
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("JavaScriptImplementation")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("AlgorithmId");

                    b.ToTable("Algorithms");
                });
#pragma warning restore 612, 618
        }
    }
}
