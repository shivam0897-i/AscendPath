
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
  // Use placeholder if imageUrl is null or empty
  const imageSource = resource.imageUrl || "/placeholder.svg"; // Fallback to placeholder

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-warm-md transition-all border-terracotta/10 hover:border-terracotta/30">
      <div className="h-36 overflow-hidden bg-cream flex items-center justify-center"> {/* Added background and centering */}
        <img
          src={imageSource} // Use the variable with fallback
          alt={resource.title}
          className={`w-full h-full transition-transform hover:scale-105 ${resource.imageUrl ? 'object-cover' : 'object-contain p-4 text-charcoal/40'}`} // Adjust styling for placeholder
          onError={(e) => {
            // Optional: Handle broken image links by setting to placeholder
            (e.target as HTMLImageElement).src = '/placeholder.svg';
            (e.target as HTMLImageElement).classList.add('object-contain', 'p-4', 'text-charcoal/40');
            (e.target as HTMLImageElement).classList.remove('object-cover');
          }}
        />
        {/* Optional: Display an icon if no image URL provided *initially* */}
        {!resource.imageUrl && <BookOpen className="w-12 h-12 text-sage/50" />}
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
