using System;
using System.Collections.Generic;
using MarkDown.Generator.DataRenderer.Model;
using MarkDown.Generator.Model;

namespace MarkDown.Generator.DataRenderer
{
    public class MarkDownRendrer : IDataRenderer
    {
        public string RenderLink(string title, int linkId)
        {
            return $"[{title}](#{linkId})";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="items"></param>
        /// <param name="type"> I , 1 ou a </param>
        /// <returns></returns>
        public string RenderOrderedList(List<string> items, string type)
        {
            throw new NotImplementedException();
        }

        public string RenderParagraphe(string content)
        {
            return $"\n\n{content}\n\n";
        }

        public string RenderTable(DataTable table)
        {
            string dataTable = "\n\n";
            string headerSeparator = "";
            foreach (var item in table.Header)
            {
                dataTable += "|" + item;
                headerSeparator += "|----";
            }
            dataTable += "|\n" + headerSeparator + "|\n";
            foreach (var row in table.Rows)
            {
                foreach (var item in row)
                {
                    dataTable += "|" + item;
                }
                dataTable += "|\n";
            }
            return dataTable;
        }

        public string RenderTableOfContent(TableOfContent tableDeMatiere)
        {
            throw new NotImplementedException();
        }

        public string RenderTitle(string title, int level)
        {
            
            if (level > 6)
            {
                return $"\n\n <span class='h{level}'>{title}</span>\n";
            }
            else
            {
                string titre = "\n\n";
                for (int i = 0; i < level; i++)
                {
                    titre += "#";
                }
                titre += " " + title;
                return $" {titre} \n";
            }
        }

        public string RenderUnorderedList(List<string> items)
        {
            string rendu = "";
            foreach (var item in items)
            {
                rendu += " * " + item +"\n";
            }
            return rendu;
        }
    }
}
