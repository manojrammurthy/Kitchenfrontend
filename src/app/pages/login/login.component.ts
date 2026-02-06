// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="login-wrapper">
//       <!-- Modern Floating Navbar -->
//       <nav class="navbar">
//         <div class="nav-content">
//           <div class="nav-logo">
//             <span class="logo-icon">🥘</span>
//             <span class="logo-text">Kitchen Dashboard</span>
//           </div>
//         </div>
//       </nav>

//       <!-- Animated Background Elements -->
//       <div class="bg-elements">
//         <div class="floating-circle circle-1"></div>
//         <div class="floating-circle circle-2"></div>
//         <div class="floating-circle circle-3"></div>
//         <div class="gradient-orb orb-1"></div>
//         <div class="gradient-orb orb-2"></div>
//       </div>

//       <!-- Main Login Card -->
//       <div class="login-container">
//         <div class="login-card">
//           <!-- Header Section -->
//           <div class="login-header">
//             <div class="icon-container">
//               <div class="icon-wrapper">
//                 <img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" class="login-icon" alt="Kitchen Icon" />
//                 <div class="icon-glow"></div>
//               </div>
//             </div>
//             <h1 class="app-title">Kitchen Dashboard</h1>
//             <p class="subtitle">Advanced Inventory & Meal Management System</p>
//             <div class="divider"></div>
//           </div>

//           <!-- Login Form -->
//           <form (ngSubmit)="login()" class="login-form">
//             <div class="form-group">
//               <label for="username" class="form-label">
//                 <span class="label-icon">👤</span>
//                 Username
//               </label>
//               <div class="input-wrapper">
//                 <input 
//                   id="username" 
//                   [(ngModel)]="username" 
//                   name="username" 
//                   required 
//                   placeholder="Enter your username"
//                   class="form-input"
//                 />
//                 <div class="input-highlight"></div>
//               </div>
//             </div>

//             <div class="form-group">
//               <label for="password" class="form-label">
//                 <span class="label-icon">🔐</span>
//                 Password
//               </label>
//               <div class="input-wrapper">
//                 <input 
//                   id="password" 
//                   type="password" 
//                   [(ngModel)]="password" 
//                   name="password" 
//                   required 
//                   placeholder="Enter your password"
//                   class="form-input"
//                 />
//                 <div class="input-highlight"></div>
//               </div>
//             </div>

//             <button type="submit" class="login-button">
//               <span class="button-text">Sign In</span>
//               <div class="button-glow"></div>
//               <div class="button-ripple"></div>
//             </button>
//           </form>
//         </div>

//         <!-- Side Info Panel -->
//         <div class="info-panel">
//           <div class="info-content">
//             <h3 class="info-title">Welcome Back!</h3>
//             <p class="info-description">
//               Access your kitchen management dashboard with real-time inventory tracking, 
//               meal planning, and comprehensive analytics.
//             </p>
//             <div class="feature-list">
//               <div class="feature-item">
//                 <span class="feature-icon">📊</span>
//                 <span>Real-time Analytics</span>
//               </div>
//               <div class="feature-item">
//                 <span class="feature-icon">🍽️</span>
//                 <span>Meal Planning</span>
//               </div>
//               <div class="feature-item">
//                 <span class="feature-icon">📦</span>
//                 <span>Inventory Management</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap');

//     * {
//       box-sizing: border-box;
//       margin: 0;
//       padding: 0;
//     }

//     html, body {
//       height: 100%;
//       overflow: hidden;
//       font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
//     }

//     .login-wrapper {
//       position: relative;
//       height: 100vh;
//       width: 100vw;
//       background: linear-gradient(135deg, #28a745 0%, #20c997 50%, #17a2b8 100%);
//       background-attachment: fixed;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       overflow: hidden;
//     }

//     /* Animated Background Elements */
//     .bg-elements {
//       position: absolute;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       pointer-events: none;
//       overflow: hidden;
//     }

//     .floating-circle {
//       position: absolute;
//       border-radius: 50%;
//       background: rgba(255, 255, 255, 0.1);
//       backdrop-filter: blur(10px);
//       animation: float 20s infinite linear;
//     }

