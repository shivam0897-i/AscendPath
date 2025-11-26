import { Search, Filter, Download, Bookmark, Share2, Eye } from "lucide-react"
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import PageTransition from "@/components/PageTransition";

export default function ResourcesPage() {
  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
    <div className="min-h-screen bg-background">
      {/* Header */}
        <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-charcoal dark:text-cream">Your Learning </span>
            <span className="gradient-text">
              Resources
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Access all your educational materials in one place, organized by your roadmap
          </p>
          <Badge variant="outline" className="mt-4 text-amber-600 border-amber-500 bg-amber-50/50">
            🚧 Coming Soon - Resources are being curated
          </Badge>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-10 bg-card border-border focus:border-terracotta focus:ring-terracotta/20" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-charcoal/20 hover:border-terracotta hover:text-terracotta">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* All Resources */}
        <div className="mt-6">
          <h2 className="text-2xl font-heading font-bold mb-6 text-charcoal dark:text-cream">All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource Card 1 */}
            <ResourceCard
              title="Beginner's Guide to Learning Paths"
              type="PDF"
              category="Learning Fundamentals"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 2 */}
            <ResourceCard
              title="Interactive Skill Assessment"
              type="Quiz"
              category="Assessment"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 3 */}
            <ResourceCard
              title="Career Planning Worksheet"
              type="Worksheet"
              category="Career Development"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 4 */}
            <ResourceCard
              title="Industry Expert Interview"
              type="Video"
              category="Industry Insights"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 5 */}
            <ResourceCard
              title="Networking Strategy Guide"
              type="eBook"
              category="Professional Skills"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 6 */}
            <ResourceCard
              title="Resume & Portfolio Templates"
              type="Templates"
              category="Career Development"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 7 */}
            <ResourceCard
              title="Goal Setting Framework"
              type="Worksheet"
              category="Personal Development"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 8 */}
            <ResourceCard
              title="Time Management Techniques"
              type="eBook"
              category="Productivity"
              imageUrl="/placeholder.svg?height=200&width=300"
            />

            {/* Resource Card 9 */}
            <ResourceCard
              title="Communication Skills Workshop"
              type="Video"
              category="Professional Skills"
              imageUrl="/placeholder.svg?height=200&width=300"
            />
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="container mx-auto py-12">
        <div className="bg-warm-gradient rounded-2xl p-8 border border-terracotta/10">
          <h2 className="text-2xl font-heading font-bold mb-6 text-charcoal dark:text-cream">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 flex items-center gap-4 shadow-warm hover:shadow-warm-md transition-shadow">
              <div className="bg-gradient-to-br from-terracotta-light to-cream p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-terracotta"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-charcoal dark:text-cream">Complete Roadmap Guide</h3>
                <p className="text-sm text-muted-foreground">Comprehensive overview of your learning journey</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 flex items-center gap-4 shadow-warm hover:shadow-warm-md transition-shadow">
              <div className="bg-gradient-to-br from-sage-light to-cream p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sage-dark"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-charcoal dark:text-cream">Interactive Tutorials</h3>
                <p className="text-sm text-muted-foreground">Step-by-step learning experiences</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  )
}

function ResourceCard({ title, type, category, imageUrl }) {
  return (
    <Card className="overflow-hidden hover:shadow-warm-md transition-all border-terracotta/10 hover:border-terracotta/30">
      {/* <div className="relative h-40">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <Badge className="absolute top-3 right-3 bg-card text-card-foreground">{type}</Badge>
      </div> */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading text-charcoal dark:text-cream">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <Badge variant="secondary" className="bg-sage-light/50 text-sage-dark">
          {category}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-terracotta">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-terracotta">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-terracotta">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
    
  )
}