using SharePoint.Utility.Model;
using System.Web.Script.Serialization;
using System.Reflection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using SharePoint.Utility;
using Newtonsoft.Json;
using System.Threading;
using System.Xml;
using System.Configuration;

namespace Deploy
{
    class Program
    {
        #region Fields
        public static Farm Farm;
        public static WebApplication SelectedWebApplication;
        public static Site SelectedSite;
        public static List<WebApplication> FarmWebApps = null;
        public static List<WebApplication> WebApps = null;
        public static List<CustomFeature> Features = null;
        public static List<string> InstalledFeatures = new List<string>();
        public static List<Site> Sites = null;
        public static string ConfigFolder = "";
        public static string ConfigSiteUrl = "";
        public static string ConfigWebApplicationUrl = "";
        public static bool fullMode = false;
        #endregion

        #region Main
        static void Main(string[] args)
        {
            Background.Run("Vérification des données de configuration", () =>
           {
               if(args.Length > 0)
               {
                   ConfigFolder = args[0];
               }

               if (string.IsNullOrEmpty(ConfigFolder))
                   ConfigFolder = Path.Combine(Directory.GetParent(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)).FullName, "WebApps");

               var configFolderExists = Directory.Exists(ConfigFolder);
               while (!configFolderExists)
               {
                   Output.Message("Le dossier" + ConfigFolder + " n'existe pas!", true);
                   ConfigFolder = Output.ReadLine("Saisissez le chemin du dossier de configuration :");
                   configFolderExists = Directory.Exists(ConfigFolder);
               }

               Farm = GetFarms();

               ConfigSiteUrl = SetServerName(ConfigurationManager.AppSettings["ConfigSiteUrl"]);
               ConfigWebApplicationUrl = SetServerName(ConfigurationManager.AppSettings["ConfigWebApplicationUrl"]);

           });

            Output.Message("", true);
            Output.KeyValue("Dossier de configuration", ConfigFolder);
            Output.KeyValue("Site de configuration", ConfigSiteUrl);
            Output.KeyValue("Domaine de la ferme", Farm.Domain);
            Output.KeyValue("Serveur de la ferme", Farm.ServerName);
            Output.KeyValue("Administrateur", Farm.SiteCollectionAdministrator);
            Output.Message("", true);

            WebApplicationSelectionPrompt();

        }
        #endregion

