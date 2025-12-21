
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react"; // Import BookOpen

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

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const hasImage = resource.imageUrl && resource.imageUrl.trim() !== '';

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-warm-md transition-all border-terracotta/10 hover:border-terracotta/30">
      <div className="h-36 overflow-hidden bg-gradient-to-br from-cream via-terracotta-light/30 to-sage/20 flex items-center justify-center relative">
        {hasImage ? (
          <img
            src={resource.imageUrl!}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              // Hide broken image and show fallback
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex flex-col items-center justify-center gap-2 text-terracotta/60">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <span class="text-xs font-medium">Learning Resource</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-terracotta/60">
            <BookOpen className="w-8 h-8" />
            <span className="text-xs font-medium">Learning Resource</span>
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
