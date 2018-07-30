using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator.Model
{
    public class Feature
    {
        public Feature()
        {
        }
        public string id { get; set; }
        public string Description { get; set; }
        public bool Enable { get; set; }
    }
}