        #region Prompts
        public static void WebApplicationSelectionPrompt()
        {
            Output.Title("Selectionner une application Web :");

            // Initilaisation de la collection des applications Web de la ferme
            Background.Run("Chargment des applications web de la ferme", () =>
            {
                if (FarmWebApps == null)
                {
                    WebApps = GetWebApplicationss();
                    FarmWebApps = WebApps;
                }
            });

            if (WebApps.Count == 1)
            {
                // Une seule application Web : sélection automatique
                Output.KeyValue("Application Web", WebApps[0].Name);
                SelectedWebApplication = WebApps[0];
                Features = GetFeaturess();
            }
            else
            {
                //Affichage du menu de choix de l'application Web
                int index = -1;
                foreach (WebApplication webApplication in FarmWebApps)
                    Output.KeyValue((++index).ToString(), webApplication.Name);
                Output.KeyValue("Entrée", "Quitter l'application");

                var selection = Output.ReadLine("Application Web");
                if (int.TryParse(selection, out index) && index < FarmWebApps.Count && index >= 0)
                {
                    Output.KeyValue("Application Web", FarmWebApps[index].Name);
                    SelectedWebApplication = FarmWebApps[index];
                    Features = GetFeaturess();
                }
                else
                {
                    if (selection != "")
                        WebApplicationSelectionPrompt();
                    else
                        Exit();
                }
            }

            if (fullMode)
                CreateSiteCollections();
            else
                SiteCollectionCreationPrompt();
        }
        public static void SiteCollectionCreationPrompt()
        {
            Output.Title("Selectionner une collection de sites :");
            var path = Path.Combine(ConfigFolder, SelectedWebApplication.Name);
            if (Sites == null)
                Sites = GetSiteCollectionss();

            int index = -1;

            foreach (var site in Sites)
                Output.KeyValue((++index).ToString(), String.Format("{0} - {1}", site.Name, site.Url));

            Output.Message("", true);
            Output.KeyValue("r", "Actualiser la configuration");
            Output.KeyValue("Entrée", "Quitter l'application");


            var selection = Output.ReadLine("Collection de sites");
            if (int.TryParse(selection, out index) && index < Sites.Count && index >= 0)
            {
                Output.KeyValue("Collection de site", String.Format("{0} - {1}", Sites[index].Name, Sites[index].Url));
                SelectedSite = Sites[index];
                CreateSiteCollection(Sites[index]);
                SiteCollectionCreationPrompt();
            }
            else
            {
                switch (selection)
                {
                    case "r":
                        Background.Run("Actualisation de la configuration ", () =>
                        {
                            Features = GetFeaturess();
                            Sites = GetSiteCollectionss();
                            SiteCollectionCreationPrompt();
                        });
                        break;
                    case "":
                        Exit();
                        break;
                    default:
                        SiteCollectionCreationPrompt();
                        break;
                }
            }
        }
        public static void FeatureSelectionPrompt(Site web)
        {
            Output.Title("Selectionner les fonctionnalités à installer pour le site " + web.Name);

            int index = -1;

            var siteFeatures = SelectedSite.CustomFeatures.Select(name => Features.First(f => f.Name == name));

            foreach (var feature in siteFeatures)
                Output.KeyValue((++index).ToString(), feature.Name);

            Output.Message("", true);
            Output.KeyValue("a", "Installer toutes les fonctionnalités");
            Output.KeyValue("r", "Actualiser la configuration");
            Output.KeyValue("x", "Retour à la sélection de sites");

            var selection = Output.ReadLine("Fonctionnalité ");

            if (int.TryParse(selection, out index) && index < Features.Count && index >= 0)
            {
                InstallCustomFeature(siteFeatures.ElementAt(index));
                FeatureSelectionPrompt(web);
            }
            else
            {
                switch (selection)
                {
                    case "a":
                        foreach (var feature in siteFeatures)
                            InstallCustomFeature(feature);
                        break;
                    case "r":
                        Background.Run("Actualisation de la configuration ", () =>
                        {
                            Features = GetFeaturess();
                            Sites = GetSiteCollectionss();
                            SelectedSite = Sites.FirstOrDefault(s => s.Name == SelectedSite.Name);
                        });

                        if (SelectedSite == null)
                            SiteCollectionCreationPrompt();
                        else
                            FeatureSelectionPrompt(web);
                        break;
                    case "x":
                        SiteCollectionCreationPrompt();
                        break;
                    default:
                        FeatureSelectionPrompt(web);
                        break;
                }
            }
        }
        #endregion

