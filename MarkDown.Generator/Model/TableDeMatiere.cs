using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarkDown.Generator.Model
{
    public class TableDeMatiere
    {
        private int _lastLevel = 0;
        private string _markdownTable = "";
        public void AddTitle(string title, int level)
        {
            var closing = level < _lastLevel;
            var number = Math.Abs(level - _lastLevel);
            var minLevel = Math.Min(_lastLevel, level);
            for (int i = 0; i < number; i++)
            {
                if (_lastLevel != level)
                {
                    if (closing)
                        _markdownTable += "</ol> \n";
                    else
                        switch (minLevel+number)
                        {
                            case 1:
                                _markdownTable += "<ol  type='I'> \n";
                                break;
                            case 2:
                                _markdownTable += "<ol  type='1'> \n";
                                break;
                            case 3:
                                _markdownTable += "<ol  type='a'> \n";
                                break;
                            default:
                                break;
                        }
                }
            }
            _markdownTable += "<li>" + title + "</li> \n";

            _lastLevel = level;

        }
        public string GetResult()
        {
            for (int i = 0; i < _lastLevel; i++)
            {
                _markdownTable += "</ol>";
            }
            _lastLevel = 0;
            return _markdownTable;
        }
    }
}
