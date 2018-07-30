using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator.Model
{
    public class ContentType
    {
        public ContentType()
        {
            Fields = new List<string>();
        }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Group { get; set; }
        public string EditFormUrl { get; set; }
        public string NewFormUrl { get; set; }
        public string DisplayFormUrl { get; set; }
        public List<String> Fields { get; set; }
    }
}