        #region Actions
        private static void CreateSiteCollections()
        {
        }
        private static void CreateSiteCollection(Site site)
        {
            Output.SubTitle("Création de la collection de sites " + site.Url);

            SetSiteCollectionFeatures(site);
            FeatureSelectionPrompt(site);
            foreach (var web in site.Webs)
                CreateWebSite(site.Webs, web);
        }
        private static void CreateWebSite(List<Site> parentWebs, Site web)
        {
            SetWebSiteFeatures(web);
            FeatureSelectionPrompt(web);
            foreach (var subWeb in web.Webs)
                CreateWebSite(web.Webs, subWeb);
        }
        public static void InstallCustomFeature(CustomFeature feature)
        {
            Output.Title("Installation de la fonctionnalité " + feature.Name);

            CreateRoleDefinitions(feature);
            CreateSiteColumns(feature);
            CreateContentTypes(feature);
            CreateListTemplates(feature);
            CreateLists(feature);
            CreateGroups(feature);
            CreateQuickLaunch(feature);
            UploadCode(feature);
            ConfigureAlerts(feature);
            ConfigureEvents(feature);
            ConfigureWorkflows(feature);
            ConfigureReports(feature);
            ExecuteActions(feature);
            InsertData(feature);
        }
        private static void UploadCode(CustomFeature feature)
        {
            if (!String.IsNullOrEmpty(feature.CodePath))
            {
                var files = Directory.GetFiles(feature.CodePath, "*.*", SearchOption.AllDirectories);
                foreach (var file in files)
                {
               

                }
            }
        }
        private static void ConfigureAlerts(CustomFeature feature)
        {
            if (feature.Alerts.Count > 0)
            {
                Output.SubTitle("Configuration des alertes");

                foreach (var alert in feature.Alerts)
                {

                }
            }
        }
        private static void ConfigureEvents(CustomFeature feature)
        {
            if (feature.Events.Count > 0)
            {
                Output.SubTitle("Configuration des évnènements");

                foreach (var evt in feature.Events)
                {
                    
     
                }
            }
        }
        private static void ConfigureReports(CustomFeature feature)
        {
            if (feature.Reports.Count > 0)
            {
                Output.SubTitle("Configuration des rapports");

                foreach (var report in feature.Reports)
                {

                }
            }
        }
        private static void ConfigureWorkflows(CustomFeature feature)
        {
            if (feature.Workflows.Count > 0)
            {
                Output.SubTitle("Configuration des flux de travail");

                foreach (var workflow in feature.Workflows)
                {

                }
            }
        }
        private static void ExecuteActions(CustomFeature feature)
        {
            if (feature.Actions.Count > 0)
            {
                Output.SubTitle("Exécution des actions de configuration");

                foreach (var action in feature.Actions)
                {
                }
            }
        }
        private static void InsertData(CustomFeature feature)
        {
            if (feature.ListData.List != null)
            {
                Output.SubTitle("Insertion des données de la liste : " + feature.ListData.List);

                foreach (var data in feature.ListData.Items)
                {

                }
            }
        }
        private static void SetSiteCollectionFeatures(Site site)
        {
            foreach (var feature in site.Features)
            {
            }
            SetWebSiteFeatures(site);
        }
        private static void SetWebSiteFeatures(Site web)
        {
            foreach (var feature in web.WebFeatures)
            {

            }
        }
        private static void CreateRoleDefinitions(CustomFeature feature)
        {

        }
        private static void CreateGroups(CustomFeature feature)
        {
            if (feature.Groups.Count > 0)
            {
                Output.SubTitle("Création des groupes de sécurité");
                foreach (var group in feature.Groups)
                {

                }
            }
        }
        private static void CreateQuickLaunch(CustomFeature feature)
        {
            if (feature.QuickLaunch.Count > 0)
            {
                Output.SubTitle("Création des liens de lancement rapides");

                foreach (var link in feature.QuickLaunch)
                {

                }
            }
        }
        private static void CreateSiteColumns(CustomFeature feature)
        {
            if (feature.SiteColumns.Count > 0)
            {
                Output.SubTitle("Création des colonnes de sites");

                foreach (var column in feature.SiteColumns)
                {
                    CreateSiteColumn(column);
                }
            }
        }
        private static void CreateSiteColumn(SiteColumn column)
        {


        }
        private static void CreateContentTypes(CustomFeature feature)
        {
            if (feature.ContentTypes.Count > 0)
            {
                Output.SubTitle("Création des types de contenu");

                foreach (var type in feature.ContentTypes)
                {
                    string text;
                    string t1= string.Format("# {0}\n", type.Id);
                    string t2 = string.Format("# {0}\n", type.Name);
                    string t3 = string.Format("# {0}\n", type.Group);
                    string t4 = string.Format("# {0}\n", type.EditFormUrl);
                    string t5 = string.Format("# {0}\n", type.NewFormUrl);
                    string t6 = string.Format("# {0}\n", type.DisplayFormUrl);
                    text = (t1 + "\n" + t2 + "\n" + t3+ "\n" + t4 + "\n" + t5 + "\n" + t6);
                    string path = @"D:\readme1.md";
                    using (StreamWriter sw = File.CreateText(path))
                    {
                        sw.Write(text);
                    }
                }
            }
        }
        private static void CreateContentType(ContentType type)
        {

        }
        private static void CreateLists(CustomFeature feature)
        {
            if (feature.Lists.Count > 0)
            {
                foreach (var list in feature.Lists.OrderBy(l => l.DeployOrder))
                {

                }
            }
        }
        private static void CreateList(List list, CustomFeature feature)
        {
            if (list.SiteColumns.Count > 0)
            {
                Output.SubTitle("Création des colonnes de site de la liste " + list.Name);
                foreach (var column in list.SiteColumns)
                {

                }
            }

            if (list.ContentTypes.Count > 0)
            {
                Output.SubTitle("Création des types de contenu de la liste " + list.Name);
                foreach (var type in list.ListContentTypes)
                {

                }
            }

            Output.SubTitle("Création de la liste " + list.Name);


            //Création des colonnes
            if (list.Fields.Count > 0)
            {
                foreach (var fld in list.Fields.OrderBy(f => f.IsCalculated))
                {

                }
            }

            //Définition des champs des formulaires
            for (int i = 0; i < list.Fields.Count; i++)
            {
                var field = list.Fields[i];


                //if (!field.ReadOnlyField)
                //{
                //    if ((IsRequired(field.Name, list) != null)
                //        || (IsHidden(field.Name, list) != null)
                //        || (IsVisibleInNewForm(field.Name, list) != null)
                //        || (IsVisibleInEditForm(field.Name, list) != null)
                //        || (IsVisibleInDisplayForm(field.Name, list) != null))
                //    {
                //                                                                                                          IsHidden(field.StaticName, list),
                //                                                                                                          IsVisibleInNewForm(field.StaticName, list),
                //                                                                                                          IsVisibleInEditForm(field.StaticName, list),
                //                                                                                                          IsVisibleInDisplayForm(field.StaticName, list)));
                //    }

                //}
            }

            //Insertion des données
            if (list.Data.Count > 0)
            {
                foreach (var data in list.Data)
                    if (data.Keys.Count > 0)
                    {

                    }
            }

            var views = GetViews(list, feature);
            if (views.Count > 0)
            {
                //Création des vues
                foreach (var view in views)
                {

                }
            }
        }
        private static void CreateListTemplates(CustomFeature feature)
        {
            if (feature.ListTemplates.Count > 0)
            {
                foreach (var list in feature.ListTemplates.OrderBy(l => l.DeployOrder))
                {
                }
            }
        }
        private static void Exit()
        {
            Console.WriteLine("Fin du programme. Saisissez une touche pour fermer la console");
            Console.ReadKey();
            System.Environment.Exit(-1);
        }
        #endregion