//     .circle-1 {
//       width: 120px;
//       height: 120px;
//       top: 10%;
//       left: 10%;
//       animation-delay: 0s;
//     }

//     .circle-2 {
//       width: 80px;
//       height: 80px;
//       top: 70%;
//       right: 15%;
//       animation-delay: -7s;
//     }

//     .circle-3 {
//       width: 60px;
//       height: 60px;
//       top: 30%;
//       right: 25%;
//       animation-delay: -14s;
//     }

//     .gradient-orb {
//       position: absolute;
//       border-radius: 50%;
//       filter: blur(40px);
//       opacity: 0.3;
//       animation: pulse 8s infinite ease-in-out;
//     }

//     .orb-1 {
//       width: 300px;
//       height: 300px;
//       background: linear-gradient(45deg, #28a745, #20c997);
//       top: -10%;
//       left: -10%;
//       animation-delay: 0s;
//     }

//     .orb-2 {
//       width: 250px;
//       height: 250px;
//       background: linear-gradient(45deg, #17a2b8, #28a745);
//       bottom: -10%;
//       right: -10%;
//       animation-delay: -4s;
//     }

//     @keyframes float {
//       0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
//       33% { transform: translateY(-30px) translateX(30px) rotate(120deg); }
//       66% { transform: translateY(30px) translateX(-30px) rotate(240deg); }
//       100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
//     }

//     @keyframes pulse {
//       0%, 100% { transform: scale(1); opacity: 0.3; }
//       50% { transform: scale(1.1); opacity: 0.5; }
//     }

//     /* Modern Navbar */
//     .navbar {
//       position: fixed;
//       top: 20px;
//       left: 50%;
//       transform: translateX(-50%);
//       background: rgba(40, 167, 69, 0.2);
//       backdrop-filter: blur(20px);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       border-radius: 16px;
//       padding: 12px 24px;
//       z-index: 1000;
//       box-shadow: 0 8px 32px rgba(40, 167, 69, 0.2);
//     }

//     .nav-content {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 40px;
//     }

//     .nav-logo {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .logo-icon {
//       font-size: 1.5rem;
//     }

//     .logo-text {
//       font-size: 1.1rem;
//       font-weight: 600;
//       color: white;
//     }

//     .nav-status {
//       display: flex;
//       align-items: center;
//       gap: 6px;
//     }

//     .status-dot {
//       width: 8px;
//       height: 8px;
//       background: #00ff88;
//       border-radius: 50%;
//       animation: pulse-dot 2s infinite;
//     }

//     .status-text {
//       font-size: 0.85rem;
//       color: rgba(255, 255, 255, 0.8);
//       font-weight: 500;
//     }

//     @keyframes pulse-dot {
//       0%, 100% { opacity: 1; transform: scale(1); }
//       50% { opacity: 0.5; transform: scale(1.2); }
//     }

//     /* Main Container */
//     .login-container {
//       display: flex;
//       background: rgba(255, 255, 255, 0.1);
//       backdrop-filter: blur(20px);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       border-radius: 24px;
//       box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
//       overflow: hidden;
//       max-width: 900px;
//       width: 90%;
//       min-height: 500px;
//       animation: slideIn 0.8s ease-out;
//     }

//     @keyframes slideIn {
//       from {
//         opacity: 0;
//         transform: translateY(30px) scale(0.95);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0) scale(1);
//       }
//     }

//     /* Login Card */
//     .login-card {
//       flex: 1;
//       padding: 40px;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//     }

//     .login-header {
//       text-align: center;
//       margin-bottom: 32px;
//     }

//     .icon-container {
//       position: relative;
//       display: inline-block;
//       margin-bottom: 20px;
//     }

//     .icon-wrapper {
//       position: relative;
//       display: inline-block;
//     }

//     .login-icon {
//       width: 64px;
//       height: 64px;
//       z-index: 2;
//       position: relative;
//     }

