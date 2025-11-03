import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { roleOptions } from '@/schemas/authSchema';
import type { UserRole } from '@/types/domain';

interface RoleSelectionModalProps {
  onSelectRole: (role: UserRole) => Promise<void>;
}

export function RoleSelectionModal({ onSelectRole }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    try {
      await onSelectRole(selectedRole);
    } catch (error) {
      console.error('Error selecting role:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-600 to-violet-600 shadow-xl">
              <span className="text-xl font-bold text-white">SC</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
            Welcome to SEO Compass!
          </h2>
          <p className="text-slate-600 mt-2">
            Please select your role to continue
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {roleOptions.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value as UserRole)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedRole === role.value
                  ? 'border-fuchsia-600 bg-fuchsia-50'
                  : 'border-gray-200 hover:border-fuchsia-300 bg-white'
              }`}
            >
              <div className="font-semibold text-slate-900">{role.label}</div>
              <div className="text-sm text-slate-600 mt-1">
                {role.value === 'tech_seo' && 'Focus on technical SEO aspects and website optimization'}
                {role.value === 'content_seo' && 'Create and optimize content for search engines'}
                {role.value === 'developer' && 'Build and maintain SEO-friendly websites'}
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>

        <p className="text-xs text-center text-slate-500 mt-4">
          You can change your role later in settings
        </p>
      </div>
    </div>
  );
}
