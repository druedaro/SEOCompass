import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Avatar, AvatarFallback } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { InviteMemberForm } from '@/components/organisms/InviteMemberForm';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function TeamMembersPage() {
  const { currentTeam, teamMembers, isLoadingMembers } = useWorkspace();
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!currentTeam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>No team selected</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{currentTeam.name}</h1>
          <p className="text-muted-foreground">Manage team members and roles</p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
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
              {teamMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials('User')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Team Member</p>
                      <p className="text-sm text-muted-foreground">{member.user_id}</p>
                    </div>
                  </div>
                  <Badge>{member.role}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteMemberForm open={showInviteDialog} onOpenChange={setShowInviteDialog} />
    </div>
  );
}
