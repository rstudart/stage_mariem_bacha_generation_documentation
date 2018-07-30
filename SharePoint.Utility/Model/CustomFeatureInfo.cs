using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class CustomFeature
    {
        public CustomFeature()
        {
            this.DependentOn = new List<string>();
            this.QuickLaunch = new List<MenuItem>();
            this.Groups = new List<Group>();
            this.Roles = new List<Role>();
            this.Lists = new List<List>();
            this.ListTemplates = new List<List>();
            this.Alerts = new List<Dictionary<string, object>>();
            this.Events = new List<Dictionary<string, object>>();
            this.Reports = new List<Dictionary<string, object>>();
            this.Workflows = new List<Dictionary<string, object>>();
            this.Actions = new List<ActionInfo>();
            this.ContentTypes = new List<ContentType>();
            this.SiteColumns = new List<SiteColumn>();
        }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Path { get; set; }
        public string Version { get; set; }
        public string Site { get; set; }
        public List<string> DependentOn { get; set; }
        public List<MenuItem> QuickLaunch { get; set; }
        public List<Group> Groups { get; set; }
        public List<Role> Roles { get; set; }
        public List<List> Lists { get; set; }
        public List<List> ListTemplates { get; set; }
        public List<Dictionary<string, object>> Alerts { get; set; }
        public List<Dictionary<string, object>> Events { get; set; }
        public List<Dictionary<string, object>> Reports { get; set; }
        public List<Dictionary<string, object>> Workflows { get; set; }
        public List<ActionInfo> Actions { get; set; }
        public Data ListData { get; set; }
        public List<ContentType> ContentTypes { get; set; }
        public List<SiteColumn> SiteColumns { get; set; }
        public string FilesToUploadPath { get; set; }
        public string CodePath { get; set; }
    }
}
