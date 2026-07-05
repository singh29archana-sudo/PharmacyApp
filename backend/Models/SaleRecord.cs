namespace MedicineTracker.Api.Models;

public class SaleRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MedicineId { get; set; }
    public string MedicineName { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    public decimal PriceAtSale { get; set; }
}
