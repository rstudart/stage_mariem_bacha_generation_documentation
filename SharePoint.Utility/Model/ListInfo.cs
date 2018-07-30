using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class List
    {
        public List()
        {
            ContentTypes = new List<string>();
            ListContentTypes = new List<ContentType>();
            Fields = new List<ListField>();
            SiteColumns = new List<SiteColumn>();
            Data = new List<Dictionary<string, object>>();
            Views = new List<View>();
            RequiredFields = new List<string>();
            HiddenFields = new List<string>();
            NewFormFields = new List<string>();
            EditFormFields = new List<string>();
            DisplayFormFields = new List<string>();
            ShowInSearchResults = true;
            OpenFormsInNewDialog = true;
            AllowQuickEdit = false;
        }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int TemplateType { get; set; }
        public string CustomTemplate { get; set; }
        public int DeployOrder { get; set; }
        public bool ShowInSearchResults { get; set; }
        public bool AllowQuickEdit { get; set; }
        public bool OpenFormsInNewDialog { get; set; }
        public string ConfigFolderPath { get; set; }
        public List<string> ContentTypes { get; set; }
        public List<ListField> Fields { get; set; }
        public List<SiteColumn> SiteColumns { get; set; }
        public List<ContentType> ListContentTypes { get; set; }
        public List<Dictionary<string, object>> Data { get; set; }
        public List<View> Views { get; set; }
        public List<string> RequiredFields { get; set; }
        public List<string> HiddenFields { get; set; }
        public List<string> NewFormFields { get; set; }
        public List<string> EditFormFields { get; set; }
        public List<string> DisplayFormFields { get; set; }

    }
}
