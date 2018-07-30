using SharePoint.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Deploy
{
    public class Background
    {
        #region Fields
        private static BackgroundWorker _worker = null;
        private static AutoResetEvent _resetEvent = new AutoResetEvent(false);
        #endregion

        #region Methods
        public static void Run(string message, Action action)
        {
            _worker = CreatedWorker(message, action);
            _worker.RunWorkerAsync();
            _resetEvent.WaitOne();
        }
        #endregion

        #region Private methods
        private static BackgroundWorker CreatedWorker(string message, Action action)
        {

            var worker = new BackgroundWorker();
            worker.WorkerSupportsCancellation = true;
            worker.DoWork += delegate
            {
                Spinner.Start(message);
                try
                {
                    action();
                    Spinner.Sucess();
                }
                catch(Exception ex)
                {
                    Spinner.Error();
                }
                _resetEvent.Set();
            };
            return worker;
        }
        #endregion
    }
}
