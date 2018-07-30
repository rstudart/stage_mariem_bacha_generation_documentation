using MarkDown.Generator.DataRenderer.Model;
using MarkDown.Generator.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator.DataRenderer
{
    public class HTMLRenderer : IDataRenderer
    {
        public string RenderLink(string title, int linkId)
        {
            throw new NotImplementedException();
        }

        public string RenderOrderedList(List<string> items, string type)
        {
            string rendu = "";
            switch (type)
            {
                case "I":
                    rendu += "<ol  type='I'>\n";
                    break;
                case "1":
                    rendu += "<ol  type='1'>\n";
                    break;
                case "a":
                    rendu += "<ol  type='a'>\n";
                    break;
            }
            foreach (var item in items)
            {
                rendu += $"<li>{item}</li>";
            }
            rendu += "</ol>";
            return rendu;
        }

        public string RenderParagraphe(string content)
        {
            return $"\n <p>{content}</p> \n";
                }

        public string RenderTable(DataTable table)
        {
            string dataTable = "<table><tr>";
            foreach (var item in table.Header)
            {
                dataTable += "<th>" + item + "</th>";
            }
            dataTable += "</tr>";
            foreach (var row in table.Rows)
            {
                dataTable += "<tr>";
                foreach (var item in row)
                {
                    dataTable += "<td>" + item + "</td>";
                }
                dataTable += "</tr>";
            }
            return dataTable+"</table>\n";
        }

        public string RenderTableOfContent(TableOfContent tableDeMatiere)
        {
            throw new NotImplementedException();
        }

        public string RenderTitle(string title, int level)
        {
            throw new NotImplementedException();
        }

        public string RenderUnorderedList(List<string> items)
        {
            string rendu = "<ul>";
            foreach (var item in items)
            {
                rendu += "<li>" + item + "</li>";
            }
            return rendu + "</ul>";
        }
    }
}
