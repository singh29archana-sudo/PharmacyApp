import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../services/sales.service';
import { MedicineService } from '../services/medicine.service';
import { Medicine, RecordSaleRequest, SaleRecord } from '../models/models';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  sales: SaleRecord[] = [];
  medicines: Medicine[] = [];
  showForm = false;
  errorMessage = '';
  successMessage = '';

  saleRequest: RecordSaleRequest = { medicineId: '', quantitySold: 1 };

  get selectedMedicine(): Medicine | undefined {
    return this.medicines.find(m => m.id === this.saleRequest.medicineId);
  }

  constructor(
    private salesService: SalesService,
    private medicineService: MedicineService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSales();
    this.loadMedicines();
  }

  loadSales(): void {
    this.salesService.getAll().subscribe({
      next: (data) => {
        this.sales = data.sort((a, b) =>
          new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
        );
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load sales.';
        this.cdr.detectChanges();
      }
    });
  }

  loadMedicines(): void {
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.medicines = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showForm) this.resetForm();
  }

  submitSale(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.saleRequest.medicineId) {
      this.errorMessage = 'Please select a medicine.';
      return;
    }
    if (this.saleRequest.quantitySold < 1) {
      this.errorMessage = 'Quantity must be at least 1.';
      return;
    }
    this.salesService.recordSale(this.saleRequest).subscribe({
      next: (sale) => {
        this.successMessage = `Sale recorded: ${sale.medicineName} × ${sale.quantitySold}`;
        this.resetForm();
        this.showForm = false;
        this.loadSales();
        this.loadMedicines();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to record sale. Check stock.';
      }
    });
  }

  resetForm(): void {
    this.saleRequest = { medicineId: '', quantitySold: 1 };
  }
}
