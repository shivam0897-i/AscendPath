
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react"; // Import BookOpen

interface Resource {
  title: string;
  type: string;
  platform: string;
  url: string;
  imageUrl: string | null; // Allow null
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  // Use placeholder if imageUrl is null or empty
  const imageSource = resource.imageUrl || "/placeholder.svg"; // Fallback to placeholder

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="h-36 overflow-hidden bg-gray-100 flex items-center justify-center"> {/* Added background and centering */}
        <img
          src={imageSource} // Use the variable with fallback
          alt={resource.title}
          className={`w-full h-full transition-transform hover:scale-105 ${resource.imageUrl ? 'object-cover' : 'object-contain p-4 text-gray-400'}`} // Adjust styling for placeholder
          onError={(e) => {
            // Optional: Handle broken image links by setting to placeholder
            (e.target as HTMLImageElement).src = '/placeholder.svg';
            (e.target as HTMLImageElement).classList.add('object-contain', 'p-4', 'text-gray-400');
            (e.target as HTMLImageElement).classList.remove('object-cover');
          }}
        />
        {/* Optional: Display an icon if no image URL provided *initially* */}
        {/* {!resource.imageUrl && <BookOpen className="w-12 h-12 text-gray-300" />} */}
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {resource.type}
          </span>
          <span className="text-xs text-gray-500">{resource.platform}</span>
        </div>
        <h3 className="font-medium mb-2">{resource.title}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
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
