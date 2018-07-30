using MarkDown.Generator.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator
{
    public class SharePointProject
    {
        #region Fields
        string _configPath;
        #endregion

        #region Properties
        public DocumentStructure Structure { get; set; }
        #endregion

        #region Ctor
        private SharePointProject(string configPath)
        {
            _configPath = configPath;
            InitStructure();
        }
        #endregion

        #region Public methods
        public static SharePointProject Load(string configPath)
        {
            return new SharePointProject(configPath);
        }
        #endregion

        #region Private methods
        private void InitStructure()
        {
            Structure = new DocumentStructure();
            Structure.Farm = GetFarm();
            Structure.WebApplications = GetWebApplications();
        }
        private Farm GetFarm()
        {
            var configPath = Path.Combine(_configPath, "Farm.json");
            return Json.Deserialize<Farm>(configPath);
        }
        public List<WebApplication> GetWebApplications()
        {
            var webApps = new List<WebApplication>();
            var appsDirectories = Directory.EnumerateDirectories(_configPath);
            foreach (var dp in appsDirectories)
            {
                var appPath = Path.Combine(dp, "app.json");
                if (File.Exists(appPath))
                {
                    var app = Json.Deserialize<WebApplication>(appPath);
                    app.Url = SetServerName(app.Url);
                    app.Features = GetAppFeatures(app);
                    app.Sites = GetSites(app);
                    webApps.Add(app);
                }
            }
            return webApps;
        }

        private List<CustomFeature> GetAppFeatures(WebApplication app)
        {
            var features = new List<CustomFeature>();
            var path = Path.Combine(_configPath, app.Name, "Features");
            var featureDirectories = new List<string>();
            FindFeatures(path, ref featureDirectories);

            foreach (var dp in featureDirectories)
            {
                var featureFilePath = Path.Combine(dp, "feature.json");
                var feature = Json.Deserialize<CustomFeature>(featureFilePath);
                if (feature.ViewInDocumentation)
                {
                    feature.Path = dp;
                    feature.Lists = GetLists(feature);
                    feature.ContentTypes = GetFeatureConfigItem<ContentType>(feature, "types");
                    feature.SiteColumns = GetSiteColumns(feature);
                    feature.Groups = GetGroups(feature);
                    features.Add(feature);
                }
            }
            return features;
        }

        private List<List> GetLists(CustomFeature feature)
        {
            var lists = new List<List>();
            var path = Path.Combine(feature.Path, "Lists");
            if (Directory.Exists(path))
            {
                var listDirectories = Directory.EnumerateDirectories(path);
                foreach (var dp in listDirectories)
                {
                    var configPath = Path.Combine(dp, "list.json");
                    if (File.Exists(configPath))
                    {
                        var list = Json.Deserialize<List>(configPath);
                        list.ConfigFolderPath = dp;
                        list.Fields = GetListFields(dp);
                        list.SiteColumns = GetListSiteColumns(dp);
                        list.ListContentTypes = GetListContentTypes(dp);
                        list.Views = GetListViews(dp);
                        lists.Add(list);
                    }
                }
            }

            return lists;
        }

        private List<ListField> GetListFields(string listFolderPath)
        {
            var fields = new List<ListField>();
            var path = Path.Combine(listFolderPath, "fields.json");
            if (File.Exists(path))
            {
                fields = Json.Deserialize<List<ListField>>(path);
                foreach (var field in fields)
                {
                    field.Id = GetAttributeValueFromXml(field.Xml, "ID");
                    field.DisplayName = GetAttributeValueFromXml(field.Xml, "DisplayName");
                    field.Name = GetAttributeValueFromXml(field.Xml, "Name");
                    field.IsRequired = GetAttributeValueFromXml(field.Xml, "Required") == "TRUE";
                    field.Type = GetAttributeValueFromXml(field.Xml, "Type");
                    field.IsLookup = field.Xml.Contains("Type='Lookup'");
                    field.IsCalculated = field.Xml.Contains("Type='Calculated'");
                }
            }
            return fields;
        }

        private List<SiteColumn> GetListSiteColumns(string listFolderPath)
        {
            var columns = new List<SiteColumn>();
            var path = Path.Combine(listFolderPath, "columns.json");
            if (File.Exists(path))
            {
                columns = Json.Deserialize<List<SiteColumn>>(path);
                foreach (var column in columns)
                {
                    column.Id = GetAttributeValueFromXml(column.Xml, "ID");
                    column.DisplayName = GetAttributeValueFromXml(column.Xml, "DisplayName");
                    column.Name = GetAttributeValueFromXml(column.Xml, "Name");
                    column.IsRequired = GetAttributeValueFromXml(column.Xml, "Required") == "TRUE";
                    column.Group = GetAttributeValueFromXml(column.Xml, "Group");
                    column.Type = GetAttributeValueFromXml(column.Xml, "Type");
                    column.IsLookup = column.Xml.Contains("Type='Lookup'");
                }
            }
            return columns;
        }

        private List<ContentType> GetListContentTypes(string listFolderPath)
        {
            var contentTypes = new List<ContentType>();
            var path = Path.Combine(listFolderPath, "types.json");
            if (File.Exists(path))
            {
                contentTypes = Json.Deserialize<List<ContentType>>(path);
            }
            return contentTypes;
        }

        private List<View> GetListViews(string listFolderPath)
        {
            var path = Path.Combine(listFolderPath, "Views");
            var views = new List<View>();
            if (Directory.Exists(path))
            {
                views = new DirectoryInfo(path).EnumerateFiles("*.xml")
                                               .Select(file =>
                                               {
                                                   var xml = File.ReadAllText(file.FullName);
                                                   return new View()
                                                   {
                                                       Name = file.Name.Replace(".xml", ""),
                                                       Xml = xml,
                                                       DisplayName = GetAttributeValueFromXml(xml, "ID"),
                                                       IsDefault = GetAttributeValueFromXml(xml, "DefaultView") == "TRUE"
                                                   };
                                               })
                                               .ToList();
            }

            return views;
        }

        private List<T> GetFeatureConfigItem<T>(CustomFeature feature, string itemName)
        {
            var items = new List<T>();
            var path = Path.Combine(feature.Path, itemName + ".json");
            if (File.Exists(path))
            {

                items = Json.Deserialize<List<T>>(path);

            }
            return items;
        }

        private string GetAttributeValueFromXml(string xml, string attribute)
        {
            return Match(xml, String.Format(@" {0}='(?<{0}>[^']*)'", attribute), attribute);
        }

        private static string Match(string input, string regex, string group)
        {
            var matcher = new System.Text.RegularExpressions.Regex(regex);
            return matcher.Match(input).Groups[group].Value;
        }

        private List<SiteColumn> GetSiteColumns(CustomFeature feature)
        {
            var siteColumns = new List<SiteColumn>();
            var path = Path.Combine(feature.Path, "fields.json");
            if (File.Exists(path))
            {
                siteColumns = Json.Deserialize<List<SiteColumn>>(path);
                foreach (var siteColumn in siteColumns)
                {
                    siteColumn.Id = GetAttributeValueFromXml(siteColumn.Xml, "ID");
                    siteColumn.DisplayName = GetAttributeValueFromXml(siteColumn.Xml, "DisplayName");
                    siteColumn.Name = GetAttributeValueFromXml(siteColumn.Xml, "Name");
                    siteColumn.Type = GetAttributeValueFromXml(siteColumn.Xml, "Type");
                    siteColumn.IsRequired = GetAttributeValueFromXml(siteColumn.Xml, "Required")
                        .Equals("True", StringComparison.InvariantCultureIgnoreCase);

                    siteColumn.Group = GetAttributeValueFromXml(siteColumn.Xml, "Group");
                    siteColumn.IsLookup = siteColumn.Xml.Contains("Type='Lookup'");
                }
            }
            return siteColumns;
        }

        private List<Group> GetGroups(CustomFeature feature)
        {
            var groups = new List<Group>();
            var path = Path.Combine(feature.Path, "groups.json");
            if (File.Exists(path))
            {
                groups = Json.Deserialize<List<Group>>(path);
                foreach (var group in groups)
                    for (var i = 0; i < group.Members.Count; i++)
                        group.Members[i] = group.Members[i];
            }
            return groups;
        }

        public static void FindFeatures(string path, ref List<string> featureDirectories)
        {
            featureDirectories.AddRange(Directory.GetFiles(path, "feature.json")
                                           .Select(p => Path.GetDirectoryName(p)));

            foreach (string d in Directory.GetDirectories(path))
                FindFeatures(d, ref featureDirectories);
        }

        private List<Site> GetSites(WebApplication app)
        {
            var sites = new List<Site>();
            var path = Path.Combine(_configPath, app.Name, "Sites");
            var siteFiles = new DirectoryInfo(path).EnumerateFiles("*.json");

            foreach (var siteFile in siteFiles)
            {
                if (!siteFile.FullName.Contains("Sites.json"))
                {
                    var site = Json.Deserialize<Site>(siteFile.FullName);

                    if (site.OwnerLogin == "")
                        site.OwnerLogin = Structure.Farm.SiteCollectionAdministrator;

                    site.Url = app.Url + site.Url;
                    sites.Add(site);
                }
            }
            return sites;
        }

        private string SetServerName(string url)
        {
            return url.Replace("***", Structure.Farm.ServerName);
        }
        #endregion

    }


}