        #region Private methods
        public static Farm GetFarms()
        {
            var configPath = Path.Combine(ConfigFolder, "Farm.json");
            var json = File.ReadAllText(configPath);
            return JsonConvert.DeserializeObject<Farm>(json);
        }
        public static List<WebApplication> GetWebApplicationss()
        {
            var webApps = new List<WebApplication>();
            var appsDirectories = Directory.EnumerateDirectories(ConfigFolder);
            foreach (var dp in appsDirectories)
            {
                var configPath = Path.Combine(dp, "app.json");
                if (File.Exists(configPath))
                {
                    try
                    {
                        var json = File.ReadAllText(configPath);
                        var app = JsonConvert.DeserializeObject<WebApplication>(json);
                        app.Url = SetServerName(app.Url);
                        webApps.Add(app);
                    }
                    catch (Exception ex)
                    {
                        var x = ex.Message;
                    }
                }
            }
            return webApps;
        }
        private static string SetServerName(string url)
        {
            return url.Replace("***", Farm.ServerName);
        }
        public static List<CustomFeature> GetFeaturess()
        {
            var features = new List<CustomFeature>();
            var path = Path.Combine(ConfigFolder, SelectedWebApplication.Name, "Features");
            var featureDirectories = new List<string>();
            FindFeatures(path, ref featureDirectories);

            foreach (var dp in featureDirectories)
            {
                var configPath = Path.Combine(dp, "feature.json");
                if (File.Exists(configPath))
                {
                    try
                    {
                        var json = File.ReadAllText(configPath);
                        var feature = JsonConvert.DeserializeObject<CustomFeature>(json);

                        feature.Path = dp;
                        feature.Lists = GetLists(feature);
                        feature.ListTemplates = GetListTemplates(feature);
                        feature.ContentTypes = GetFeatureConfigItem<ContentType>(feature, "types");
                        feature.ListData = GetFeatureData(feature, "data");
                        feature.SiteColumns = GetSiteColumns(feature);
                        feature.QuickLaunch = GetFeatureConfigItem<MenuItem>(feature, "menu");
                        feature.Groups = GetGroups(feature);
                        feature.Roles = GetFeatureConfigItem<Role>(feature, "roles");
                        feature.Alerts = GetFeatureConfigItem<Dictionary<string, object>>(feature, "workflows");
                        feature.Workflows = GetFeatureConfigItem<Dictionary<string, object>>(feature, "alerts");
                        feature.Events = GetFeatureConfigItem<Dictionary<string, object>>(feature, "events");
                        feature.Reports = GetFeatureConfigItem<Dictionary<string, object>>(feature, "reports");
                        feature.Actions = GetFeatureConfigItem<ActionInfo>(feature, "actions");
                        if (Directory.Exists(Path.Combine(dp, "Upload")))
                            feature.FilesToUploadPath = Path.Combine(dp, "Upload");
                        if (Directory.Exists(Path.Combine(dp, "Code")))
                            feature.CodePath = Path.Combine(dp, "Code");

                        features.Add(feature);
                    }
                    catch (Exception ex)
                    {
                        var x = ex.Message;
                    }
                }
            }
            return features;
        }
        public static void FindFeatures(string path, ref List<string> featureDirectories)
        {
            featureDirectories.AddRange(Directory.GetFiles(path, "feature.json")
                                           .Select(p => Path.GetDirectoryName(p)));

            foreach (string d in Directory.GetDirectories(path))
                FindFeatures(d, ref featureDirectories);
        }
        public static List<Site> GetSiteCollectionss()
        {
            var sites = new List<Site>();
            var path = Path.Combine(ConfigFolder, SelectedWebApplication.Name, "Sites");
            var siteCollectionNames = Json.Deserialize<List<string>>(Path.Combine(path, "Sites.json"));

            foreach (var siteName in siteCollectionNames)
            {
                var configPath = Path.Combine(path, siteName + ".json");
                if (File.Exists(configPath))
                {
                    try
                    {
                        var site = Json.Deserialize<Site>(configPath);

                        if (site.OwnerLogin != "")
                            site.OwnerLogin = Farm.Domain + "\\" + site.OwnerLogin;
                        else
                            site.OwnerLogin = Farm.Domain + "\\" + Farm.SiteCollectionAdministrator;

                        site.Url = GetAbsoluteUrl(site.Url);
                        site.Webs = GetWebss(site.SubSites);
                        sites.Add(site);
                    }
                    catch (Exception ex)
                    {
                        var x = ex.Message;
                    }
                }
            }
            return sites;
        }
        public static List<Site> GetWebss(List<string> webNames)
        {
            var webs = new List<Site>();
            var path = Path.Combine(ConfigFolder, SelectedWebApplication.Name, "Sites");
            foreach (var webName in webNames)
            {
                var configPath = Path.Combine(path, webName + ".json");
                if (File.Exists(configPath))
                {
                    try
                    {
                        var web = Json.Deserialize<Site>(configPath);

                        if (web.OwnerLogin != "")
                            web.OwnerLogin = Farm.Domain + "\\" + web.OwnerLogin;
                        else
                            web.OwnerLogin = Farm.Domain + "\\" + Farm.SiteCollectionAdministrator;

                        web.Url = GetAbsoluteUrl(web.Url);
                        web.Webs = GetWebss(web.SubSites);
                        webs.Add(web);
                    }
                    catch (Exception ex)
                    {
                        var x = ex.Message;
                    }
                }
            }
            return webs;
        }
        public static List<List> GetLists(CustomFeature feature)
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
                        try
                        {
                            var json = File.ReadAllText(configPath);
                            var list = JsonConvert.DeserializeObject<List>(json);
                            list.ConfigFolderPath = dp;
                            list.Fields = GetListFields(dp);
                            list.SiteColumns = GetListSiteColumns(dp);
                            list.ListContentTypes = GetListContentTypes(dp);
                            list.Views = GetListViews(dp);
                            list.Data = GetListData(dp);
                            lists.Add(list);
                        }
                        catch (Exception ex)
                        {
                            var x = ex.Message;
                        }
                    }
                }
            }

            return lists;
        }
        public static List<List> GetListTemplates(CustomFeature feature)
        {
            var lists = new List<List>();
            var path = Path.Combine(feature.Path, "ListTemplates");
            if (Directory.Exists(path))
            {
                var listDirectories = Directory.EnumerateDirectories(path);
                foreach (var dp in listDirectories)
                {
                    var configPath = Path.Combine(dp, "list.json");
                    if (File.Exists(configPath))
                    {
                        try
                        {
                            var json = File.ReadAllText(configPath);
                            var list = JsonConvert.DeserializeObject<List>(json);
                            list.ConfigFolderPath = dp;
                            list.Fields = GetListFields(dp);
                            list.SiteColumns = GetListSiteColumns(dp);
                            list.ListContentTypes = GetListContentTypes(dp);
                            list.Views = GetListViews(dp);
                            lists.Add(list);
                        }
                        catch (Exception ex)
                        {
                            var x = ex.Message;
                        }
                    }
                }
            }

            return lists;
        }
        private static List<Dictionary<string, object>> GetListData(string listFolderPath)
        {
            var items = new List<Dictionary<string, object>>();
            var path = Path.Combine(listFolderPath, "data.json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    items = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return items;
        }
        private static List<ListField> GetListFields(string listFolderPath)
        {
            var fields = new List<ListField>();
            var path = Path.Combine(listFolderPath, "fields.json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    fields = JsonConvert.DeserializeObject<List<ListField>>(json);
                    foreach (var field in fields)
                    {
                        field.Id = Match(field.Xml, @" ID='(?<ID>[^']*)'", "ID");
                        field.DisplayName = Match(field.Xml, @" DisplayName='(?<DisplayName>[^']*)'", "DisplayName");
                        field.Name = Match(field.Xml, @" Name='(?<Name>[^']*)'", "Name");
                        field.IsLookup = field.Xml.Contains("Type='Lookup'");
                        field.IsCalculated = field.Xml.Contains("Type='Calculated'");
                    }
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return fields;
        }
        private static List<SiteColumn> GetListSiteColumns(string listFolderPath)
        {
            var columns = new List<SiteColumn>();
            var path = Path.Combine(listFolderPath, "columns.json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    columns = JsonConvert.DeserializeObject<List<SiteColumn>>(json);
                    foreach (var column in columns)
                    {
                        column.Id = Match(column.Xml, @" ID='(?<ID>[^']*)'", "ID");
                        column.DisplayName = Match(column.Xml, @" DisplayName='(?<DisplayName>[^']*)'", "DisplayName");
                        column.Name = Match(column.Xml, @" Name='(?<Name>[^']*)'", "Name");
                        column.Group = Match(column.Xml, @" Group='(?<Group>[^']*)'", "Group");
                        column.IsLookup = column.Xml.Contains("Type='Lookup'");
                    }
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return columns;
        }
        private static List<ContentType> GetListContentTypes(string listFolderPath)
        {
            var contentTypes = new List<ContentType>();
            var path = Path.Combine(listFolderPath, "types.json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    contentTypes = JsonConvert.DeserializeObject<List<ContentType>>(json);
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return contentTypes;
        }
        public static List<View> GetListViews(string listFolderPath)
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
                                                       DisplayName = Match(xml, " DisplayName=\"(?<DisplayName>[^\"]*)\"", "DisplayName"),
                                                       IsDefault = Match(xml, " DefaultView=\"(?<DefaultView>[^\"]*)\"", "DefaultView") == "TRUE" ? true : false
                                                   };
                                               })
                                               .ToList();
            }

            return views;
        }
        private static List<SiteColumn> GetSiteColumns(CustomFeature feature)
        {
            var siteColumns = new List<SiteColumn>();
            var path = Path.Combine(feature.Path, "fields.json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    siteColumns = JsonConvert.DeserializeObject<List<SiteColumn>>(json);
                    foreach (var siteColumn in siteColumns)
                    {
                        siteColumn.Id = Match(siteColumn.Xml, @" ID='(?<ID>[^']*)'", "ID");
                        siteColumn.DisplayName = Match(siteColumn.Xml, @" DisplayName='(?<DisplayName>[^']*)'", "DisplayName");
                        siteColumn.Name = Match(siteColumn.Xml, @" Name='(?<Name>[^']*)'", "Name");
                        siteColumn.Group = Match(siteColumn.Xml, @" Group='(?<Group>[^']*)'", "Group");
                        siteColumn.IsLookup = siteColumn.Xml.Contains("Type='Lookup'");
                    }
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return siteColumns;
        }
        private static string Match(string input, string regex, string group)
        {
            var matcher = new System.Text.RegularExpressions.Regex(regex);
            return matcher.Match(input).Groups[group].Value;
        }
        private static string GetAbsoluteUrl(string siteUrl)
        {
            return "http://";
        }
        public static List<View> GetViews(List list, CustomFeature feature)
        {
            var path = Path.Combine(list.ConfigFolderPath, "Views");
            var views = new List<View>();
            if (Directory.Exists(path))
            {
                views = new DirectoryInfo(path).EnumerateFiles()
                                               .Select(file =>
                                               {
                                                   var xml = File.ReadAllText(file.FullName);
                                                   return new View()
                                                   {
                                                       Name = file.Name.Replace(".xml", ""),
                                                       Xml = xml,
                                                       DisplayName = Match(xml, " DisplayName=\"(?<DisplayName>[^\"]*)\"", "DisplayName"),
                                                       IsDefault = Match(xml, " DefaultView=\"(?<DefaultView>[^\"]*)\"", "DefaultView") == "TRUE" ? true : false
                                                   };
                                               })
                                               .ToList();
            }

            return views;
        }
        private static List<T> GetFeatureConfigItem<T>(CustomFeature feature, string itemName)
        {
            var items = new List<T>();
            var path = Path.Combine(feature.Path, itemName + ".json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    items = JsonConvert.DeserializeObject<List<T>>(json);
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return items;
        }
        private static Data GetFeatureData(CustomFeature feature, string itemName)
        {
            var result = new Data();
            var path = Path.Combine(feature.Path, itemName + ".json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    result = JsonConvert.DeserializeObject<Data>(json);
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return result;
        }
        private static List<Group> GetGroups(CustomFeature feature)
        {
            var groups = new List<Group>();
            var path = Path.Combine(feature.Path, "groups.json");
            if (File.Exists(path))
            {
                try
                {
                    var json = File.ReadAllText(path);
                    groups = JsonConvert.DeserializeObject<List<Group>>(json);
                    foreach (var group in groups)
                        for (var i = 0; i < group.Members.Count; i++)
                            group.Members[i] = Farm.Domain + "\\" + group.Members[i];
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
            }
            return groups;
        }
        public static bool? IsRequired(string name, List list)
        {
            if (list.RequiredFields.Count == 0)
                return null;
            return list.RequiredFields.Contains(name);
        }
        public static bool? IsHidden(string name, List list)
        {
            if (list.HiddenFields.Count == 0)
                return null;
            return list.HiddenFields.Contains(name);
        }
        public static bool? IsVisibleInNewForm(string name, List list)
        {
            if (list.NewFormFields.Count == 0)
                return null;
            return list.NewFormFields.Contains(name);
        }
        public static bool? IsVisibleInEditForm(string name, List list)
        {
            if (list.EditFormFields.Count == 0)
                return null;
            return list.EditFormFields.Contains(name);
        }
        public static bool? IsVisibleInDisplayForm(string name, List list)
        {
            if (list.DisplayFormFields.Count == 0)
                return null;
            return list.DisplayFormFields.Contains(name);
        }

        #endregion
    }
}
