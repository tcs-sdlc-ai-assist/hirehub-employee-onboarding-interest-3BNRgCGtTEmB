import { Injectable } from '@angular/core';
import type { Submission } from '../models/submission.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly SUBMISSIONS_KEY = 'hirehub_submissions';
  private readonly ADMIN_AUTH_KEY = 'hirehub_admin_auth';

  getSubmissions(): Submission[] {
    try {
      const raw = localStorage.getItem(this.SUBMISSIONS_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify([]));
        return [];
      }
      return parsed as Submission[];
    } catch (e) {
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify([]));
      return [];
    }
  }

  addSubmission(submission: Submission): Submission[] {
    try {
      const submissions = this.getSubmissions();
      submissions.push(submission);
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(submissions));
      return submissions;
    } catch (e) {
      const fallback = [submission];
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(fallback));
      return fallback;
    }
  }

  updateSubmission(id: string, updated: Partial<Submission>): Submission[] {
    try {
      const submissions = this.getSubmissions();
      const idx = submissions.findIndex((s) => s.id === id);
      if (idx === -1) {
        return submissions;
      }
      submissions[idx] = { ...submissions[idx], ...updated };
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(submissions));
      return submissions;
    } catch (e) {
      return this.getSubmissions();
    }
  }

  deleteSubmission(id: string): Submission[] {
    try {
      const submissions = this.getSubmissions();
      const filtered = submissions.filter((s) => s.id !== id);
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (e) {
      return this.getSubmissions();
    }
  }

  resetSubmissions(): Submission[] {
    try {
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify([]));
    } catch (e) {
      // Silent fallback — storage may be full or unavailable
    }
    return [];
  }

  getAdminSession(): boolean {
    try {
      return sessionStorage.getItem(this.ADMIN_AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  setAdminSession(isAuthenticated: boolean): void {
    try {
      if (isAuthenticated) {
        sessionStorage.setItem(this.ADMIN_AUTH_KEY, 'true');
      } else {
        sessionStorage.removeItem(this.ADMIN_AUTH_KEY);
      }
    } catch (e) {
      // Silent fallback — sessionStorage may be unavailable
    }
  }
}