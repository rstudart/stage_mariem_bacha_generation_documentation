using MarkDown.Generator.DataRenderer;
using MarkDown.Generator.DataRenderer.Model;
using MarkDown.Generator.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator
{
    public class DocumentationRenderer
    {

        #region Private consts
        private const string _style = "<style>{0}</style>\n";

        private const string _formatSite = "{0}\nCe site a comme modele {1}.\n";



        #endregion

        private static string RenderGroups(List<Group> groups, IDataRenderer renderer)
        {
            if (groups.Count == 0)
                return "";
            var groupTable = new DataTable();
            groupTable.Header.Add("Groupe");
            groupTable.Header.Add("Description");
            groupTable.Header.Add("Membres");
            foreach (var group in groups)
            {
                var row = new List<string>();
                row.Add(group.Name);
                row.Add(group.Description);
                var membres = new HTMLRenderer().RenderUnorderedList(group.Members);
                row.Add(membres);
                groupTable.Rows.Add(row);
            }
            return renderer.RenderTitle("Groupes :", 7) + new HTMLRenderer().RenderTable(groupTable);
        }

        private static string RenderList(List list, List<ContentType> contentTypes, List<SiteColumn> siteColumns, IDataRenderer renderer)
        {

            var columnsTable = new DataTable();
            columnsTable.Header.Add("Colonne");
            columnsTable.Header.Add("Type");
            columnsTable.Header.Add("Remarque");
            var rows = new List<List<string>>();
            foreach (var item in list.ContentTypes)
            {
                var contentType = contentTypes.FirstOrDefault(ct => ct.Name == item);
                rows.AddRange(
                    GetContentTypeFields(contentType,
                    siteColumns,
                    list.SiteColumns,
                    list.Fields,
                    columnsTable));
            }
            columnsTable.Rows = rows;
            if (columnsTable.Rows.Count == 0)
                return "";
            return renderer.RenderTitle($"Liste {list.Title} :", 8)
            + renderer.RenderParagraphe(list.Description)+ renderer.RenderTitle("Structure de données :", 9) + new HTMLRenderer().RenderTable(columnsTable);
        }

        public static string RenderLists(List<List> lists, CustomFeature customFeature, IDataRenderer renderer)
        {
            if (lists.Count == 0)
                return "";
            string rendu = "";
            foreach (var list in lists)
            {
               
                rendu += RenderList(list, customFeature.ContentTypes, customFeature.SiteColumns, renderer);
                if (string.IsNullOrWhiteSpace(rendu))
                    return "";
                if (list.Views.Count > 0)
                {
                    var listViews = new List<string>();
                    foreach (var view in list.Views)
                    {
                        listViews.Add(view.Name);
                    }
                    rendu += renderer.RenderTitle("Vues :", 9) + new HTMLRenderer().RenderUnorderedList(listViews);
                }
            }
            return renderer.RenderTitle("Listes :", 7) + rendu;
        }


        private static List<List<string>> GetContentTypeFields(ContentType contentType, List<SiteColumn> siteColumns,
            List<SiteColumn> listeSiteColumns, List<ListField> listFields, DataTable table)
        {
            if (contentType == null)
                return new List<List<string>>();

            foreach (var field in contentType.Fields)
            {
                var column = siteColumns.FirstOrDefault(st => st.Name == field);
                var listColumn = listeSiteColumns.FirstOrDefault(lst => lst.Name == field);
                var fieldColumn = listFields.FirstOrDefault(fst => fst.Name == field);
                var row = new List<string>();

                if (column == null && listColumn == null && fieldColumn == null)
                {
                    row.Add(field);
                    row.Add("-");
                    row.Add("-");
                    table.Rows.Add(row);
                    continue;
                }

                if (column != null)
                {
                    row.Add(column.DisplayName);
                    row.Add(column.Type ?? "");
                    row.Add(column.IsRequired ? "Obligatoire" : "");
                    table.Rows.Add(row);
                    continue;
                }

                else if (listColumn != null)
                {
                    row.Add(listColumn.DisplayName);
                    row.Add(listColumn.Type ?? "");
                    row.Add(listColumn.IsRequired ? "Obligatoire" : "");
                    table.Rows.Add(row);
                    continue;
                }
                else if (fieldColumn != null)
                {
                    row.Add(fieldColumn.DisplayName);
                    row.Add(fieldColumn.Type);
                    row.Add(fieldColumn.IsRequired ? "Obligatoire" : "");
                    table.Rows.Add(row);
                    continue;
                }
            }
            return table.Rows;
        }

        private static string RenderFeature(CustomFeature feature, TableDeMatiere tableDeMatiere, IDataRenderer renderer)
        {
            string rendu = "";
            if (feature.DependentOn.Count > 0)
                rendu += "Cette fonctionnalité depend des fonctionnalités suivantes :\n" +
                         new HTMLRenderer().RenderUnorderedList(feature.DependentOn);
            rendu += RenderGroups(feature.Groups, renderer);
            rendu += RenderLists(feature.Lists, feature, renderer);
            string tF = string.Format("Fonctionnalité {0}", feature.Name);
            if (string.IsNullOrWhiteSpace(rendu))
            {
                return "";
            }
            return renderer.RenderTitle(tF, 6) + rendu;
        }

        //public static string RenderTableOfContent(TableOfContent tableDeMatiere, IDataRenderer dataRenderer)
        //{
        //    int _lastLevel = 4;
        //    string _markdownTable = "";
        //    foreach (var titre in tableDeMatiere.Titres)
        //    {
        //        var titres = new List<string>();

        //        var title = dataRenderer.RenderLink(titre.Title, titre.LinkId);
        //        if (titre.Level == _lastLevel)
        //        {
        //            _markdownTable += "<ol type='I'><li>" + titre.Title + "</li>\n";
        //        }
        //    }
        //    return "</ol>" + _markdownTable;
        //}

        private static string RenderSite(Site site, List<CustomFeature> webAppFeatures, TableDeMatiere tableDeMatiere,
             IDataRenderer renderer)
        {
            var enable = "";
            var modele = "";
            switch (site.Template)
            {
                case "STS#1":
                    {
                        modele = "Blank Site(1033)";

                        ;
                        break;
                    }
                case "STS#0":
                    {
                        modele = "Team Site (1033)";
                        break;
                    }
                case "GLOBAL#0":
                    {
                        modele = "Global template (1033)";
                        break;
                    }
            }
            string titre = string.Format("Site {0}", site.Name);
            string rendu = renderer.RenderTitle(titre, 4);
            rendu += string.Format(_formatSite, site.Description, modele);
            var fonctionnaliteSiteTable = new DataTable();
            fonctionnaliteSiteTable.Header.Add("Description");
            fonctionnaliteSiteTable.Header.Add("Activer");
            foreach (var sitefeature in site.Features)
            {
                if (sitefeature.Enable == true)
                    enable = "Oui";
                else enable = "Non";
                var row = new List<string>();
                row.Add(sitefeature.Description);
                row.Add(enable);
                fonctionnaliteSiteTable.Rows.Add(row);
            }
            rendu += renderer.RenderTitle("Fonctionnalités du site", 5) + new HTMLRenderer().RenderTable(fonctionnaliteSiteTable);
            var fonctionnaliteWebTable = new DataTable();
            fonctionnaliteWebTable.Header.Add("Description");
            fonctionnaliteWebTable.Header.Add("Activer");
            foreach (var webfeature in site.WebFeatures)
            {
                if (webfeature.Enable == true)
                    enable = "Oui";
                else enable = "Non";
                var row = new List<string>();
                row.Add(webfeature.Description);
                row.Add(enable);
                fonctionnaliteWebTable.Rows.Add(row);
            }
            rendu += renderer.RenderTitle("Fonctionnalités du web", 5) + new HTMLRenderer().RenderTable(fonctionnaliteWebTable);
            rendu += renderer.RenderTitle("Fonctionnalités personnalisées", 5);
            foreach (var customfeature in site.CustomFeatures)
            {
                var customFeatureInfo = webAppFeatures.FirstOrDefault(ft => ft.Name == customfeature);
                if (customFeatureInfo != null)
                    rendu += RenderFeature(customFeatureInfo, tableDeMatiere, renderer);
            }
            return rendu;
        }

        private static string RenderStyle()
        {
            var execPath = System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var path = System.IO.Path.Combine(execPath, "Stylesheet1.css");
            var css = File.ReadAllText(path);
            var pathPrint = System.IO.Path.Combine(execPath, "StylesheetPrint.css");
            var cssPrint = File.ReadAllText(pathPrint);
            return string.Format(_style, css + " " + cssPrint);
        }

        public static string RenderWebApp(WebApplication webApp, IDataRenderer renderer)
        {
            var tableDeMatiere = new TableDeMatiere();
            string entete = RenderStyle() +
                            renderer.RenderTitle("SONES - Portail SharePoint", 1) +
                            renderer.RenderTitle("Documentation Fonctionnelles et Techniques\n***\n", 1);
            string t = renderer.RenderTitle("Introduction :", 2) +
                       renderer.RenderTitle("Applications web :", 2) +
                       renderer.RenderTitle("Sites :\n", 3);
            foreach (var site in webApp.Sites)
            {
                t += RenderSite(site, webApp.Features, tableDeMatiere, renderer);
            }
            return entete + t;
        }


    }
}


