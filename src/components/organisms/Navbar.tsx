import { useState } from 'react';
import { LogOut, CheckSquare, FileText } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/molecules/DropdownMenu';
import { TeamSelector } from '@/components/organisms/TeamSelector';
import { CreateTeamDialog } from '@/components/organisms/CreateTeamDialog';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const location = useLocation();
  const params = useParams<{ id: string }>();

  // Detectar si estamos en una página de proyecto y obtener el ID
  const projectId = params.id || location.pathname.match(/\/projects\/([^/]+)/)?.[1];
  const isInProject = projectId && location.pathname.includes('/projects/');

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.[0].toUpperCase() || '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="flex h-8 w-8 items-center justify-center">
                  <img src="/logo.svg" alt="SEO Compass" className="h-8 w-8" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-600 to-[#ee208e] bg-clip-text text-transparent">SEO Compass</span>
              </Link>

              <TeamSelector onCreateTeam={() => setShowCreateTeamDialog(true)} />

              {isInProject && projectId && (
                <div className="hidden md:flex items-center gap-2">
                  <Link to={`/dashboard/projects/${projectId}/actions`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Action Center
                    </Button>
                  </Link>
                  <Link to={`/dashboard/projects/${projectId}/content`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Content Analyzer
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      {getInitials(profile?.full_name)}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium">{profile.full_name}</p>
                      )}
                      {user?.email && (
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <CreateTeamDialog
        open={showCreateTeamDialog}
        onOpenChange={setShowCreateTeamDialog}
      />
    </>
  );
}
