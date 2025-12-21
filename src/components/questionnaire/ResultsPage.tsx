/**
 * ResultsPage - Final step of Career Questionnaire
 * 
 * Displays AI-powered career suggestions based on questionnaire responses.
 * Falls back to local algorithm if API is unavailable.
 */
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Lightbulb, Award, Download, Share2, Sparkles, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { ResultsPageProps, CareerSuggestion, FormData } from "./types"

/**
 * Fallback: Generate career suggestions locally if API fails.
 */
function generateFallbackSuggestions(data: FormData): CareerSuggestion[] {
    const suggestions: CareerSuggestion[] = []

    // Tech careers
    if (
        data.interests.subjects.some((s) => ["Technology", "Mathematics", "Engineering"].includes(s)) ||
        data.interests.hobbies.includes("Coding") ||
        data.skills.technicalSkills.toLowerCase().includes("programming")
    ) {
        suggestions.push({
            title: "Software Developer",
            description: "Design, build, and maintain software applications and systems.",
            matchScore: 95,
            educationPath: "Computer Science degree or coding bootcamp",
            skills: ["Programming", "Problem-solving", "Logical thinking"],
            category: "Technology",
        })

        suggestions.push({
            title: "Data Scientist",
            description: "Analyze and interpret complex data to help organizations make better decisions.",
            matchScore: 90,
            educationPath: "Statistics, Mathematics, or Computer Science degree",
            skills: ["Statistical analysis", "Programming", "Machine learning"],
            category: "Technology",
        })
    }

    // Healthcare careers
    if (data.interests.subjects.includes("Science") || data.interests.industries.includes("Healthcare")) {
        suggestions.push({
            title: "Healthcare Professional",
            description: "Provide medical care and support to patients in various healthcare settings.",
            matchScore: 88,
            educationPath: "Medical degree, nursing degree, or healthcare certification",
            skills: ["Empathy", "Communication", "Attention to detail"],
            category: "Healthcare",
        })
    }

    // Business careers
    if (data.interests.subjects.includes("Business") || data.workPreferences.role === "Leadership") {
        suggestions.push({
            title: "Business Manager",
            description: "Plan, direct, and coordinate operational activities of organizations.",
            matchScore: 85,
            educationPath: "Business Administration or Management degree",
            skills: ["Leadership", "Strategic thinking", "Communication"],
            category: "Business",
        })
    }

    // Add fallback suggestions if needed
    if (suggestions.length < 3) {
        suggestions.push({
            title: "Marketing Specialist",
            description: "Develop and implement marketing strategies to promote products or services.",
            matchScore: 75,
            educationPath: "Marketing, Communications, or Business degree",
            skills: ["Creativity", "Communication", "Strategic thinking"],
            category: "Business",
        })
    }

    return suggestions.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Call AI API to generate personalized career suggestions
 */
async function fetchAICareerSuggestions(formData: FormData): Promise<CareerSuggestion[]> {
    const response = await fetch('/api/career-suggestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
    })

    if (!response.ok) {
        throw new Error('Failed to get AI suggestions')
    }

    const data = await response.json()

    if (!data.success || !Array.isArray(data.suggestions)) {
        throw new Error('Invalid response format')
    }

    return data.suggestions
}

export function ResultsPage({ formData }: ResultsPageProps) {
    const [careerSuggestions, setCareerSuggestions] = useState<CareerSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAIPowered, setIsAIPowered] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const generateSuggestions = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Try AI-powered suggestions first
                const aiSuggestions = await fetchAICareerSuggestions(formData)
                setCareerSuggestions(aiSuggestions)
                setIsAIPowered(true)
                toast.success('AI-powered career suggestions generated!')
            } catch (err) {
                // Fall back to local algorithm
                console.warn('AI suggestions failed, using fallback:', err)
                const fallbackSuggestions = generateFallbackSuggestions(formData)
                setCareerSuggestions(fallbackSuggestions)
                setIsAIPowered(false)
                setError('AI suggestions unavailable. Showing standard recommendations.')
            } finally {
                setIsLoading(false)
            }
        }

        generateSuggestions()
    }, [formData])

    const handleDownloadResults = () => {
        // Create a text representation of the results
        let resultsText = "CAREER SUGGESTION RESULTS\n\n"

        careerSuggestions.forEach((career, index) => {
            resultsText += `${index + 1}. ${career.title} (${career.matchScore}% match)\n`
            resultsText += `   Description: ${career.description}\n`
            resultsText += `   Education Path: ${career.educationPath}\n`
            resultsText += `   Key Skills: ${career.skills.join(", ")}\n`
            resultsText += `   Category: ${career.category}\n\n`
        })

        // Create a blob and download it
        const blob = new Blob([resultsText], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "career-suggestions.txt"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-terracotta mb-6"></div>
                <p className="text-lg font-medium text-charcoal">
                    Analyzing your responses and generating career suggestions...
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2">
                    <h3 className="text-2xl font-heading font-bold gradient-text">
                        Your Career Suggestions
                    </h3>
                    {isAIPowered && (
                        <Badge className="bg-gradient-to-r from-terracotta to-sage text-white text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Powered
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {isAIPowered
                        ? "Our AI has analyzed your unique profile to generate personalized career recommendations just for you."
                        : "Based on your responses, we've identified the following career paths that may be a good fit for you."
                    }
                </p>
                {error && (
                    <div className="inline-flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {careerSuggestions.map((career, index) => (
                    <Card key={index} className="overflow-hidden border-terracotta/10 hover:shadow-warm-md transition-shadow">
                        <CardHeader className="bg-warm-gradient pb-4">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl text-charcoal">{career.title}</CardTitle>
                                <Badge variant="outline" className="bg-white font-medium border-terracotta/30">
                                    {career.matchScore}% Match
                                </Badge>
                            </div>
                            <CardDescription className="text-charcoal/70">{career.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <p className="text-charcoal/80">{career.description}</p>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <GraduationCap className="h-4 w-4 text-terracotta" />
                                    <span className="font-medium">Education Path:</span>
                                </div>
                                <p className="text-sm text-muted-foreground pl-6">{career.educationPath}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Award className="h-4 w-4 text-terracotta" />
                                    <span className="font-medium">Key Skills:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pl-6">
                                    {career.skills.map((skill, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="text-xs bg-sage-light/50 text-sage-dark hover:bg-sage-light"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-warm-gradient p-8 rounded-2xl space-y-6 border border-terracotta/10">
                <div className="flex items-start gap-4">
                    <Lightbulb className="h-8 w-8 text-terracotta mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-heading font-semibold text-xl text-charcoal">Next Steps</h4>
                        <p className="text-muted-foreground mt-2">
                            Consider researching these career paths further, speaking with professionals in these fields, or exploring
                            educational opportunities that align with these suggestions. AscendPath offers resources to help you
                            connect with mentors and educational programs in your areas of interest.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                    <Button
                        onClick={handleDownloadResults}
                        className="bg-terracotta hover:bg-terracotta-dark text-white px-6 py-2.5 h-auto rounded-lg shadow-warm"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Your Results
                    </Button>
                    <Button
                        variant="outline"
                        className="border-terracotta/30 text-charcoal hover:bg-cream px-6 py-2.5 h-auto rounded-lg"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Results
                    </Button>
                </div>
            </div>
        </div>
    )
}
