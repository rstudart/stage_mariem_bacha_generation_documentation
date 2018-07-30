using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class MenuItem
    {
        public string Header { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public List<String> Audiance { get; set; }
    }
}
