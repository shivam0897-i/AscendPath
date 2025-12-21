/**
 * SkillsForm - Step 3 of Career Questionnaire
 * 
 * Collects skills, awards, and self-assessment of abilities.
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { SkillsFormProps } from "./types"

const SKILLS = [
    "Problem-solving", "Communication", "Leadership", "Creativity", "Critical thinking",
    "Time management", "Organization", "Adaptability", "Teamwork", "Technical skills",
    "Writing", "Public speaking", "Research", "Analysis", "Attention to detail",
]

export function SkillsForm({ data, updateData }: SkillsFormProps) {
    const handleSkillChange = (skill: string, checked: boolean) => {
        if (checked) {
            updateData({ topSkills: [...data.topSkills, skill] })
        } else {
            updateData({ topSkills: data.topSkills.filter((s) => s !== skill) })
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold text-charcoal">Skills and Strengths</h3>
                <p className="text-muted-foreground">Let&apos;s identify your key skills and strengths.</p>
            </div>

            <div className="space-y-8">
                {/* Skills Selection */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">8. What skills do you believe you excel at?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {SKILLS.map((skill) => (
                            <div
                                key={skill}
                                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <Checkbox
                                    id={`skill-${skill}`}
                                    checked={data.topSkills.includes(skill)}
                                    onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                                    className="text-purple-500 border-gray-300"
                                />
                                <Label htmlFor={`skill-${skill}`} className="flex-1 cursor-pointer font-medium">
                                    {skill}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <Input
                        placeholder="Other skills (comma separated)"
                        className="rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                        onChange={(e) => {
                            const other = e.target.value.split(",").map((s) => s.trim()).filter((s) => s)
                            const existing = data.topSkills.filter((s) => SKILLS.includes(s))
                            updateData({ topSkills: [...existing, ...other] })
                        }}
                    />
                </div>

                {/* Awards */}
                <div className="space-y-3">
                    <Label htmlFor="awards" className="text-base font-medium">
                        9. Have you received any recognition or awards for specific skills or achievements? If yes, please describe.
                    </Label>
                    <Textarea
                        id="awards"
                        value={data.awards}
                        onChange={(e) => updateData({ awards: e.target.value })}
                        placeholder="Describe any awards, recognition, or achievements you've received"
                        className="min-h-[120px] rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                    />
                </div>

                {/* Analytical Thinking */}
                <div className="space-y-3">
                    <Label htmlFor="analyticalThinking" className="text-base font-medium">
                        10. Are you comfortable with tasks that require analytical thinking, such as math or data analysis?
                    </Label>
                    <RadioGroup
                        value={data.analyticalThinking}
                        onValueChange={(value) => updateData({ analyticalThinking: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {["Yes", "Somewhat", "No"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`analytical-${option.toLowerCase()}`} className="text-purple-500" />
                                <Label htmlFor={`analytical-${option.toLowerCase()}`} className="flex-1 cursor-pointer font-medium">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Teamwork */}
                <div className="space-y-3">
                    <Label htmlFor="teamwork" className="text-base font-medium">
                        11. How would you rate your ability to work in a team?
                    </Label>
                    <RadioGroup
                        value={data.teamwork}
                        onValueChange={(value) => updateData({ teamwork: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-4"
                    >
                        {["Excellent", "Good", "Fair", "Needs Improvement"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`teamwork-${option.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-500" />
                                <Label htmlFor={`teamwork-${option.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 cursor-pointer font-medium">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Technical Skills */}
                <div className="space-y-3">
                    <Label htmlFor="technicalSkills" className="text-base font-medium">
                        12. Do you have any technical skills, such as programming, graphic design, or video editing? If yes, please list them.
                    </Label>
                    <Textarea
                        id="technicalSkills"
                        value={data.technicalSkills}
                        onChange={(e) => updateData({ technicalSkills: e.target.value })}
                        placeholder="List any technical skills you have"
                        className="min-h-[120px] rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                    />
                </div>
            </div>
        </div>
    )
}
