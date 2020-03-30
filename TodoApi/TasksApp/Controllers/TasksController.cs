using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using TasksApp.Models;
using Task = TasksApp.Models.Task;

namespace TasksApp.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class TasksController : ApiController
    {
        private TaskDbConfiguration db = new TaskDbConfiguration();

        // GET: api/Tasks
        public IQueryable<Task> GetTasks()
        {
            return db.Tasks.Where(p => !p.IsDelete);
        }

        // GET: api/Tasks/5
        [ResponseType(typeof(Task))]
        public async Task<IHttpActionResult> GetTask(int id)
        {
            Task task = await db.Tasks.FindAsync(id);
            if (task == null || task.IsDelete)
            {
                return NotFound();
            }

            return Ok(task);
        }

        // PUT: api/Tasks/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutTask(int id, Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != task.Id)
            {
                return BadRequest();
            }

            db.Entry(task).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Tasks
        [ResponseType(typeof(Task))]
        public async Task<IHttpActionResult> PostTask(Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tasks.Add(task);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = task.Id }, task);
        }

        // DELETE: api/Tasks/5
        [ResponseType(typeof(Task))]
        public async Task<IHttpActionResult> DeleteTask(int id)
        {
            Task task = await db.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            task.IsDelete = true;
            db.Entry(task).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(task);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TaskExists(int id)
        {
            return db.Tasks.Count(e => e.Id == id) > 0;
        }
    }
}