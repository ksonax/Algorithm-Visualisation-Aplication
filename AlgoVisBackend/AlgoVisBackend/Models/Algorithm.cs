using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AlgoVisBackend.Models
{
    public class Algorithm
    {
        [Key]
        public int AlgorithmId { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string AlgorithmName { get; set; }
        public string Description { get; set; }
        public string JavaScriptImplementation { get; set; }
    }
}
