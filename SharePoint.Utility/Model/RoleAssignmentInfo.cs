using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility.Model
{
    public class RoleAssignment
    {
        public string ObjectType { get; set; }
        public string ObjectName { get; set; }
        public List<string> Roles { get; set; }
    }
}
