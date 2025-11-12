import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface TeamSelectorProps {
  onCreateTeam?: () => void;
}

export function TeamSelector({ onCreateTeam }: TeamSelectorProps) {
  const { currentTeam, teams, switchTeam } = useWorkspace();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentTeam?.id || ''}
        onValueChange={(value: string) => switchTeam(value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onCreateTeam && (
        <Button
          variant="outline"
          size="icon"
          onClick={onCreateTeam}
          title="Create new team"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
