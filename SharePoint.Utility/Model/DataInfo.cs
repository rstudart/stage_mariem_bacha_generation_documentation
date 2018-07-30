using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class Data
    {
        public Data()
        {
            this.Items = new List<Dictionary<string, object>>();
        }
        public string List { get; set; }
        public int DeployOrder { get; set; }
        public List<Dictionary<string, object>> Items { get; set; }
    }
}
