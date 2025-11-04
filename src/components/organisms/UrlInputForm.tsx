import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Loader2 } from 'lucide-react';

const urlSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
});

type UrlFormData = z.infer<typeof urlSchema>;

interface UrlInputFormProps {
  onSubmit: (data: UrlFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export function UrlInputForm({
  onSubmit,
  isLoading = false,
}: UrlInputFormProps) {
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleSubmit = async (data: UrlFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Page URL *</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/page"
            {...form.register('url')}
            disabled={isLoading}
          />
          {form.formState.errors.url && (
            <p className="text-sm text-red-500">
              {form.formState.errors.url.message}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Enter the full URL of the page you want to analyze
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Page'
          )}
        </Button>
      </form>
    </div>
  );
}
