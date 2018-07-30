using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator.DataRenderer.Model
{
    public class DataTable
    {
        public DataTable()
        {
            Header = new List<string>();
            Rows = new List<List<string>>();
        }
        public List<string> Header { get; set; }
        public List<List<string>> Rows { get; set; }

        
    }
}
