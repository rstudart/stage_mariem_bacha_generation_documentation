using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator
{
    public class Json
    {
        public static T Deserialize<T>(string path)
        {
            var json = File.ReadAllText(path);
            return JsonConvert.DeserializeObject<T>(json);
        }

        public static string Serialize(Object o)
        {
            return JsonConvert.SerializeObject(o);
        }
    }
}
