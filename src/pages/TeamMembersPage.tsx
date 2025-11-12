import { MapPin, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import type { TeamMember } from '@/types/domain';

export default function TeamMembersPage() {
  const { user } = useAuth();
  const { currentTeam, teamMembers, isLoadingMembers, refreshMembers, removeTeamMember, isOwner } = useWorkspace();
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMember = (member: TeamMember) => {
    setMemberToDelete(member);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      await removeTeamMember(memberToDelete.id);
      toast.success('Team member removed successfully');
      setMemberToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove team member');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteMember = () => {
    setMemberToDelete(null);
  };

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
        return 'outline';
      case 'content_seo':
        return 'secondary';
      case 'developer':
        return 'destructive';
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
                  const isCurrentUser = member.user_id === user?.id;
                  const isMemberOwner = member.user_id === currentTeam.user_id;
                  const canDelete = isOwner && !isCurrentUser;
                  
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
                          <div className="font-medium">
                            {userName}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                            )}
                            {isMemberOwner && (
                              <Badge variant="default" className="ml-2">
                                Owner
                              </Badge>
                            )}
                          </div>
                          {member.profile?.full_name && userEmail && (
                            <p className="text-xs text-muted-foreground">{userEmail}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {member.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMember(member)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteConfirmationDialog
          open={!!memberToDelete}
          onOpenChange={cancelDeleteMember}
          onConfirm={confirmDeleteMember}
          title="Remove Team Member"
          description={`Are you sure you want to remove ${memberToDelete?.profile?.full_name || 'this member'} from the team?`}
          isLoading={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
