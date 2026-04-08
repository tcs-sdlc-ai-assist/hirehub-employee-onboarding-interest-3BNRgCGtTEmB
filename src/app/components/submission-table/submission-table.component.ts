import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Submission } from '../../models/submission.model';

interface DepartmentCount {
  department: string;
  count: number;
}

@Component({
  selector: 'app-submission-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submission-table.component.html',
  styleUrls: ['./submission-table.component.css']
})
export class SubmissionTableComponent {
  @Input() submissions: Submission[] = [];

  @Output() edit = new EventEmitter<Submission>();
  @Output() delete = new EventEmitter<string>();

  get departmentCounts(): DepartmentCount[] {
    const counts = new Map<string, number>();
    for (const submission of this.submissions) {
      const dept = submission.department;
      counts.set(dept, (counts.get(dept) || 0) + 1);
    }
    const result: DepartmentCount[] = [];
    counts.forEach((count, department) => {
      result.push({ department, count });
    });
    return result;
  }

  onEdit(submission: Submission): void {
    this.edit.emit(submission);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  getDepartmentClass(department: string): string {
    const normalized = department.toLowerCase().replace(/\s+/g, '-');
    switch (normalized) {
      case 'engineering':
        return 'dept-engineering';
      case 'marketing':
        return 'dept-marketing';
      case 'sales':
        return 'dept-sales';
      case 'hr':
        return 'dept-hr';
      case 'finance':
        return 'dept-finance';
      case 'operations':
        return 'dept-operations';
      case 'design':
        return 'dept-design';
      default:
        return 'dept-default';
    }
  }
}