//     .icon-glow {
//       position: absolute;
//       top: -8px;
//       left: -8px;
//       right: -8px;
//       bottom: -8px;
//       background: linear-gradient(45deg, #28a745, #20c997);
//       border-radius: 50%;
//       opacity: 0.3;
//       filter: blur(8px);
//       z-index: 1;
//       animation: iconGlow 3s ease-in-out infinite;
//     }

//     @keyframes iconGlow {
//       0%, 100% { opacity: 0.3; transform: scale(1); }
//       50% { opacity: 0.6; transform: scale(1.1); }
//     }

//     .app-title {
//       font-size: 2.2rem;
//       font-weight: 700;
//       color: white;
//       margin-bottom: 8px;
//       letter-spacing: -0.02em;
//     }

//     .subtitle {
//       font-size: 1rem;
//       color: rgba(255, 255, 255, 0.8);
//       font-weight: 400;
//       line-height: 1.5;
//     }

//     .divider {
//       width: 60px;
//       height: 3px;
//       background: linear-gradient(90deg, #28a745, #20c997);
//       margin: 24px auto 0;
//       border-radius: 2px;
//     }

//     /* Form Styles */
//     .login-form {
//       display: flex;
//       flex-direction: column;
//       gap: 24px;
//     }

//     .form-group {
//       position: relative;
//     }

//     .form-label {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       font-weight: 600;
//       color: white;
//       margin-bottom: 8px;
//       font-size: 0.95rem;
//     }

//     .label-icon {
//       font-size: 1rem;
//     }

//     .input-wrapper {
//       position: relative;
//     }

//     .form-input {
//       width: 100%;
//       padding: 16px 20px;
//       border: 2px solid rgba(255, 255, 255, 0.2);
//       border-radius: 12px;
//       background: rgba(255, 255, 255, 0.1);
//       backdrop-filter: blur(10px);
//       font-size: 1rem;
//       color: white;
//       transition: all 0.3s ease;
//       outline: none;
//     }

//     .form-input::placeholder {
//       color: rgba(255, 255, 255, 0.6);
//     }

//     .form-input:focus {
//       border-color: rgba(40, 167, 69, 0.8);
//       background: rgba(255, 255, 255, 0.15);
//       transform: translateY(-2px);
//       box-shadow: 0 10px 25px rgba(40, 167, 69, 0.2);
//     }

//     .input-highlight {
//       position: absolute;
//       bottom: 0;
//       left: 50%;
//       width: 0;
//       height: 2px;
//       background: linear-gradient(90deg, #28a745, #20c997);
//       transition: all 0.3s ease;
//       transform: translateX(-50%);
//     }

//     .form-input:focus + .input-highlight {
//       width: 100%;
//     }

//     /* Login Button */
//     .login-button {
//       position: relative;
//       background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
//       color: white;
//       border: none;
//       padding: 18px 32px;
//       border-radius: 12px;
//       font-size: 1.1rem;
//       font-weight: 600;
//       cursor: pointer;
//       overflow: hidden;
//       transition: all 0.3s ease;
//       margin-top: 8px;
//     }

//     .login-button:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 15px 35px rgba(40, 167, 69, 0.4);
//       background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
//     }

//     .login-button:active {
//       transform: translateY(0);
//     }

//     .button-text {
//       position: relative;
//       z-index: 3;
//     }

//     .button-glow {
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
//       opacity: 0;
//       transition: opacity 0.3s ease;
//     }

//     .login-button:hover .button-glow {
//       opacity: 1;
//     }

//     .button-ripple {
//       position: absolute;
//       top: 50%;
//       left: 50%;
//       width: 0;
//       height: 0;
//       background: rgba(255, 255, 255, 0.3);
//       border-radius: 50%;
//       transform: translate(-50%, -50%);
//       transition: all 0.6s ease;
//     }

//     .login-button:active .button-ripple {
//       width: 300px;
//       height: 300px;
//     }

//     .login-footer {
//       text-align: center;
//       margin-top: 16px;
//     }

//     .forgot-password {
//       color: rgba(255, 255, 255, 0.8);
//       text-decoration: none;
//       font-size: 0.9rem;
//       font-weight: 500;
//       transition: color 0.3s ease;
//     }

