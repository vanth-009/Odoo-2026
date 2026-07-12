import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';


// Auth Pages
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// Website Pages
import WebsiteDashboard from './pages/website/DashboardPage';
import CompanyDetailPage from './pages/website/users/CompanyDetailPage';
import UploadsLandingPage from './pages/website/uploads/UploadsLandingPage';
import CompanyUploadFormPage from './pages/website/uploads/CompanyUploadFormPage';
import CompanyRegistration from './pages/website/CompanyRegistration';
import PoliciesPage from './pages/website/PoliciesPage';
import AuditsPage from './pages/website/AuditsPage';
import CompliancePage from './pages/website/CompliancePage';
import SettingsPage from './pages/website/SettingsPage';

// Reviews
import ReviewsListPage from './pages/website/Reviews/ReviewsListPage';
import ReviewFormPage from './pages/website/Reviews/CompanyReview';


// Newsletter
import NewsletterPage from './pages/website/newsletter/NewsletterPage';
import ComposeNewsletterPage from './pages/website/newsletter/ComposeNewsletterPage';
import CampaignsPage from './pages/website/newsletter/CampaignsPage';
import TemplatesPage from './pages/website/newsletter/TemplatesPage';
import TemplateEditorPage from './pages/website/newsletter/TemplateEditorPage';

// Users
import UsersPage from './pages/website/users/UsersPage';
import AdminsPage from './pages/website/users/AdminsPage';
import RolesPage from './pages/website/users/RolesPage';

// Reports
import ReportsDashboardPage from './pages/website/reports/ReportsDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1f2937',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '0.75rem',
                padding: '1rem',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/" element={<Navigate to="/website" replace />} />

            {/* Protected Website Routes */}
            <Route
              path="/website"
              element={
                <ProtectedRoute minRole="manager">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/website/dashboard" replace />} />
              <Route path="dashboard" element={<WebsiteDashboard />} />
              <Route path="company-registration" element={<CompanyRegistration />} />

              {/* Policies, Audits, Compliance, Settings */}
              <Route path="policies" element={<PoliciesPage />} />
              <Route path="audits" element={<AuditsPage />} />
              <Route path="compliance" element={<CompliancePage />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* Newsletter */}
              <Route path="newsletter" element={<NewsletterPage />} />
              <Route path="newsletter/compose" element={<ComposeNewsletterPage />} />
              <Route path="newsletter/compose/:id" element={<ComposeNewsletterPage />} />
              <Route path="newsletter/campaigns" element={<CampaignsPage />} />
              <Route path="newsletter/templates" element={<TemplatesPage />} />
              <Route path="newsletter/templates/new" element={<TemplateEditorPage />} />
              <Route path="newsletter/templates/:id/edit" element={<TemplateEditorPage />} />

              {/* Users - Admin only */}
              <Route
                path="users"
                element={
                  <ProtectedRoute minRole="admin">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/:id"
                element={
                  <ProtectedRoute minRole="admin">
                    <CompanyDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/admins"
                element={
                  <ProtectedRoute minRole="admin">
                    <AdminsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/roles"
                element={
                  <ProtectedRoute minRole="admin">
                    <RolesPage />
                  </ProtectedRoute>
                }
              />

              {/* Reports (Predefined & Custom Builder) */}
              <Route path="reports" element={<ReportsDashboardPage />} />
              <Route path="reports/:reportType" element={<ReportsDashboardPage />} />

              <Route path="reviews" element={<ReviewsListPage />} />
              <Route path="reviews/:id" element={<ReviewFormPage />} />

              {/* Uploads */}
              <Route path="uploads" element={<UploadsLandingPage />} />
              <Route path="uploads/:companyId" element={<CompanyUploadFormPage />} />
            </Route>




            {/* 404 */}
            <Route path="*" element={<Navigate to="/website" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
