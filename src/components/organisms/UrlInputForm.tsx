import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { Loader2 } from 'lucide-react';

const singlePageSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  focusKeyword: z.string().optional(),
});

const sitemapSchema = z.object({
  sitemapUrl: z.string().url({ message: 'Please enter a valid sitemap URL' }),
  maxPages: z.number().min(1).max(100).default(20),
});

type SinglePageFormData = z.infer<typeof singlePageSchema>;
type SitemapFormData = z.infer<typeof sitemapSchema>;

interface UrlInputFormProps {
  onSubmitSinglePage: (data: SinglePageFormData) => void | Promise<void>;
  onSubmitSitemap: (data: SitemapFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export function UrlInputForm({
  onSubmitSinglePage,
  onSubmitSitemap,
  isLoading = false,
}: UrlInputFormProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'sitemap'>('single');

  const singlePageForm = useForm<SinglePageFormData>({
    resolver: zodResolver(singlePageSchema),
    defaultValues: {
      url: '',
      focusKeyword: '',
    },
  });

  const sitemapForm = useForm<SitemapFormData>({
    resolver: zodResolver(sitemapSchema),
    defaultValues: {
      sitemapUrl: '',
      maxPages: 20,
    },
  });

  const handleSinglePageSubmit = async (data: SinglePageFormData) => {
    await onSubmitSinglePage(data);
  };

  const handleSitemapSubmit = async (data: SitemapFormData) => {
    await onSubmitSitemap(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'single' | 'sitemap')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Page</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <form
            onSubmit={singlePageForm.handleSubmit(handleSinglePageSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="url">Page URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/page"
                {...singlePageForm.register('url')}
                disabled={isLoading}
              />
              {singlePageForm.formState.errors.url && (
                <p className="text-sm text-red-500">
                  {singlePageForm.formState.errors.url.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Enter the full URL of the page you want to analyze
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="focusKeyword">Focus Keyword (Optional)</Label>
              <Input
                id="focusKeyword"
                type="text"
                placeholder="e.g., seo optimization"
                {...singlePageForm.register('focusKeyword')}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Specify a keyword to optimize for detailed analysis
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
        </TabsContent>

        <TabsContent value="sitemap" className="space-y-4">
          <form
            onSubmit={sitemapForm.handleSubmit(handleSitemapSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="sitemapUrl">Sitemap URL *</Label>
              <Input
                id="sitemapUrl"
                type="url"
                placeholder="https://example.com/sitemap.xml"
                {...sitemapForm.register('sitemapUrl')}
                disabled={isLoading}
              />
              {sitemapForm.formState.errors.sitemapUrl && (
                <p className="text-sm text-red-500">
                  {sitemapForm.formState.errors.sitemapUrl.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Enter the URL of your XML sitemap
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPages">Maximum Pages to Analyze</Label>
              <Input
                id="maxPages"
                type="number"
                min={1}
                max={100}
                {...sitemapForm.register('maxPages', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {sitemapForm.formState.errors.maxPages && (
                <p className="text-sm text-red-500">
                  {sitemapForm.formState.errors.maxPages.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Analyze up to 100 pages from your sitemap (default: 20)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Sitemap...
                </>
              ) : (
                'Analyze Sitemap'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
