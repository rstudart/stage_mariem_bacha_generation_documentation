using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class SiteColumn
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Group { get; set; }
        public string DisplayName { get; set; }
        public string Xml { get; set; }
        public bool IsLookup { get; set; }
    }
}
