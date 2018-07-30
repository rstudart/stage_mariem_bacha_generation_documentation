using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator.Model
{
    public class ListField
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Xml { get; set; }
        public bool IsLookup { get; set; }
        public bool IsRequired { get; set; }
        public string Type { get; set; }
        public bool IsCalculated { get; set; }
    }
}
