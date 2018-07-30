
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class WebApplication
    {
        public WebApplication()
        {
            Sites = new List<Site>();
            Features = new List<CustomFeature>();
        }
        public string Name { get; set; }
        public string Port { get; set; }
        public string Url { get; set; }
        public List<Site> Sites { get; set; }
        public List<CustomFeature> Features { get; set; }
    }
}
