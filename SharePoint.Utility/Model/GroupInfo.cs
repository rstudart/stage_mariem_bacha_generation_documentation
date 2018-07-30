using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class Group
    {
        public Group()
        {
            this.Assignments = new List<RoleAssignment>();
            this.Members = new List<string>();
        }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<RoleAssignment> Assignments { get; set; }
        public List<string> Members { get; set; }

    }
}
