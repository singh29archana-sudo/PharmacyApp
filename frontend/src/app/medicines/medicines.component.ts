import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicineService } from '../services/medicine.service';
import { Medicine } from '../models/models';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.scss']
})
export class MedicinesComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchTerm = '';
  showAddForm = false;
  errorMessage = '';
  successMessage = '';

  newMedicine: Omit<Medicine, 'id'> = {
    fullName: '',
    notes: '',
    expiryDate: '',
    quantity: 0,
    price: 0,
    brand: ''
  };

  constructor(private medicineService: MedicineService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.medicines = data;
        this.applySearch();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load medicines.';
        this.cdr.detectChanges();
      }
    });
  }

  applySearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMedicines = term
      ? this.medicines.filter(m => m.fullName.toLowerCase().includes(term))
      : [...this.medicines];
  }

  onSearchChange(): void {
    this.applySearch();
  }

  getRowClass(medicine: Medicine): string {
    const daysUntilExpiry = this.daysUntilExpiry(medicine.expiryDate);
    if (daysUntilExpiry < 30) return 'row-expired';
    if (medicine.quantity < 10) return 'row-low-stock';
    return '';
  }

  daysUntilExpiry(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showAddForm) this.resetForm();
  }

  submitAdd(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.newMedicine.fullName || !this.newMedicine.brand || !this.newMedicine.expiryDate) {
      this.errorMessage = 'Full Name, Brand and Expiry Date are required.';
      return;
    }
    this.medicineService.add(this.newMedicine).subscribe({
      next: () => {
        this.successMessage = 'Medicine added successfully!';
        this.resetForm();
        this.showAddForm = false;
        this.load();
      },
      error: () => this.errorMessage = 'Failed to add medicine.'
    });
  }

  resetForm(): void {
    this.newMedicine = { fullName: '', notes: '', expiryDate: '', quantity: 0, price: 0, brand: '' };
  }
}
