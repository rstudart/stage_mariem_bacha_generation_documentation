using System.Collections.Generic;

namespace MarkDown.Generator.DataRenderer.Model
{
   public class TableOfContent
    {
        public TableOfContent()
        {
            Titres = new List<TableOfContentItem>();
        }

        public List<TableOfContentItem> Titres;
        
    }
}
