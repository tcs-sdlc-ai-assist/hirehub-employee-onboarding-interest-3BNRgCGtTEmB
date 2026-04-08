import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Submission } from '../../models/submission.model';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {
  @Input() submission: Submission | null = null;
  @Output() saveSubmission = new EventEmitter<Submission>();
  @Output() closeModal = new EventEmitter<void>();

  editForm!: FormGroup;

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

  private readonly fb: FormBuilder;

  constructor(fb: FormBuilder) {
    this.fb = fb;
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      fullName: [
        this.submission?.fullName ?? '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/)
        ]
      ],
      email: [
        this.submission?.email ?? '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      mobile: [
        this.submission?.mobile ?? '',
        [
          Validators.required,
          Validators.pattern(/^\d{10,15}$/)
        ]
      ],
      department: [
        this.submission?.department ?? '',
        [
          Validators.required
        ]
      ]
    });
  }

  save(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.submission) {
      return;
    }

    const updated: Submission = {
      id: this.submission.id,
      fullName: this.editForm.value.fullName.trim(),
      email: this.editForm.value.email.trim(),
      mobile: this.editForm.value.mobile.trim(),
      department: this.editForm.value.department,
      submittedAt: this.submission.submittedAt
    };

    this.saveSubmission.emit(updated);
  }

  close(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}