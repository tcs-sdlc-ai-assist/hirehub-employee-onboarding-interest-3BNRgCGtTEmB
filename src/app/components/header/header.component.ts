import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAdminLoggedIn = false;
  isMobileMenuOpen = false;

  private readonly router: Router;
  private readonly storageService: StorageService;

  constructor(router: Router, storageService: StorageService) {
    this.router = router;
    this.storageService = storageService;
  }

  ngOnInit(): void {
    this.checkAuthState();
  }

  checkAuthState(): void {
    this.isAdminLoggedIn = this.storageService.getAdminSession();
  }

  onLogout(): void {
    this.storageService.setAdminSession(false);
    this.isAdminLoggedIn = false;
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}