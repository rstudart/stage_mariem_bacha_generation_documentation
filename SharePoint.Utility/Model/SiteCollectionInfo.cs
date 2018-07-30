using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class Site
    {
        public Site()
        {
            this.Features = new List<Feature>();
            this.WebFeatures = new List<Feature>();
            this.CustomFeatures = new List<string>();
            this.SubSites = new List<string>();
            this.Webs = new List<Site>();
        }
        public string Url { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public uint Locale { get; set; }
        public string Template { get; set; }
        public string OwnerLogin { get; set; }
        public List<Feature> Features { get; set; }
        public List<Feature> WebFeatures { get; set; }
        public List<string> CustomFeatures { get; set; }
        public List<string> SubSites { get; set; }
        public List<Site> Webs { get; set; }
        public bool UniquePermissions { get; set; }
        public bool Delete { get; set; }
    }
}
