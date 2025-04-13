
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Resource {
  title: string;
  type: string;
  platform: string;
  url: string;
  imageUrl: string;
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="h-36 overflow-hidden">
        <img
          src={resource.imageUrl}
          alt={resource.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
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
