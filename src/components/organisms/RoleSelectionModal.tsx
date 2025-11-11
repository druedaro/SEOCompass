import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { roleOptions } from '@/schemas/authSchema';
import type { UserRole } from '@/types/domain';

interface RoleSelectionModalProps {
  onSelectRole: (role: UserRole, fullName: string) => Promise<void>;
}

export function RoleSelectionModal({ onSelectRole }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole || !fullName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSelectRole(selectedRole, fullName.trim());
    } finally {
      setIsSubmitting(false);
    }
  };  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center">
              <img src="/logo.svg" alt="SEO Compass" className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-600">
            Welcome to SEO Compass!
          </h2>
          <p className="text-gray-600 mt-2">
            Please complete your profile to continue
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-3 mb-6">
          {roleOptions.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value as UserRole)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedRole === role.value
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              <div className="font-semibold text-gray-900">{role.label}</div>
              <div className="text-sm text-gray-600 mt-1">
                {role.value === 'tech_seo' && 'Focus on technical SEO aspects and website optimization'}
                {role.value === 'content_seo' && 'Create and optimize content for search engines'}
                {role.value === 'developer' && 'Build and maintain SEO-friendly websites'}
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || !fullName.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          You can't change your role later!
        </p>
      </div>
    </div>
  );
}
