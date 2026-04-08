import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import type { Submission } from '../../models/submission.model';

interface SummaryStats {
  total: number;
  engineering: number;
  marketing: number;
  sales: number;
  hr: number;
  other: number;
  uniqueDepartments: number;
  latestSubmission: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  isAuthenticated = false;
  username = '';
  password = '';
  errorMessage = '';
  isLoggingIn = false;

  submissions: Submission[] = [];
  dashboardError = '';

  showEditModal = false;
  editingSubmission: Submission | null = null;
  editError = '';
  editValidationErrors: Record<string, string> = {};
  isSaving = false;

  showDeleteDialog = false;
  deletingSubmission: Submission | null = null;
  deleteError = '';
  isDeleting = false;

  summaryStats: SummaryStats = {
    total: 0,
    engineering: 0,
    marketing: 0,
    sales: 0,
    hr: 0,
    other: 0,
    uniqueDepartments: 0,
    latestSubmission: ''
  };

  private readonly storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  ngOnInit(): void {
    this.isAuthenticated = this.storageService.getAdminSession();
    if (this.isAuthenticated) {
      this.loadSubmissions();
    }
  }

  onLogin(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.isLoggingIn = true;

    setTimeout(() => {
      if (this.username === 'admin' && this.password === 'admin') {
        this.storageService.setAdminSession(true);
        this.isAuthenticated = true;
        this.errorMessage = '';
        this.username = '';
        this.password = '';
        this.loadSubmissions();
      } else {
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
      this.isLoggingIn = false;
    }, 300);
  }

  onLogout(): void {
    this.storageService.setAdminSession(false);
    this.isAuthenticated = false;
    this.submissions = [];
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.dashboardError = '';
    this.closeEditModal();
    this.closeDeleteDialog();
  }

  loadSubmissions(): void {
    try {
      this.dashboardError = '';
      this.submissions = this.storageService.getSubmissions();
      this.computeSummaryStats();
    } catch (e) {
      this.dashboardError = 'Failed to load submissions. Please try again.';
      this.submissions = [];
    }
  }

  computeSummaryStats(): void {
    const subs = this.submissions;
    const departments = new Set<string>();
    let engineering = 0;
    let marketing = 0;
    let sales = 0;
    let hr = 0;
    let other = 0;
    let latestDate = '';

    for (const sub of subs) {
      departments.add(sub.department);

      switch (sub.department.toLowerCase()) {
        case 'engineering':
          engineering++;
          break;
        case 'marketing':
          marketing++;
          break;
        case 'sales':
          sales++;
          break;
        case 'hr':
          hr++;
          break;
        default:
          other++;
          break;
      }

      if (!latestDate || sub.submittedAt > latestDate) {
        latestDate = sub.submittedAt;
      }
    }

    this.summaryStats = {
      total: subs.length,
      engineering,
      marketing,
      sales,
      hr,
      other,
      uniqueDepartments: departments.size,
      latestSubmission: latestDate
    };
  }

  openEditModal(submission: Submission): void {
    this.editingSubmission = {
      id: submission.id,
      fullName: submission.fullName,
      email: submission.email,
      mobile: submission.mobile,
      department: submission.department,
      submittedAt: submission.submittedAt
    };
    this.editError = '';
    this.editValidationErrors = {};
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingSubmission = null;
    this.editError = '';
    this.editValidationErrors = {};
    this.isSaving = false;
  }

  onSaveEdit(): void {
    if (!this.editingSubmission) {
      return;
    }

    this.editValidationErrors = {};
    this.editError = '';

    const fullName = this.editingSubmission.fullName?.trim() ?? '';
    const email = this.editingSubmission.email?.trim() ?? '';
    const mobile = this.editingSubmission.mobile?.trim() ?? '';
    const department = this.editingSubmission.department ?? '';

    if (!fullName) {
      this.editValidationErrors['fullName'] = 'Full Name is required.';
    } else if (fullName.length < 2) {
      this.editValidationErrors['fullName'] = 'Full Name must be at least 2 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      this.editValidationErrors['fullName'] = 'Full Name must contain only letters and spaces.';
    }

    if (!email) {
      this.editValidationErrors['email'] = 'Email is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      this.editValidationErrors['email'] = 'Please enter a valid email address.';
    }

    if (!mobile) {
      this.editValidationErrors['mobile'] = 'Mobile number is required.';
    } else if (!/^\d{10,15}$/.test(mobile)) {
      this.editValidationErrors['mobile'] = 'Mobile number must be 10 to 15 digits.';
    }

    if (!department) {
      this.editValidationErrors['department'] = 'Department is required.';
    }

    if (Object.keys(this.editValidationErrors).length > 0) {
      return;
    }

    this.isSaving = true;

    try {
      const duplicateEmail = this.submissions.find(
        (s) => s.email.toLowerCase() === email.toLowerCase() && s.id !== this.editingSubmission!.id
      );

      if (duplicateEmail) {
        this.editError = 'A submission with this email already exists.';
        this.isSaving = false;
        return;
      }

      this.submissions = this.storageService.updateSubmission(this.editingSubmission.id, {
        fullName,
        email,
        mobile,
        department
      });
      this.computeSummaryStats();
      this.closeEditModal();
    } catch (e) {
      this.editError = 'Failed to save changes. Please try again.';
      this.isSaving = false;
    }
  }

  openDeleteDialog(submission: Submission): void {
    this.deletingSubmission = submission;
    this.deleteError = '';
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.deletingSubmission = null;
    this.deleteError = '';
    this.isDeleting = false;
  }

  onConfirmDelete(): void {
    if (!this.deletingSubmission) {
      return;
    }

    this.isDeleting = true;
    this.deleteError = '';

    try {
      this.submissions = this.storageService.deleteSubmission(this.deletingSubmission.id);
      this.computeSummaryStats();
      this.closeDeleteDialog();
    } catch (e) {
      this.deleteError = 'Failed to delete submission. Please try again.';
      this.isDeleting = false;
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      if (this.showEditModal) {
        this.closeEditModal();
      }
      if (this.showDeleteDialog) {
        this.closeDeleteDialog();
      }
    }
  }
}