using AlgoVisBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlgoVisBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AlgorithmController : ControllerBase
    {
        private readonly AlgorithmContext _context;

        public AlgorithmController(AlgorithmContext context)
        {
            _context = context;
        }
        // GET: api/<AlgorithmController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Algorithm>>> GetAlgorithms()
        {
            return await _context.Algorithms.ToListAsync();
        }

        // GET api/<AlgorithmController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Algorithm>> GetAlgorithm(int id)
        {
            var algorithm = await _context.Algorithms.FindAsync(id);

            if (algorithm == null)
            {
                return NotFound();
            }

            return algorithm;
        }

        // POST api/<AlgorithmController>
        [HttpPost]
        public async Task<ActionResult<Algorithm>> PostAlgorithm(Algorithm paymentDetail)
        {
            _context.Algorithms.Add(paymentDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAlgorithm", new { id = paymentDetail.AlgorithmId }, paymentDetail);
        }

        // PUT api/<AlgorithmController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlgorithm(int id, Algorithm algorithm)
        {
            if (id != algorithm.AlgorithmId)
            {
                return BadRequest();
            }

            _context.Entry(algorithm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlgortihmExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE api/<AlgorithmController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlgortihm(int id)
        {
            var algorithm = await _context.Algorithms.FindAsync(id);
            if (algorithm == null)
            {
                return NotFound();
            }

            _context.Algorithms.Remove(algorithm);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool AlgortihmExists(int id)
        {
            return _context.Algorithms.Any(e => e.AlgorithmId == id);
        }
    }
}
