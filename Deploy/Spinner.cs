using SharePoint.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Deploy
{
    public class Spinner
    {
        #region Fields
        private static BackgroundWorker _spinner = CreatedWorker();
        private static int _spinnerPosition = 0;
        private static int _spinWait = 200;
        private static bool _isRunning;
        #endregion

        #region Properties
        public static bool IsRunning { get { return _isRunning; } }
        #endregion

        #region Methods
        public static void Start(string message,int spinWait = 200)
        {
            _isRunning = true;
            _spinWait = spinWait;
            if (!_spinner.IsBusy)
            {
                Output.Message(message, false);
                _spinner.RunWorkerAsync();
            }
        }
        public static void Stop()
        {
            _spinner.CancelAsync();

            while (_spinner.IsBusy)
                System.Threading.Thread.Sleep(100);

            Console.CursorLeft = _spinnerPosition;
            _isRunning = false;
        }
        public static void Sucess()
        {
            Stop();
            Output.Success("Terminé");
        }
        public static void Error()
        {
            Stop();
            Output.Error("Erreur");
        }
        #endregion

        #region Private methods
        private static BackgroundWorker CreatedWorker()
        {

            var worker = new BackgroundWorker();
            worker.WorkerSupportsCancellation = true;
            worker.DoWork += delegate
            {
                _spinnerPosition = Console.CursorLeft;
                while (!worker.CancellationPending)
                {
                    char[] spinChars = new char[] { '|', '/', '-', '\\' };
                    foreach (char spinChar in spinChars)
                    {
                        Console.CursorLeft = _spinnerPosition;
                        Console.Write(" ");
                        Console.Write(spinChar);
                        System.Threading.Thread.Sleep(_spinWait);
                    }
                }
            };
            return worker;
        } 
        #endregion
    }
}
