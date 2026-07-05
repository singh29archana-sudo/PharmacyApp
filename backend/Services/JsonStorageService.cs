using System.Text.Json;
using MedicineTracker.Api.Models;

namespace MedicineTracker.Api.Services;

public class JsonStorageService
{
    private readonly string _medicinesPath;
    private readonly string _salesPath;
    private readonly JsonSerializerOptions _jsonOptions = new() { WriteIndented = true };

    public JsonStorageService(IWebHostEnvironment env)
    {
        var dataDir = Path.Combine(env.ContentRootPath, "data");
        Directory.CreateDirectory(dataDir);
        _medicinesPath = Path.Combine(dataDir, "medicines.json");
        _salesPath = Path.Combine(dataDir, "sales.json");
    }

    public List<Medicine> GetMedicines()
    {
        if (!File.Exists(_medicinesPath)) return [];
        var json = File.ReadAllText(_medicinesPath);
        return JsonSerializer.Deserialize<List<Medicine>>(json, _jsonOptions) ?? [];
    }

    public void SaveMedicines(List<Medicine> medicines)
    {
        File.WriteAllText(_medicinesPath, JsonSerializer.Serialize(medicines, _jsonOptions));
    }

    public List<SaleRecord> GetSales()
    {
        if (!File.Exists(_salesPath)) return [];
        var json = File.ReadAllText(_salesPath);
        return JsonSerializer.Deserialize<List<SaleRecord>>(json, _jsonOptions) ?? [];
    }

    public void SaveSales(List<SaleRecord> sales)
    {
        File.WriteAllText(_salesPath, JsonSerializer.Serialize(sales, _jsonOptions));
    }
}
