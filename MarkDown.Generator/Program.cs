using CommonMark;
using HeyRed.MarkdownSharp;
using MarkDown.Generator.DataRenderer;
using MarkDown.Generator.DataRenderer.Model;
using System.IO;
using System.Linq;


namespace MarkDown.Generator
{
    class Program
    {
        const string _path = @"D:\readme.md";
        static void Main(string[] args)
        {
              if (File.Exists(_path))
             {
                   File.Delete(_path);
               }
              
            var sp = SharePointProject.Load(@"D:\Projects\MarkDownGenerator\Sones.Portal\deploy\WebApps");
            var appWeb = sp.Structure.WebApplications
                              .First(a => a.Name == "Portal");

            var contenu = DocumentationRenderer.RenderWebApp(appWeb,new MarkDownRendrer());
            Markdown mark = new Markdown();
            // Run parser
            string text = mark.Transform(contenu);
            File.AppendAllText(_path, contenu);
            using (var reader = new System.IO.StreamReader(@"D:\readme.md"))
            using (var writer = new System.IO.StreamWriter(@"D:\result.html"))
            {
                var settings = CommonMarkSettings.Default;

                CommonMark.CommonMarkConverter.Convert(reader, writer, settings);
            }
            IronPdf.HtmlToPdf Renderer = new IronPdf.HtmlToPdf();
            if (File.Exists(@"D:\html-file.pdf"))
            {
                File.Delete(@"D:\html-file.pdf");
            }
            Renderer.RenderHTMLFileAsPdf(@"D:\result.html").SaveAs(@"D:\html-file.pdf");
        }
    }
}
