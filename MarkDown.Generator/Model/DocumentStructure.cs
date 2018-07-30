using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator.Model
{
    public class DocumentStructure
    {
        public Farm Farm { get; set; }
        public List<WebApplication> WebApplications { get; set; }
    }
}
