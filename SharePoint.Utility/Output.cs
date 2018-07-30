using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharePoint.Utility
{
    public class Output
    {
        private static string _padding = "  ";
        public static void Message(string message, bool line = true)
        {
            var fragments = message.Split('+');
            Console.ForegroundColor = ConsoleColor.White;
            Console.Write(_padding + fragments[0]);
            if(fragments.Length > 0)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.Write(" " + String.Join("", fragments.Skip(1).ToArray()));
            }
            if (line)
                Console.WriteLine();
        }
        public static void Success(string message, bool line = true)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(_padding + message);
            if (line)
                Console.WriteLine();

        }
        public static void Error(string message, bool line = true)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write(_padding + message);
            if (line)
                Console.WriteLine();
        }
        public static void Title(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("");
            Divider();
            Console.WriteLine(_padding + message);
            Divider();
            Console.WriteLine("");
        }
        public static void SubTitle(string message)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("");
            Divider(message);
            Console.WriteLine("");
        }
        public static void Divider(string message = "")
        {
            var divider = "---------------------------------------------------------------------------------------------------------------";
            if (message == "")
                Console.WriteLine(divider);
            else
                Console.WriteLine("--  " + message + "  " + divider.Substring(0, divider.Length - message.Length -6));
        }
        public static void KeyValue(string key, string value)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(_padding + key + " : ");
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(value);
        }
        public static string ReadLine(string message)
        {
            Console.WriteLine("");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write(_padding + message + " > ");
            Console.ForegroundColor = ConsoleColor.White;

            var text = Console.ReadLine();
            Console.WriteLine();
            return text;
        }
    }

}
