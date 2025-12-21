/**
 * PersonalInfoForm - Step 1 of Career Questionnaire
 * 
 * Collects education level, age range, and academic major.
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { PersonalInfoFormProps } from "./types"

export function PersonalInfoForm({ data, updateData }: PersonalInfoFormProps) {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold text-charcoal">Personal Information</h3>
                <p className="text-muted-foreground">Let&apos;s start with some basic information about your educational background.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="educationLevel" className="text-base font-medium">
                        1. What is your current level of education?
                    </Label>
                    <RadioGroup
                        value={data.educationLevel}
                        onValueChange={(value) => updateData({ educationLevel: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="High School" id="high-school" className="text-terracotta" />
                            <Label htmlFor="high-school" className="flex-1 cursor-pointer font-medium">
                                High School
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="Undergraduate" id="undergraduate" className="text-terracotta" />
                            <Label htmlFor="undergraduate" className="flex-1 cursor-pointer font-medium">
                                Undergraduate
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="Graduate" id="graduate" className="text-terracotta" />
                            <Label htmlFor="graduate" className="flex-1 cursor-pointer font-medium">
                                Graduate
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="Other" id="other-education" className="text-terracotta" />
                            <Label htmlFor="other-education" className="flex-1 cursor-pointer font-medium">
                                Other
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="ageRange" className="text-base font-medium">
                        2. What is your age range?
                    </Label>
                    <RadioGroup
                        value={data.ageRange}
                        onValueChange={(value) => updateData({ ageRange: value })}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="15-18" id="age-15-18" className="text-terracotta" />
                            <Label htmlFor="age-15-18" className="flex-1 cursor-pointer font-medium">
                                15-18
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="19-22" id="age-19-22" className="text-terracotta" />
                            <Label htmlFor="age-19-22" className="flex-1 cursor-pointer font-medium">
                                19-22
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="23-25" id="age-23-25" className="text-terracotta" />
                            <Label htmlFor="age-23-25" className="flex-1 cursor-pointer font-medium">
                                23-25
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-terracotta/20 p-4 hover:bg-cream transition-colors">
                            <RadioGroupItem value="25+" id="age-25-plus" className="text-terracotta" />
                            <Label htmlFor="age-25-plus" className="flex-1 cursor-pointer font-medium">
                                25+
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="major" className="text-base font-medium">
                        3. Do you have any specific academic major or focus of study? If yes, please specify.
                    </Label>
                    <Input
                        id="major"
                        value={data.major}
                        onChange={(e) => updateData({ major: e.target.value })}
                        placeholder="E.g., Computer Science, Business, Psychology, etc."
                        className="rounded-lg border-terracotta/20 p-3 focus:border-terracotta focus:ring-terracotta"
                    />
                </div>
            </div>
        </div>
    )
}
