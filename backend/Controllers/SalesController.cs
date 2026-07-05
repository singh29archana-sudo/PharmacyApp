using Microsoft.AspNetCore.Mvc;
using MedicineTracker.Api.Models;
using MedicineTracker.Api.Services;

namespace MedicineTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController(JsonStorageService storage) : ControllerBase
{
    [HttpGet]
    public ActionResult<List<SaleRecord>> GetAll()
    {
        return Ok(storage.GetSales());
    }

    [HttpPost]
    public ActionResult<SaleRecord> RecordSale([FromBody] SaleRecord sale)
    {
        var medicines = storage.GetMedicines();
        var medicine = medicines.FirstOrDefault(m => m.Id == sale.MedicineId);

        if (medicine == null)
            return NotFound("Medicine not found.");

        if (medicine.Quantity < sale.QuantitySold)
            return BadRequest("Insufficient stock.");

        // Reduce stock
        medicine.Quantity -= sale.QuantitySold;

        // If stock reaches zero or below, remove the medicine entry entirely
        if (medicine.Quantity <= 0)
        {
            medicines.Remove(medicine);
        }

        storage.SaveMedicines(medicines);

        // Save sale record
        sale.Id = Guid.NewGuid();
        sale.MedicineName = medicine.FullName;
        sale.PriceAtSale = medicine.Price;
        sale.SaleDate = DateTime.UtcNow;

        var sales = storage.GetSales();
        sales.Add(sale);
        storage.SaveSales(sales);

        return CreatedAtAction(nameof(GetAll), new { id = sale.Id }, sale);
    }
}
