import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import type { Submission } from '../../models/submission.model';

@Component({
  selector: 'app-interest-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './interest-form.component.html',
  styleUrls: ['./interest-form.component.css']
})
export class InterestFormComponent implements OnInit {
  form!: FormGroup;
  successMessage = '';
  errorMessage = '';

  departments: string[] = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Design',
    'Other'
  ];

  private successTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly fb: FormBuilder;
  private readonly storageService: StorageService;

  constructor(fb: FormBuilder, storageService: StorageService) {
    this.fb = fb;
    this.storageService = storageService;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      mobile: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.pattern(/^\d{10,15}$/)
        ]
      ],
      department: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fullName = this.form.value.fullName.trim();
    const email = this.form.value.email.trim().toLowerCase();
    const mobile = this.form.value.mobile.trim();
    const department = this.form.value.department;

    try {
      const existingSubmissions = this.storageService.getSubmissions();
      const isDuplicate = existingSubmissions.some(
        (s) => s.email.toLowerCase() === email
      );

      if (isDuplicate) {
        this.errorMessage = 'This email has already been used to submit interest.';
        return;
      }

      const newSubmission: Submission = {
        id: this.generateUUID(),
        fullName,
        email,
        mobile,
        department,
        submittedAt: new Date().toISOString()
      };

      this.storageService.addSubmission(newSubmission);
      this.showSuccessBanner('Your interest has been submitted successfully!');
      this.resetForm();
    } catch {
      this.errorMessage = 'Unable to save your submission. Please try again.';
    }
  }

  showSuccessBanner(message: string): void {
    this.successMessage = message;

    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }

    this.successTimeout = setTimeout(() => {
      this.successMessage = '';
      this.successTimeout = null;
    }, 4000);
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue({ department: '' });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}