using System.Collections.Generic;
using System.IO;

namespace GenerateurDeDocumentation
{
    public static class ReadData
    {
        public static T Deserialisation<T>(string path)
        {
            string text = System.IO.File.ReadAllText(path);
            var listeDeserialisee = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(text);
            return listeDeserialisee;
        }
        public static List<T> DeserilizeFolder<T>(string folderPath)
        {
            string[] dirs = Directory.GetFiles(folderPath, "*.json");
            var result = new List<T>();
            foreach (var file in dirs)
            {
                result.Add(Deserialisation<T>(file));
            }
            return result;
        }
    }

}
