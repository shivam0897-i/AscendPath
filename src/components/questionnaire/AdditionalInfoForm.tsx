/**
 * AdditionalInfoForm - Step 6 of Career Questionnaire
 * 
 * Collects limitations, emerging trends interest, and other information.
 */
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { AdditionalInfoFormProps } from "./types"

export function AdditionalInfoForm({ data, updateData }: AdditionalInfoFormProps) {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold text-charcoal">Additional Information</h3>
                <p className="text-muted-foreground">
                    Please provide any additional information that might help us suggest the best career path for you.
                </p>
            </div>

            <div className="space-y-8">
                {/* Limitations */}
                <div className="space-y-3">
                    <Label htmlFor="limitations" className="text-base font-medium">
                        23. Are there any challenges or limitations (e.g., financial, geographic) that might influence your career choices? If yes, please explain.
                    </Label>
                    <Textarea
                        id="limitations"
                        value={data.limitations}
                        onChange={(e) => updateData({ limitations: e.target.value })}
                        placeholder="Describe any challenges or limitations that might influence your career choices"
                        className="min-h-[120px] rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                    />
                </div>

                {/* Emerging Trends */}
                <div className="space-y-3">
                    <Label htmlFor="emergingTrends" className="text-base font-medium">
                        24. Would you like to explore careers that align with emerging trends, such as artificial intelligence or sustainability?
                    </Label>
                    <RadioGroup
                        value={data.emergingTrends}
                        onValueChange={(value) => updateData({ emergingTrends: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {["Yes", "No", "Maybe"].map((option) => (
                            <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                                <RadioGroupItem value={option} id={`trends-${option.toLowerCase()}`} className="text-purple-500" />
                                <Label htmlFor={`trends-${option.toLowerCase()}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Other Info */}
                <div className="space-y-3">
                    <Label htmlFor="otherInfo" className="text-base font-medium">
                        25. Is there anything else you&apos;d like us to know about your interests, skills, or goals that could help us suggest the best career path for you?
                    </Label>
                    <Textarea
                        id="otherInfo"
                        value={data.otherInfo}
                        onChange={(e) => updateData({ otherInfo: e.target.value })}
                        placeholder="Share any additional information that might help us suggest the best career path for you"
                        className="min-h-[120px] rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
                    />
                </div>
            </div>
        </div>
    )
}