//     .forgot-password:hover {
//       color: #28a745;
//     }

//     /* Info Panel */
//     .info-panel {
//       flex: 0.8;
//       background: rgba(40, 167, 69, 0.1);
//       backdrop-filter: blur(10px);
//       padding: 40px;
//       display: flex;
//       align-items: center;
//       border-left: 1px solid rgba(255, 255, 255, 0.1);
//     }

//     .info-content {
//       width: 100%;
//     }

//     .info-title {
//       font-size: 1.8rem;
//       font-weight: 700;
//       color: white;
//       margin-bottom: 16px;
//       letter-spacing: -0.01em;
//     }

//     .info-description {
//       color: rgba(255, 255, 255, 0.8);
//       line-height: 1.6;
//       margin-bottom: 32px;
//       font-size: 1rem;
//     }

//     .feature-list {
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//     }

//     .feature-item {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       color: rgba(255, 255, 255, 0.9);
//       font-weight: 500;
//     }

//     .feature-icon {
//       font-size: 1.2rem;
//       width: 24px;
//     }

//     /* Responsive Design */
//     @media (max-width: 768px) {
//       .login-container {
//         flex-direction: column;
//         width: 95%;
//         min-height: auto;
//       }

//       .info-panel {
//         border-left: none;
//         border-top: 1px solid rgba(255, 255, 255, 0.1);
//         padding: 24px;
//       }

//       .login-card {
//         padding: 32px 24px;
//       }

//       .app-title {
//         font-size: 1.8rem;
//       }

//       .navbar {
//         position: relative;
//         top: auto;
//         left: auto;
//         transform: none;
//         margin-bottom: 20px;
//         width: 90%;
//       }

//       .login-wrapper {
//         padding: 20px;
//         align-items: flex-start;
//         padding-top: 40px;
//       }

//       .info-title {
//         font-size: 1.5rem;
//       }

//       .feature-list {
//         flex-direction: row;
//         flex-wrap: wrap;
//         gap: 12px;
//       }

//       .feature-item {
//         flex: 1;
//         min-width: calc(50% - 6px);
//       }
//     }

//     @media (max-width: 480px) {
//       .form-input {
//         padding: 14px 16px;
//       }

//       .login-button {
//         padding: 16px 24px;
//       }

//       .app-title {
//         font-size: 1.6rem;
//       }

//       .nav-content {
//         gap: 20px;
//       }

//       .logo-text {
//         font-size: 1rem;
//       }
//     }
//   `]
// })
// export class LoginComponent {
//   username = '';
//   password = '';
//   role = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   login() {
//     if (this.username && this.password) {
//       this.authService.login(this.username, this.password, this.role).subscribe({
//         next: (res) => {
//           console.log('Login Success');
//           localStorage.setItem('role', res.role);

//           if (res.role === 'admin') {
//             this.router.navigate(['/dashboard']);
//           } else {
//             this.router.navigate(['/meal-tracker']);
//           }
//         },
//         error: (err) => {
//           console.error('Login Failed:', err);
//         }
//       });
//     } else {
//       console.warn('Username and password are required');
//     }
//   }
// }



