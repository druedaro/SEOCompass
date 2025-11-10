import { MapPin, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function TeamMembersPage() {
  const { currentTeam, teamMembers, isLoadingMembers, refreshMembers } = useWorkspace();

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'tech_seo':
        return 'default'; // Blue
      case 'content_seo':
        return 'secondary'; // Gray
      case 'developer':
        return 'outline'; // Border only
      default:
        return 'secondary';
    }
  };

  if (!currentTeam) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <p>No team selected</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{currentTeam.name}</h1>
          <p className="text-muted-foreground">Manage team members and roles</p>
          {currentTeam.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {currentTeam.description}
            </p>
          )}
          {currentTeam.location && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{currentTeam.location}</span>
            </div>
          )}
        </div>
        <Button
          onClick={refreshMembers}
          variant="outline"
          size="sm"
          disabled={isLoadingMembers}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingMembers ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingMembers ? (
            <p className="text-muted-foreground">Loading members...</p>
          ) : teamMembers.length === 0 ? (
            <p className="text-muted-foreground">No members yet</p>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const userName = member.profile?.full_name || member.profile?.email || member.user_id;
                const userAvatar = member.profile?.avatar_url;
                const userEmail = member.profile?.email;
                
                return (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                        <AvatarFallback>
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userName}</p>
                        {member.profile?.full_name && userEmail && (
                          <p className="text-xs text-muted-foreground">{userEmail}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      </div>
    </DashboardLayout>
  );
}
