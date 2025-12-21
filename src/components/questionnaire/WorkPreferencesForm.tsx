/**
 * WorkPreferencesForm - Step 4 of Career Questionnaire
 * 
 * Collects work environment, work-life balance, travel preferences, and motivation.
 */
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { WorkPreferencesFormProps } from "./types"

const ENVIRONMENTS = ["Office", "Remote", "Outdoor", "Flexible", "Lab/Studio"]
const MOTIVATIONS = ["Salary", "Impact", "Creativity", "Stability", "Recognition", "Learning", "Autonomy", "Challenge"]

export function WorkPreferencesForm({ data, updateData }: WorkPreferencesFormProps) {
    const handleMotivationChange = (motivation: string, checked: boolean) => {
        if (checked) {
            updateData({ motivation: [...data.motivation, motivation] })
        } else {
            updateData({ motivation: data.motivation.filter((m) => m !== motivation) })
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold text-charcoal">Work Preferences and Values</h3>
                <p className="text-muted-foreground">Let&apos;s understand what you value in a work environment.</p>
            </div>

            <div className="space-y-8">
                {/* Environment */}
                <div className="space-y-3">
                    <Label htmlFor="environment" className="text-base font-medium">
                        13. What type of work environment do you prefer?
                    </Label>
                    <RadioGroup
                        value={data.environment}
                        onValueChange={(value) => updateData({ environment: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {ENVIRONMENTS.map((env) => (
                            <div key={env} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={env} id={`env-${env}`} className="text-purple-500" />
                                <Label htmlFor={`env-${env}`} className="flex-1 cursor-pointer font-medium">{env}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Work-Life Balance */}
                <div className="space-y-3">
                    <Label htmlFor="workLifeBalance" className="text-base font-medium">
                        14. How important is work-life balance to you?
                    </Label>
                    <RadioGroup
                        value={data.workLifeBalance}
                        onValueChange={(value) => updateData({ workLifeBalance: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {["Very Important", "Somewhat Important", "Not Important"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`balance-${option.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-500" />
                                <Label htmlFor={`balance-${option.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Travel */}
                <div className="space-y-3">
                    <Label htmlFor="travel" className="text-base font-medium">
                        15. Would you prefer a career that involves frequent travel or one that is location-based?
                    </Label>
                    <RadioGroup
                        value={data.travel}
                        onValueChange={(value) => updateData({ travel: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {["Travel", "Location-based", "No Preference"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`travel-${option.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-500" />
                                <Label htmlFor={`travel-${option.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Motivation */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">16. What motivates you the most in a career?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {MOTIVATIONS.map((motivation) => (
                            <div key={motivation} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <Checkbox
                                    id={`motivation-${motivation}`}
                                    checked={data.motivation.includes(motivation)}
                                    onCheckedChange={(checked) => handleMotivationChange(motivation, checked as boolean)}
                                    className="text-purple-500 border-gray-300"
                                />
                                <Label htmlFor={`motivation-${motivation}`} className="flex-1 cursor-pointer font-medium">{motivation}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role */}
                <div className="space-y-3">
                    <Label htmlFor="role" className="text-base font-medium">
                        17. Are you interested in leadership roles or prefer contributing as an individual?
                    </Label>
                    <RadioGroup
                        value={data.role}
                        onValueChange={(value) => updateData({ role: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {["Leadership", "Individual", "Both"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`role-${option.toLowerCase()}`} className="text-purple-500" />
                                <Label htmlFor={`role-${option.toLowerCase()}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>
        </div>
    )
}