import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <!-- Background Image Overlay -->
      <div class="background-overlay"></div>
      
      <!-- Professional Header -->
      <header class="system-header">
        <div class="header-content">
          <div class="brand-section">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="brand-text">
              <h1 class="system-name">Kitchen Management System</h1>
              <p class="system-subtitle">Kitchen Dashboard & Inventory Control</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Login Container -->
      <main class="login-main">
        <div class="login-container">
          <!-- Left Panel - Branding & Information -->
          <div class="info-panel">
            <div class="info-content">
              <div class="institution-logo">
                <div class="logo-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 class="welcome-title">Welcome Back</h2>
              <p class="welcome-description">
                Access your IIHS kitchen management dashboard with comprehensive 
                inventory tracking, meal planning, and operational analytics.
              </p>
              
              <div class="features-grid">
                <div class="feature-card">
                  <div class="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3V5H5V3H3ZM6 3V5H18V3H6ZM3 6V8H5V6H3ZM6 6V8H18V6H6ZM3 9V11H5V9H3ZM6 9V11H18V9H6ZM3 12V14H5V12H3ZM6 12V14H18V12H6ZM3 15V17H5V15H3ZM6 15V17H18V15H6ZM3 18V20H5V18H3ZM6 18V20H18V18H6Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="feature-text">
                    <h4>Inventory Control</h4>
                    <p>Real-time stock monitoring</p>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11H15L13 13L15 15H9L11 13L9 11Z" fill="currentColor"/>
                      <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V8H20V18Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="feature-text">
                    <h4>Analytics Dashboard</h4>
                    <p>Performance insights</p>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="feature-text">
                    <h4>Meal Planning</h4>
                    <p>Strategic menu management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Login Form -->
          <div class="login-panel">
            <div class="login-form-container">
              <div class="form-header">
                <h2 class="form-title">Sign In</h2>
                <p class="form-subtitle">Enter your credentials to access the system</p>
              </div>

              <form (ngSubmit)="login()" class="login-form" novalidate>
                <div class="form-group">
                  <label for="username" class="form-label">
                    <span class="label-text">Username</span>
                    <span class="label-required">*</span>
                  </label>
                  <div class="input-container">
                    <div class="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <input 
                      id="username" 
                      type="text"
                      [(ngModel)]="username" 
                      name="username" 
                      required 
                      placeholder="Enter your username"
                      class="form-input"
                      autocomplete="username"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="password" class="form-label">
                    <span class="label-text">Password</span>
                    <span class="label-required">*</span>
                  </label>
                  <div class="input-container">
                    <div class="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <input 
                      id="password" 
                      type="password" 
                      [(ngModel)]="password" 
                      name="password" 
                      required 
                      placeholder="Enter your password"
                      class="form-input"
                      autocomplete="current-password"
                    />
                  </div>
                </div>

                <!-- <div class="form-options">
                  <label class="checkbox-container">
                    <input type="checkbox" class="checkbox-input">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Remember me</span>
                  </label>
                </div> -->

                <button type="submit" class="login-button">
                  <span class="button-content">
                    <span class="button-text">Sign In</span>
                    <svg class="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </button>
                <div *ngIf="errorMessage" class="error-message">
                  <p>{{ errorMessage }}</p>
                </div>
              </form>

              <!-- <div class="form-footer">
                <p class="support-text">
                  Need help? Contact <a href="mailto:support@institution.edu" class="support-link">IT Support</a>
                </p>
              </div> -->
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <!-- <footer class="system-footer">
        <div class="footer-content">
          <p class="copyright">© 2025 Iihs Kitchen Management System. All rights reserved.</p>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Support</a>
          </div>
        </div>
      </footer> -->
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    

    .login-wrapper {
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      position: relative;
      background-image: url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    }

    .background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(40, 167, 69, 0.85) 0%, 
        rgba(32, 201, 151, 0.75) 50%, 
        rgba(40, 167, 69, 0.9) 100%
      );
      backdrop-filter: blur(2px);
      z-index: 1;
    }

    /* Professional Header */
    .system-header {
      background: rgba(255, 255, 255, 0.95);
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      z-index: 100;
      position: relative;
      backdrop-filter: blur(10px);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .system-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .system-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .system-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(240, 253, 244, 0.9);
      border: 1px solid rgba(187, 247, 208, 0.8);
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse 2s infinite;
    }

    .status-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #166534;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Main Content */
    .login-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      z-index: 2;
    }

    .login-container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      max-width: 1000px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 600px;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Info Panel */
    .info-panel {
      background: linear-gradient(135deg, 
        rgba(40, 167, 69, 0.95) 0%, 
        rgba(32, 201, 151, 0.9) 100%
      );
      padding: 3rem;
      display: flex;
      align-items: center;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .info-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="4"/></g></svg>') repeat;
      opacity: 0.3;
    }

    .info-content {
      position: relative;
      z-index: 2;
    }

    .institution-logo {
      margin-bottom: 2rem;
    }

    .logo-placeholder {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      backdrop-filter: blur(10px);
    }

    .welcome-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .welcome-description {
      font-size: 1rem;
      line-height: 1.6;
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .features-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateX(5px);
    }

    .feature-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-text h4 {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .feature-text p {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    /* Login Panel */
    .login-panel {
      padding: 3rem;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
    }

    .login-form-container {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Form Styles */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .label-required {
      color: #dc2626;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      color: #9ca3af;
      z-index: 2;
      pointer-events: none;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 2px solid rgba(229, 231, 235, 0.8);
      border-radius: 8px;
      font-size: 0.875rem;
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.2s ease;
      outline: none;
      backdrop-filter: blur(10px);
    }

    .form-input:focus {
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
      background: rgba(255, 255, 255, 1);
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.5rem 0;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: #374151;
    }

    .checkbox-input {
      display: none;
    }

    .checkbox-custom {
      width: 16px;
      height: 16px;
      border: 2px solid #d1d5db;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .checkbox-input:checked + .checkbox-custom {
      background: #28a745;
      border-color: #28a745;
    }

    .checkbox-input:checked + .checkbox-custom::after {
      content: '✓';
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .forgot-link {
      font-size: 0.875rem;
      color: #28a745;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .forgot-link:hover {
      color: #1e7e34;
    }

    .login-button {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      margin-top: 0.5rem;
    }

    .login-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
      background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
    }

    .login-button:active {
      transform: translateY(0);
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .button-icon {
      transition: transform 0.2s ease;
    }

    .login-button:hover .button-icon {
      transform: translateX(2px);
    }

    .form-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(229, 231, 235, 0.8);
    }

    .support-text {
      font-size: 0.875rem;
      color: #64748b;
    }

    .support-link {
      color: #28a745;
      text-decoration: none;
      font-weight: 500;
    }

    .support-link:hover {
      color: #1e7e34;
    }

    /* Footer */
    .system-footer {
      background: rgba(255, 255, 255, 0.95);
      border-top: 1px solid rgba(226, 232, 240, 0.8);
      padding: 1rem 2rem;
      position: relative;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .copyright {
      font-size: 0.875rem;
      color: #64748b;
    }

    .footer-links {
      display: flex;
      gap: 1.5rem;
    }

    .footer-link {
      font-size: 0.875rem;
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: #28a745;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .login-container {
        grid-template-columns: 1fr;
        max-width: 500px;
      }

      .info-panel {
        padding: 2rem;
        text-align: center;
      }

      .login-panel {
        padding: 2rem;
      }

      .header-content {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .footer-links {
        justify-content: center;
      }

      .form-options {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }

    @media (max-width: 480px) {
      .login-main {
        padding: 1rem;
      }

      .system-name {
        font-size: 1.25rem;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .form-title {
        font-size: 1.5rem;
      }

      .login-wrapper {
        background-attachment: scroll;
      }
    }
  `]
})

export class LoginComponent implements OnInit {
  username = '';
  password = '';
  role = '';  // Optional, can be removed if not necessary
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is already logged in by checking localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      // Redirect based on the role stored in localStorage
      if (user.role === 'admin') {
        this.router.navigate(['/dashboard']); // Redirect to admin dashboard
      } else {
        this.router.navigate(['/meal-tracker']); // Redirect to meal tracker
      }
    }
  }

  login(): void {
    this.errorMessage = ''; // Reset error message before trying to login

    if (this.username && this.password) {
      this.authService.login(this.username, this.password, this.role).subscribe({
        next: (res) => {
          // Store the user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify(res));
          // Redirect based on role
          if (res.role === 'admin') {
            this.router.navigate(['/dashboard']);  // Admin dashboard
          } else {
            this.router.navigate(['/meal-tracker']);  // Meal tracker
          }
        },
        error: (err) => {
          // Handle login failure and show error message
          console.error('Login Failed:', err);
          
          if (err.status === 401) {
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    } else {
      this.errorMessage = 'Both username and password are required.';
    }
  }
}
