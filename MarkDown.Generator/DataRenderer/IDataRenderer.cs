using MarkDown.Generator.DataRenderer.Model;
using MarkDown.Generator.Model;
using System.Collections.Generic;

namespace MarkDown.Generator.DataRenderer
{
    public interface IDataRenderer
    {
        string RenderTable(DataTable table);
        string RenderUnorderedList(List<string> items);
        
        string RenderTitle(string title, int level);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="title"></param>
        /// <param name="level"></param>
        /// <param name="linkId">link ot title </param>
        /// <returns></returns>
    
        string RenderLink(string title, int linkId);
        string RenderTableOfContent(TableOfContent tableDeMatiere);
        string RenderOrderedList(List<string> items, string type);
        string RenderParagraphe(string content);
    }
}
