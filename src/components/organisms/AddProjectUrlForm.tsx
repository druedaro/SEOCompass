import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { projectUrlSchema, ProjectUrlFormData } from '@/schemas/urlSchema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/Card';

import type { AddProjectUrlFormProps } from '@/types/componentTypes';

export function AddProjectUrlForm({ onAdd, isAdding, currentCount, maxCount }: AddProjectUrlFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProjectUrlFormData>({
        resolver: zodResolver(projectUrlSchema),
        mode: 'onBlur',
        defaultValues: {
            url: '',
            label: '',
        },
    });

    const onSubmit = async (data: ProjectUrlFormData) => {
        const success = await onAdd(data.url, data.label || '');
        if (success) {
            reset();
        }
    };

    const isLimitReached = currentCount >= maxCount;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New URL</CardTitle>
                <CardDescription>
                    Add a URL to track and analyze its SEO performance
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="url">URL *</Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://example.com/page"
                                {...register('url')}
                                disabled={isAdding || isLimitReached}
                            />
                            {errors.url && (
                                <p className="text-sm text-destructive">{errors.url.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="label">Label (Optional)</Label>
                            <Input
                                id="label"
                                type="text"
                                placeholder="e.g., Homepage, Blog Post"
                                {...register('label')}
                                disabled={isAdding || isLimitReached}
                            />
                            {errors.label && (
                                <p className="text-sm text-destructive">{errors.label.message}</p>
                            )}
                        </div>
                    </div>
                    <Button type="submit" disabled={isAdding || isLimitReached}>
                        <Plus className="mr-2 h-4 w-4" />
                        {isAdding ? 'Adding...' : 'Add URL'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
