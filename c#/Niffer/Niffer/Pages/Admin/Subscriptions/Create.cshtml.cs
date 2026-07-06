using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Niffer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Niffer.Pages.Admin.Subscriptions
{
    public class CreateModel : PageModel
    {
        private readonly Niffer.Data.ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public CreateModel(Niffer.Data.ApplicationDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public Subscription Subscription { get; set; } = default!;

        public async Task<IActionResult> OnPostAppendAsync()
        {
            return await ProcessAndSaveAsync(overwirte: true);
        }
        public async Task<IActionResult> OnPostOverwriteAsync()
        {
            return await ProcessAndSaveAsync(overwirte: false);
        }

        private async Task<IActionResult> ProcessAndSaveAsync(bool overwirte)
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            try
            {
                var client = _httpClientFactory.CreateClient();
                string base64Response = await client.GetStringAsync(Subscription.Url);
                if (string.IsNullOrWhiteSpace(base64Response))
                {
                    ModelState.AddModelError("Subscription.Url", "该 URL 未返回任何内容。");
                    return Page();
                }
                string cleanBase64 = base64Response.Trim();
                byte[] buffer = Convert.FromBase64String(cleanBase64);
                string decodedText = Encoding.UTF8.GetString(buffer);

                string[] rawItems = decodedText.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

                if (rawItems.Length == 0)
                {
                    ModelState.AddModelError("Subscription.Url", "Decoded successfully, but no individual rows were found.");
                    return Page();
                }

                if (overwirte)
                {
                    //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE [Subscriptions]");

                    // Option B: Fallback EF clearing method if SQLite or Truncate fails
                    _context.Subscriptions.RemoveRange(_context.Subscriptions);
                }

                foreach (var item in rawItems)
                {
                    var cleanedItem = item.Trim();
                    if (!string.IsNullOrEmpty(cleanedItem))
                    {
                        var record = new Subscription
                        {
                            Url = cleanedItem
                        };
                        _context.Subscriptions.Add(record);
                    }
                }

                await _context.SaveChangesAsync();
                return RedirectToPage("./Index");

            }
            catch (HttpRequestException)
            {
                ModelState.AddModelError("Subscription.Url", "Failed to connect to the remote URL host.");
                return Page();
            }
            catch (FormatException)
            {
                ModelState.AddModelError("Subscription.Url", "The payload fetched from the URL is not a valid Base64 string.");
                return Page();
            }
            catch(Exception ex)
            {
                ModelState.AddModelError(string.Empty, "An unexpected error occurred: " + ex.Message);
                return Page();
            }

        }

        public async Task<IActionResult> OnPostDirectImportAsync(string rawBase64Input, string importMode) {
            if (string.IsNullOrWhiteSpace(rawBase64Input))
            {
                ModelState.AddModelError(string.Empty, "输入的 Base64 内容不能为空。");
                return Page();
            }


            try
            {
                string cleanBase64 = rawBase64Input.Trim();
                byte[] buffer = Convert.FromBase64String(cleanBase64);
                string decodedText = Encoding.UTF8.GetString(buffer);

                string[] rawItems = decodedText.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

                if (rawItems.Length == 0)
                {
                    ModelState.AddModelError(string.Empty, "Decoded successfully, but no individual rows were found.");
                    return Page();
                }

                bool overwirte = importMode == "overwrite";
                if (overwirte)
                {
                    //await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE [Subscriptions]");

                    // Option B: Fallback EF clearing method if SQLite or Truncate fails
                    _context.Subscriptions.RemoveRange(_context.Subscriptions);
                }

                foreach (var item in rawItems)
                {
                    var cleanedItem = item.Trim();
                    if (!string.IsNullOrEmpty(cleanedItem))
                    {
                        var record = new Subscription
                        {
                            Url = cleanedItem
                        };
                        _context.Subscriptions.Add(record);
                    }
                }

                await _context.SaveChangesAsync();
                return RedirectToPage("./Index");

            }
            catch (FormatException)
            {
                ModelState.AddModelError(string.Empty, "The payload fetched from the URL is not a valid Base64 string.");
                return Page();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, "An unexpected error occurred: " + ex.Message);
                return Page();
            }
        }
    }
}
