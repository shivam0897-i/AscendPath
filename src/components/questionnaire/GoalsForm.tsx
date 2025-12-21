/**
 * GoalsForm - Step 5 of Career Questionnaire
 * 
 * Collects career goals, salary concerns, education plans, and role models.
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { GoalsFormProps } from "./types"

const CAREERS = [
    "Software Developer", "Data Scientist", "Doctor/Physician", "Teacher/Professor",
    "Business Manager", "Engineer", "Designer", "Researcher",
    "Marketing Specialist", "Financial Analyst", "Healthcare Professional", "Artist/Creative",
]

export function GoalsForm({ data, updateData }: GoalsFormProps) {
    const handleCareerChange = (career: string, checked: boolean) => {
        if (checked) {
            updateData({ consideringCareers: [...data.consideringCareers, career] })
        } else {
            updateData({ consideringCareers: data.consideringCareers.filter((c) => c !== career) })
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold text-charcoal">Goals and Aspirations</h3>
                <p className="text-muted-foreground">Let&apos;s understand your career goals and aspirations.</p>
            </div>

            <div className="space-y-8">
                {/* Five Year Plan */}
                <div className="space-y-3">
                    <Label htmlFor="fiveYearPlan" className="text-base font-medium">
                        18. Where do you see yourself in 5-10 years in terms of your career?
                    </Label>
                    <Textarea
                        id="fiveYearPlan"
                        value={data.fiveYearPlan}
                        onChange={(e) => updateData({ fiveYearPlan: e.target.value })}
                        placeholder="Describe your career goals for the next 5-10 years"
                        className="min-h-[120px] rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                    />
                </div>

                {/* Careers Considering */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">
                        19. Are there any specific careers or roles you are currently considering?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {CAREERS.map((career) => (
                            <div key={career} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <Checkbox
                                    id={`career-${career}`}
                                    checked={data.consideringCareers.includes(career)}
                                    onCheckedChange={(checked) => handleCareerChange(career, checked as boolean)}
                                    className="text-purple-500 border-gray-300"
                                />
                                <Label htmlFor={`career-${career}`} className="flex-1 cursor-pointer font-medium">{career}</Label>
                            </div>
                        ))}
                    </div>
                    <Input
                        placeholder="Other careers (comma separated)"
                        className="rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                        onChange={(e) => {
                            const other = e.target.value.split(",").map((c) => c.trim()).filter((c) => c)
                            const existing = data.consideringCareers.filter((c) => CAREERS.includes(c))
                            updateData({ consideringCareers: [...existing, ...other] })
                        }}
                    />
                </div>

                {/* Salary Concern */}
                <div className="space-y-3">
                    <Label htmlFor="salaryConcern" className="text-base font-medium">
                        20. How important is earning a high salary to you?
                    </Label>
                    <RadioGroup
                        value={data.salaryConcern}
                        onValueChange={(value) => updateData({ salaryConcern: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {["Very Important", "Somewhat Important", "Not Important"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`salary-${option.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-500" />
                                <Label htmlFor={`salary-${option.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Further Education */}
                <div className="space-y-3">
                    <Label htmlFor="furtherEducation" className="text-base font-medium">
                        21. Are you interested in pursuing further education or certifications to achieve your career goals?
                    </Label>
                    <RadioGroup
                        value={data.furtherEducation}
                        onValueChange={(value) => updateData({ furtherEducation: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {["Yes", "No", "Maybe"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`education-${option.toLowerCase()}`} className="text-purple-500" />
                                <Label htmlFor={`education-${option.toLowerCase()}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Role Models */}
                <div className="space-y-3">
                    <Label htmlFor="roleModels" className="text-base font-medium">
                        22. Do you have any role models or professionals in a field you admire? If yes, what do they do?
                    </Label>
                    <Textarea
                        id="roleModels"
                        value={data.roleModels}
                        onChange={(e) => updateData({ roleModels: e.target.value })}
                        placeholder="Describe any role models or professionals you admire"
                        className="min-h-[120px] rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                    />
                </div>
            </div>
        </div>
    )
}
