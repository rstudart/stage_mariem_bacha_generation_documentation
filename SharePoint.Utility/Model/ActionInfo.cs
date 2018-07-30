using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class ActionInfo
    {
        public ActionInfo()
        {
            Properties = new Dictionary<string, string>();
        }
        public string Name { get; set; }
        public Dictionary<string,string> Properties { get; set; }
    }
}
