import { useState } from 'react';
import { Settings, Shield, Building, Save, HelpCircle, ArrowRight, ClipboardCheck } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Select } from '../../components/ui';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'governance' | 'general' | 'security' | 'companies'>('governance');
  const [appName, setAppName] = useState('Odoo ESG Compliance');
  const [emailAlerts, setEmailAlerts] = useState('yes');

  // Governance settings states
  const [policyReminders, setPolicyReminders] = useState(true);
  const [autoFlagOverdue, setAutoFlagOverdue] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState('15');
  const [defaultAuditFrequency, setDefaultAuditFrequency] = useState('quarterly');
  const [escalationDays, setEscalationDays] = useState('5');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure application variables, manage company registries, and audit workspace preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab('governance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'governance'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" /> Governance Settings
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'general'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" /> General Settings
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" /> Security & Access
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'companies'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4" /> Company Administration
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'governance' && (
        <form onSubmit={handleSave}>
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary-600" />
                Governance & Compliance Settings
              </CardTitle>
              <CardDescription>Configure rules, notification frequencies, and escalation protocols.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Toggles section */}
              <div className="space-y-4 border-b border-gray-150 pb-6">
                <h3 className="font-semibold text-gray-900 text-sm">Rules & Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Policy reminders toggle */}
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={policyReminders}
                      onChange={(e) => setPolicyReminders(e.target.checked)}
                      className="mt-1 h-4.5 w-4.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">Policy acknowledgement reminders</span>
                      <span className="text-xs text-gray-500">Send reminder pings to employees who haven't read new policies.</span>
                    </div>
                  </label>

                  {/* Auto flag toggle */}
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoFlagOverdue}
                      onChange={(e) => setAutoFlagOverdue(e.target.checked)}
                      className="mt-1 h-4.5 w-4.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">Auto flag overdue compliance issues</span>
                      <span className="text-xs text-gray-500">Automatically mark tasks as "Overdue" when target compliance dates pass.</span>
                    </div>
                  </label>

                  {/* Email notifications toggle */}
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="mt-1 h-4.5 w-4.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">Email notifications</span>
                      <span className="text-xs text-gray-500">Transmit security digests and compliance reports via email channels.</span>
                    </div>
                  </label>

                  {/* In-app notifications toggle */}
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inAppNotifications}
                      onChange={(e) => setInAppNotifications(e.target.checked)}
                      className="mt-1 h-4.5 w-4.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">In-app notifications</span>
                      <span className="text-xs text-gray-500">Trigger banner warnings and status changes directly in the workspace.</span>
                    </div>
                  </label>

                </div>
              </div>

              {/* Frequencies & Thresholds section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm">Frequencies & Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div>
                    <Select
                      label="Reminder Frequency"
                      value={reminderFrequency}
                      onChange={(e) => setReminderFrequency(e.target.value)}
                      options={[
                        { value: '7', label: 'Every 7 Days' },
                        { value: '15', label: 'Every 15 Days' },
                        { value: '30', label: 'Every 30 Days' },
                      ]}
                    />
                  </div>

                  <div>
                    <Select
                      label="Default Audit Frequency"
                      value={defaultAuditFrequency}
                      onChange={(e) => setDefaultAuditFrequency(e.target.value)}
                      options={[
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                        { value: 'semi-annually', label: 'Semi-Annually' },
                        { value: 'annually', label: 'Annually' },
                      ]}
                    />
                  </div>

                  <div>
                    <Input
                      label="Compliance Issue Escalation Days"
                      type="number"
                      value={escalationDays}
                      onChange={(e) => setEscalationDays(e.target.value)}
                      min="1"
                      max="90"
                    />
                  </div>

                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Governance Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {activeTab === 'general' && (
        <form onSubmit={handleSave}>
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Workspace Configuration</CardTitle>
              <CardDescription>Adjust dashboard title, notifications, and localized variables.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Application Banner / Name"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
                <Select
                  label="Email Compliance Notifications"
                  value={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.value)}
                  options={[
                    { value: 'yes', label: 'All Alerts (Real-Time)' },
                    { value: 'weekly', label: 'Weekly Summary Digest Only' },
                    { value: 'no', label: 'Disable Email Alerts' },
                  ]}
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {activeTab === 'security' && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Identity & Access Logs</CardTitle>
            <CardDescription>Verify user authentication logs, roles definition, and multi-factor validation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-600" /> Administrative Roles
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Manage active permissions mapping for manager, administrator and auditor categories.
                </p>
                <Link to="/website/users/roles">
                  <Button variant="outline" size="sm" className="inline-flex items-center gap-1.5">
                    Roles Matrix <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary-600" /> Admin Users List
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  View and assign administrators, super-admins, or revoke authorization rights.
                </p>
                <Link to="/website/users/admins">
                  <Button variant="outline" size="sm" className="inline-flex items-center gap-1.5">
                    Manage Admins <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'companies' && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Company Registry Control</CardTitle>
            <CardDescription>Add new registered companies under compliance tracking or edit existing details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 rounded-xl border border-dashed border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950 flex items-center gap-2 text-base">
                  <Building className="w-5 h-5 text-primary-600" /> Registered Companies Database
                </h3>
                <p className="text-sm text-gray-500 max-w-lg">
                  Navigate to the complete database directory of tracked companies. Here you can edit company profiles, tiers, GSTINs, PAN cards, and contacts.
                </p>
              </div>
              <Link to="/website/users">
                <Button className="flex items-center gap-2 whitespace-nowrap">
                  Manage All Companies <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
