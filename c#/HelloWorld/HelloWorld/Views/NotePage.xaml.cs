using HelloWorld.Models;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.Popups;

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace HelloWorld.Views
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class NotePage : Page
    {
        //private StorageFolder storageFolder = ApplicationData.Current.LocalFolder;
        //private StorageFile? noteFile = null;
        //private string fileName = "note.txt";

        private Note? noteModel;
        public NotePage()
        {
            InitializeComponent();
            //Loaded += NotePage_Loaded;
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            //  ¡ý Update this. ¡ý
            if (e.Parameter is Note note)
            {
                noteModel = note;
            }
            else
            {
                noteModel = new Note();
            }
            // ¡ü Update this. ¡ü
        }

        //private async void NotePage_Loaded(object sender, RoutedEventArgs e)
        //{
        //    noteFile = (StorageFile)await storageFolder.TryGetItemAsync(fileName);
        //    if(noteFile is not null)
        //    {
        //        NoteEditor.Text = await FileIO.ReadTextAsync(noteFile);
        //    }
        //}

        private async void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            //if(noteFile is null)
            //{
            //    noteFile = await storageFolder.CreateFileAsync(fileName);
            //}

            //await FileIO.WriteTextAsync(noteFile, NoteEditor.Text);

            if(noteModel is not null)
            {
                await noteModel.SaveAsync();
            }
        }

        private async void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            //if(noteFile is not null)
            //{
            //    await noteFile.DeleteAsync();
            //    noteFile = null;
            //    NoteEditor.Text = string.Empty;
            //}


            if (noteModel is not null)
            {
                await noteModel.DeleteAsync();
            }

            // ¡ý Add this. ¡ý
            if (Frame.CanGoBack == true)
            {
                Frame.GoBack();
            }
            // ¡ü Add this. ¡ü
        }
    }
}
