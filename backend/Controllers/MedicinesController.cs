using System;
using Microsoft.AspNetCore.Mvc;
using MedicineTracker.Api.Models;
using MedicineTracker.Api.Services;

namespace MedicineTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController(JsonStorageService storage) : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Medicine>> GetAll()
    {
        return Ok(storage.GetMedicines());
    }

    [HttpPost]
    public ActionResult<Medicine> Add([FromBody] Medicine medicine)
    {
        var medicines = storage.GetMedicines();

        var name = medicine.FullName?.Trim() ?? string.Empty;
        var existing = medicines.FirstOrDefault(m => string.Equals(m.FullName?.Trim(), name, StringComparison.OrdinalIgnoreCase));

        if (existing != null)
        {
            // Merge quantities into existing medicine entry
            existing.Quantity += medicine.Quantity;
            // Optionally update price if provided (> 0)
            if (medicine.Price > 0) existing.Price = medicine.Price;
            // Merge notes if provided
            if (!string.IsNullOrWhiteSpace(medicine.Notes))
                existing.Notes = string.IsNullOrWhiteSpace(existing.Notes) ? medicine.Notes : existing.Notes + "; " + medicine.Notes;

            storage.SaveMedicines(medicines);
            return CreatedAtAction(nameof(GetAll), new { id = existing.Id }, existing);
        }

        medicine.Id = Guid.NewGuid();
        medicines.Add(medicine);
        storage.SaveMedicines(medicines);
        return CreatedAtAction(nameof(GetAll), new { id = medicine.Id }, medicine);
    }
}
