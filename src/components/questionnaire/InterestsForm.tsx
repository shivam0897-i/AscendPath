/**
 * InterestsForm - Step 2 of Career Questionnaire
 * 
 * Collects subjects, hobbies, industries, and work type preferences.
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { InterestsFormProps } from "./types"

const SUBJECTS = [
    "Science", "Technology", "Engineering", "Mathematics",
    "Arts", "Humanities", "Social Sciences", "Business", "Health Sciences",
]

const HOBBIES = [
    "Sports", "Music", "Reading", "Writing", "Coding",
    "Gaming", "Art/Drawing", "Cooking", "Travel", "Photography",
]

const INDUSTRIES = [
    "Healthcare", "Technology", "Finance", "Education", "Entertainment",
    "Environment", "Manufacturing", "Retail", "Government", "Non-profit",
]

const WORK_TYPES = ["People", "Data", "Technology", "Creative Ideas", "Physical Objects", "Nature"]

export function InterestsForm({ data, updateData }: InterestsFormProps) {
    const handleSubjectChange = (subject: string, checked: boolean) => {
        if (checked) {
            updateData({ subjects: [...data.subjects, subject] })
        } else {
            updateData({ subjects: data.subjects.filter((s) => s !== subject) })
        }
    }

    const handleHobbyChange = (hobby: string, checked: boolean) => {
        if (checked) {
            updateData({ hobbies: [...data.hobbies, hobby] })
        } else {
            updateData({ hobbies: data.hobbies.filter((h) => h !== hobby) })
        }
    }

    const handleIndustryChange = (industry: string, checked: boolean) => {
        if (checked) {
            updateData({ industries: [...data.industries, industry] })
        } else {
            updateData({ industries: data.industries.filter((i) => i !== industry) })
        }
    }

    const handleWorkTypeChange = (workType: string, checked: boolean) => {
        if (checked) {
            updateData({ preferredWorkType: [...data.preferredWorkType, workType] })
        } else {
            updateData({
                preferredWorkType: data.preferredWorkType.filter((w) => w !== workType),
            })
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold text-charcoal">Interests</h3>
                <p className="text-muted-foreground">Tell us about what interests you the most.</p>
            </div>

            <div className="space-y-8">
                {/* Subjects */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">
                        4. Which subjects or topics do you enjoy learning about the most?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {SUBJECTS.map((subject) => (
                            <div
                                key={subject}
                                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <Checkbox
                                    id={`subject-${subject}`}
                                    checked={data.subjects.includes(subject)}
                                    onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                                    className="text-purple-500 border-gray-300"
                                />
                                <Label htmlFor={`subject-${subject}`} className="flex-1 cursor-pointer font-medium">
                                    {subject}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <Input
                        placeholder="Other subjects (comma separated)"
                        className="rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                        onChange={(e) => {
                            const otherSubjects = e.target.value.split(",").map((s) => s.trim()).filter((s) => s)
                            const existingSubjects = data.subjects.filter((s) => SUBJECTS.includes(s))
                            updateData({ subjects: [...existingSubjects, ...otherSubjects] })
                        }}
                    />
                </div>

                {/* Hobbies */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">
                        5. What hobbies or activities do you spend the most time on outside of school?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {HOBBIES.map((hobby) => (
                            <div
                                key={hobby}
                                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <Checkbox
                                    id={`hobby-${hobby}`}
                                    checked={data.hobbies.includes(hobby)}
                                    onCheckedChange={(checked) => handleHobbyChange(hobby, checked as boolean)}
                                    className="text-purple-500 border-gray-300"
                                />
                                <Label htmlFor={`hobby-${hobby}`} className="flex-1 cursor-pointer font-medium">
                                    {hobby}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <Input
                        placeholder="Other hobbies (comma separated)"
                        className="rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                        onChange={(e) => {
                            const other = e.target.value.split(",").map((h) => h.trim()).filter((h) => h)
                            const existing = data.hobbies.filter((h) => HOBBIES.includes(h))
                            updateData({ hobbies: [...existing, ...other] })
                        }}
                    />
                </div>

                {/* Industries */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">
                        6. Are there any industries or fields you are curious about or passionate about?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {INDUSTRIES.map((industry) => (
                            <div
                                key={industry}
                                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <Checkbox
                                    id={`industry-${industry}`}
                                    checked={data.industries.includes(industry)}
                                    onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                                    className="text-purple-500 border-gray-300"
                                />
                                <Label htmlFor={`industry-${industry}`} className="flex-1 cursor-pointer font-medium">
                                    {industry}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <Input
                        placeholder="Other industries (comma separated)"
                        className="rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                        onChange={(e) => {
                            const other = e.target.value.split(",").map((i) => i.trim()).filter((i) => i)
                            const existing = data.industries.filter((i) => INDUSTRIES.includes(i))
                            updateData({ industries: [...existing, ...other] })
                        }}
                    />
                </div>

                {/* Work Types */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">
                        7. Do you prefer working with people, data, technology, or creative ideas? (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {WORK_TYPES.map((workType) => (
                            <div
                                key={workType}
                                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <Checkbox
                                    id={`workType-${workType}`}
                                    checked={data.preferredWorkType.includes(workType)}
                                    onCheckedChange={(checked) => handleWorkTypeChange(workType, checked as boolean)}
                                    className="text-purple-500 border-gray-300"
                                />
                                <Label htmlFor={`workType-${workType}`} className="flex-1 cursor-pointer font-medium">
                                    {workType}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
