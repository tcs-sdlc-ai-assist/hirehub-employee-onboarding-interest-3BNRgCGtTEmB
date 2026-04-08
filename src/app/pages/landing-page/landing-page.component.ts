import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-heading">Welcome to HireHub</h1>
          <p class="hero-subheading">
            Your gateway to exciting career opportunities. Join our team and be part of something extraordinary.
          </p>
          <button class="cta-button primary" (click)="navigateToApply()">
            Express Your Interest
          </button>
        </div>
      </section>

      <!-- Why Join Us Section -->
      <section class="features-section">
        <h2 class="section-heading">Why Join Us?</h2>
        <div class="features-grid">
          @for (card of featureCards; track card.title) {
            <div class="feature-card">
              <div class="feature-icon">{{ card.icon }}</div>
              <h3 class="feature-title">{{ card.title }}</h3>
              <p class="feature-description">{{ card.description }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Bottom CTA Section -->
      <section class="bottom-cta-section">
        <h2 class="bottom-cta-heading">Ready to Start Your Journey?</h2>
        <p class="bottom-cta-subheading">
          Take the first step towards an amazing career. We'd love to hear from you.
        </p>
        <button class="cta-button primary" (click)="navigateToApply()">
          Apply Now
        </button>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .landing-page {
      width: 100%;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1a1a2e;
    }

    /* Hero Section */
    .hero-section {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 720px;
    }

    .hero-heading {
      font-size: 3.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 1.25rem 0;
      line-height: 1.15;
    }

    .hero-subheading {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 2.5rem 0;
      line-height: 1.6;
    }

    /* CTA Button */
    .cta-button {
      display: inline-block;
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .cta-button.primary {
      background-color: #ffffff;
      color: #667eea;
    }

    .cta-button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    .cta-button.primary:active {
      transform: translateY(0);
    }

    /* Features Section */
    .features-section {
      padding: 5rem 2rem;
      background-color: #f8f9fa;
      text-align: center;
    }

    .section-heading {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 3rem 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .feature-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2.5rem 2rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 0.75rem 0;
    }

    .feature-description {
      font-size: 1rem;
      color: #555;
      line-height: 1.6;
      margin: 0;
    }

    /* Bottom CTA Section */
    .bottom-cta-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      text-align: center;
    }

    .bottom-cta-heading {
      font-size: 2.25rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 1rem 0;
    }

    .bottom-cta-subheading {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 2.5rem 0;
      max-width: 600px;
      line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-heading {
        font-size: 2.25rem;
      }

      .hero-subheading {
        font-size: 1.05rem;
      }

      .hero-section {
        min-height: 60vh;
      }

      .section-heading,
      .bottom-cta-heading {
        font-size: 1.75rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .features-section,
      .bottom-cta-section {
        padding: 3rem 1.5rem;
      }

      .cta-button {
        padding: 0.875rem 2rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .hero-heading {
        font-size: 1.75rem;
      }

      .hero-subheading {
        font-size: 0.95rem;
      }

      .feature-card {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class LandingPageComponent {
  featureCards: FeatureCard[] = [
    {
      icon: '🚀',
      title: 'Career Growth',
      description: 'Accelerate your career with mentorship programs, learning opportunities, and a clear path to advancement.'
    },
    {
      icon: '🤝',
      title: 'Collaborative Culture',
      description: 'Work alongside talented professionals in an inclusive environment that values teamwork and innovation.'
    },
    {
      icon: '💡',
      title: 'Innovative Projects',
      description: 'Tackle challenging problems and contribute to cutting-edge solutions that make a real-world impact.'
    },
    {
      icon: '⚖️',
      title: 'Work-Life Balance',
      description: 'Enjoy flexible schedules, remote work options, and comprehensive benefits designed for your well-being.'
    }
  ];

  private readonly router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  navigateToApply(): void {
    this.router.navigate(['/apply']);
  }
}