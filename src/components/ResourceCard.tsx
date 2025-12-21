
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, PlayCircle, FileText, Link2 } from "lucide-react";

interface Resource {
  title: string;
  type: string;
  platform: string;
  url: string;
  imageUrl: string | null;
}

interface ResourceCardProps {
  resource: Resource;
}

// Get appropriate icon based on resource type
const getResourceIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('video') || lowerType.includes('course') || lowerType.includes('tutorial')) {
    return <PlayCircle className="w-8 h-8" />;
  }
  if (lowerType.includes('book') || lowerType.includes('article') || lowerType.includes('documentation')) {
    return <FileText className="w-8 h-8" />;
  }
  if (lowerType.includes('interactive')) {
    return <BookOpen className="w-8 h-8" />;
  }
  return <Link2 className="w-8 h-8" />;
};

// Get fallback label based on resource type
const getFallbackLabel = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('video')) return 'Video Resource';
  if (lowerType.includes('course')) return 'Online Course';
  if (lowerType.includes('book')) return 'Book / eBook';
  if (lowerType.includes('article')) return 'Article';
  if (lowerType.includes('tutorial')) return 'Tutorial';
  return 'Learning Resource';
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  // Check if URL is a YouTube thumbnail and upgrade to higher quality
  const getImageUrl = (url: string | null): string | null => {
    if (!url || url.trim() === '') return null;

    // If it's a YouTube default thumbnail, try to get hqdefault instead
    // default.jpg is often the gray placeholder, hqdefault is better quality
    if (url.includes('i.ytimg.com') || url.includes('img.youtube.com')) {
      // Try to use hqdefault or sddefault for better quality
      return url.replace('/default.jpg', '/hqdefault.jpg')
        .replace('/mqdefault.jpg', '/hqdefault.jpg');
    }
    return url;
  };

  const imageUrl = getImageUrl(resource.imageUrl);
  const hasImage = !!imageUrl;
  const FallbackIcon = () => getResourceIcon(resource.type);
  const fallbackLabel = getFallbackLabel(resource.type);
  const isVideo = resource.type.toLowerCase().includes('video');

  // Function to replace image with fallback
  const showFallback = (parent: HTMLElement) => {
    const icon = isVideo
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
    const label = isVideo ? 'Video Resource' : 'Learning Resource';
    parent.innerHTML = `
      <div class="flex flex-col items-center justify-center gap-2 text-terracotta/60">
        ${icon}
        <span class="text-xs font-medium">${label}</span>
      </div>
    `;
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-warm-md transition-all border-terracotta/10 hover:border-terracotta/30">
      <div className="h-36 overflow-hidden bg-gradient-to-br from-cream via-terracotta-light/30 to-sage/20 flex items-center justify-center relative">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              // YouTube default placeholder is typically 120x90 or very small
              // Also check for suspiciously small images that are likely placeholders
              if (img.naturalWidth <= 120 && img.naturalHeight <= 90) {
                img.style.display = 'none';
                const parent = img.parentElement;
                if (parent) showFallback(parent);
              }
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) showFallback(parent);
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-terracotta/60">
            <FallbackIcon />
            <span className="text-xs font-medium">{fallbackLabel}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium bg-terracotta-light/50 text-terracotta-dark px-2 py-1 rounded">
            {resource.type}
          </span>
          <span className="text-xs text-muted-foreground">{resource.platform}</span>
        </div>
        <h3 className="font-medium mb-2 text-charcoal dark:text-cream">{resource.title}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" size="sm" className="w-full border-terracotta/30 hover:border-terracotta hover:text-terracotta hover:bg-terracotta-light/20">
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Access Resource
            <ExternalLink className="h-3 w-3 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;

