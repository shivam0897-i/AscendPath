"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, GraduationCap, Lightbulb, Award, Download, Share2, ArrowRight } from 'lucide-react'

// Main form data type
export type FormData = {
  personalInfo: {
    educationLevel: string
    ageRange: string
    major: string
  }
  interests: {
    subjects: string[]
    hobbies: string[]
    industries: string[]
    preferredWorkType: string[]
  }
  skills: {
    topSkills: string[]
    awards: string
    analyticalThinking: string
    teamwork: string
    technicalSkills: string
  }
  workPreferences: {
    environment: string
    workLifeBalance: string
    travel: string
    motivation: string[]
    role: string
  }
  goals: {
    fiveYearPlan: string
    consideringCareers: string[]
    salaryConcern: string
    furtherEducation: string
    roleModels: string
  }
  additionalInfo: {
    limitations: string
    emergingTrends: string
    otherInfo: string
  }
}

// Career suggestion type for results
interface CareerSuggestion {
  title: string
  description: string
  matchScore: number
  educationPath: string
  skills: string[]
  category: string
}

// Component props interfaces
interface PersonalInfoFormProps {
  data: FormData["personalInfo"]
  updateData: (data: Partial<FormData["personalInfo"]>) => void
}

interface InterestsFormProps {
  data: FormData["interests"]
  updateData: (data: Partial<FormData["interests"]>) => void
}

interface SkillsFormProps {
  data: FormData["skills"]
  updateData: (data: Partial<FormData["skills"]>) => void
}

interface WorkPreferencesFormProps {
  data: FormData["workPreferences"]
  updateData: (data: Partial<FormData["workPreferences"]>) => void
}

interface GoalsFormProps {
  data: FormData["goals"]
  updateData: (data: Partial<FormData["goals"]>) => void
}

interface AdditionalInfoFormProps {
  data: FormData["additionalInfo"]
  updateData: (data: Partial<FormData["additionalInfo"]>) => void
}

interface ResultsPageProps {
  formData: FormData
}

// Personal Information Form Component
function PersonalInfoForm({ data, updateData }: PersonalInfoFormProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
        <p className="text-gray-600">Let&apos;s start with some basic information about your educational background.</p>
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
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="High School" id="high-school" className="text-purple-500" />
              <Label htmlFor="high-school" className="flex-1 cursor-pointer font-medium">
                High School
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Undergraduate" id="undergraduate" className="text-purple-500" />
              <Label htmlFor="undergraduate" className="flex-1 cursor-pointer font-medium">
                Undergraduate
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Graduate" id="graduate" className="text-purple-500" />
              <Label htmlFor="graduate" className="flex-1 cursor-pointer font-medium">
                Graduate
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Other" id="other-education" className="text-purple-500" />
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
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="15-18" id="age-15-18" className="text-purple-500" />
              <Label htmlFor="age-15-18" className="flex-1 cursor-pointer font-medium">
                15-18
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="19-22" id="age-19-22" className="text-purple-500" />
              <Label htmlFor="age-19-22" className="flex-1 cursor-pointer font-medium">
                19-22
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="23-25" id="age-23-25" className="text-purple-500" />
              <Label htmlFor="age-23-25" className="flex-1 cursor-pointer font-medium">
                23-25
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="25+" id="age-25-plus" className="text-purple-500" />
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
            className="rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
          />
        </div>
      </div>
    </div>
  )
}

// Interests Form Component
function InterestsForm({ data, updateData }: InterestsFormProps) {
  const subjects = [
    "Science",
    "Technology",
    "Engineering",
    "Mathematics",
    "Arts",
    "Humanities",
    "Social Sciences",
    "Business",
    "Health Sciences",
  ]

  const hobbies = [
    "Sports",
    "Music",
    "Reading",
    "Writing",
    "Coding",
    "Gaming",
    "Art/Drawing",
    "Cooking",
    "Travel",
    "Photography",
  ]

  const industries = [
    "Healthcare",
    "Technology",
    "Finance",
    "Education",
    "Entertainment",
    "Environment",
    "Manufacturing",
    "Retail",
    "Government",
    "Non-profit",
  ]

  const workTypes = ["People", "Data", "Technology", "Creative Ideas", "Physical Objects", "Nature"]

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
        <h3 className="text-xl font-semibold text-gray-800">Interests</h3>
        <p className="text-gray-600">Tell us about what interests you the most.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-medium">
            4. Which subjects or topics do you enjoy learning about the most?
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {subjects.map((subject) => (
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
              const otherSubjects = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
              const existingSubjects = data.subjects.filter((s) => subjects.includes(s))
              updateData({ subjects: [...existingSubjects, ...otherSubjects] })
            }}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">
            5. What hobbies or activities do you spend the most time on outside of school?
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {hobbies.map((hobby) => (
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
              const otherHobbies = e.target.value
                .split(",")
                .map((h) => h.trim())
                .filter((h) => h)
              const existingHobbies = data.hobbies.filter((h) => hobbies.includes(h))
              updateData({ hobbies: [...existingHobbies, ...otherHobbies] })
            }}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">
            6. Are there any industries or fields you are curious about or passionate about?
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {industries.map((industry) => (
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
              const otherIndustries = e.target.value
                .split(",")
                .map((i) => i.trim())
                .filter((i) => i)
              const existingIndustries = data.industries.filter((i) => industries.includes(i))
              updateData({
                industries: [...existingIndustries, ...otherIndustries],
              })
            }}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">
            7. Do you prefer working with people, data, technology, or creative ideas? (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {workTypes.map((workType) => (
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

// Skills Form Component
function SkillsForm({ data, updateData }: SkillsFormProps) {
  const skills = [
    "Problem-solving",
    "Communication",
    "Leadership",
    "Creativity",
    "Critical thinking",
    "Time management",
    "Organization",
    "Adaptability",
    "Teamwork",
    "Technical skills",
    "Writing",
    "Public speaking",
    "Research",
    "Analysis",
    "Attention to detail",
  ]

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
        <h3 className="text-xl font-semibold text-gray-800">Skills and Strengths</h3>
        <p className="text-gray-600">Let&apos;s identify your key skills and strengths.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-medium">8. What skills do you believe you excel at?</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {skills.map((skill) => (
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
              const otherSkills = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
              const existingSkills = data.topSkills.filter((s) => skills.includes(s))
              updateData({ topSkills: [...existingSkills, ...otherSkills] })
            }}
          />
        </div>

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

        <div className="space-y-3">
          <Label htmlFor="analyticalThinking" className="text-base font-medium">
            10. Are you comfortable with tasks that require analytical thinking, such as math or data analysis?
          </Label>
          <RadioGroup
            value={data.analyticalThinking}
            onValueChange={(value) => updateData({ analyticalThinking: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Yes" id="analytical-yes" className="text-purple-500" />
              <Label htmlFor="analytical-yes" className="flex-1 cursor-pointer font-medium">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Somewhat" id="analytical-somewhat" className="text-purple-500" />
              <Label htmlFor="analytical-somewhat" className="flex-1 cursor-pointer font-medium">
                Somewhat
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="No" id="analytical-no" className="text-purple-500" />
              <Label htmlFor="analytical-no" className="flex-1 cursor-pointer font-medium">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="teamwork" className="text-base font-medium">
            11. How would you rate your ability to work in a team?
          </Label>
          <RadioGroup
            value={data.teamwork}
            onValueChange={(value) => updateData({ teamwork: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-4"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Excellent" id="teamwork-excellent" className="text-purple-500" />
              <Label htmlFor="teamwork-excellent" className="flex-1 cursor-pointer font-medium">
                Excellent
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Good" id="teamwork-good" className="text-purple-500" />
              <Label htmlFor="teamwork-good" className="flex-1 cursor-pointer font-medium">
                Good
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Fair" id="teamwork-fair" className="text-purple-500" />
              <Label htmlFor="teamwork-fair" className="flex-1 cursor-pointer font-medium">
                Fair
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Needs Improvement" id="teamwork-needs-improvement" className="text-purple-500" />
              <Label htmlFor="teamwork-needs-improvement" className="flex-1 cursor-pointer font-medium">
                Needs Improvement
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="technicalSkills" className="text-base font-medium">
            12. Do you have any technical skills, such as programming, graphic design, or video editing? If yes, please
            list them.
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

// Work Preferences Form Component
function WorkPreferencesForm({ data, updateData }: WorkPreferencesFormProps) {
  const environments = ["Office", "Remote", "Outdoor", "Flexible", "Lab/Studio"]
  const motivations = [
    "Salary",
    "Impact",
    "Creativity",
    "Stability",
    "Recognition",
    "Learning",
    "Autonomy",
    "Challenge",
  ]

  const handleMotivationChange = (motivation: string, checked: boolean) => {
    if (checked) {
      updateData({ motivation: [...data.motivation, motivation] })
    } else {
      updateData({
        motivation: data.motivation.filter((m) => m !== motivation),
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Work Preferences and Values</h3>
        <p className="text-gray-600">Let&apos;s understand what you value in a work environment.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="environment" className="text-base font-medium">
            13. What type of work environment do you prefer?
          </Label>
          <RadioGroup
            value={data.environment}
            onValueChange={(value) => updateData({ environment: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {environments.map((env) => (
              <div
                key={env}
                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem value={env} id={`env-${env}`} className="text-purple-500" />
                <Label htmlFor={`env-${env}`} className="flex-1 cursor-pointer font-medium">
                  {env}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="workLifeBalance" className="text-base font-medium">
            14. How important is work-life balance to you?
          </Label>
          <RadioGroup
            value={data.workLifeBalance}
            onValueChange={(value) => updateData({ workLifeBalance: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Very Important" id="balance-very" className="text-purple-500" />
              <Label htmlFor="balance-very" className="flex-1 cursor-pointer font-medium">
                Very Important
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Somewhat Important" id="balance-somewhat" className="text-purple-500" />
              <Label htmlFor="balance-somewhat" className="flex-1 cursor-pointer font-medium">
                Somewhat Important
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Not Important" id="balance-not" className="text-purple-500" />
              <Label htmlFor="balance-not" className="flex-1 cursor-pointer font-medium">
                Not Important
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="travel" className="text-base font-medium">
            15. Would you prefer a career that involves frequent travel or one that is location-based?
          </Label>
          <RadioGroup
            value={data.travel}
            onValueChange={(value) => updateData({ travel: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Travel" id="travel-yes" className="text-purple-500" />
              <Label htmlFor="travel-yes" className="flex-1 cursor-pointer font-medium">
                Travel
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Location-based" id="travel-no" className="text-purple-500" />
              <Label htmlFor="travel-no" className="flex-1 cursor-pointer font-medium">
                Location-based
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="No Preference" id="travel-neutral" className="text-purple-500" />
              <Label htmlFor="travel-neutral" className="flex-1 cursor-pointer font-medium">
                No Preference
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">16. What motivates you the most in a career?</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {motivations.map((motivation) => (
              <div
                key={motivation}
                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={`motivation-${motivation}`}
                  checked={data.motivation.includes(motivation)}
                  onCheckedChange={(checked) => handleMotivationChange(motivation, checked as boolean)}
                  className="text-purple-500 border-gray-300"
                />
                <Label htmlFor={`motivation-${motivation}`} className="flex-1 cursor-pointer font-medium">
                  {motivation}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="role" className="text-base font-medium">
            17. Are you interested in leadership roles or prefer contributing as an individual?
          </Label>
          <RadioGroup
            value={data.role}
            onValueChange={(value) => updateData({ role: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Leadership" id="role-leadership" className="text-purple-500" />
              <Label htmlFor="role-leadership" className="flex-1 cursor-pointer font-medium">
                Leadership
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Individual" id="role-individual" className="text-purple-500" />
              <Label htmlFor="role-individual" className="flex-1 cursor-pointer font-medium">
                Individual
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Both" id="role-both" className="text-purple-500" />
              <Label htmlFor="role-both" className="flex-1 cursor-pointer font-medium">
                Both
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

// Goals Form Component
function GoalsForm({ data, updateData }: GoalsFormProps) {
  const careers = [
    "Software Developer",
    "Data Scientist",
    "Doctor/Physician",
    "Teacher/Professor",
    "Business Manager",
    "Engineer",
    "Designer",
    "Researcher",
    "Marketing Specialist",
    "Financial Analyst",
    "Healthcare Professional",
    "Artist/Creative",
  ]

  const handleCareerChange = (career: string, checked: boolean) => {
    if (checked) {
      updateData({ consideringCareers: [...data.consideringCareers, career] })
    } else {
      updateData({
        consideringCareers: data.consideringCareers.filter((c) => c !== career),
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Goals and Aspirations</h3>
        <p className="text-gray-600">Let&apos;s understand your career goals and aspirations.</p>
      </div>

      <div className="space-y-8">
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

        <div className="space-y-4">
          <Label className="text-base font-medium">
            19. Are there any specific careers or roles you are currently considering?
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {careers.map((career) => (
              <div
                key={career}
                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={`career-${career}`}
                  checked={data.consideringCareers.includes(career)}
                  onCheckedChange={(checked) => handleCareerChange(career, checked as boolean)}
                  className="text-purple-500 border-gray-300"
                />
                <Label htmlFor={`career-${career}`} className="flex-1 cursor-pointer font-medium">
                  {career}
                </Label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other careers (comma separated)"
            className="rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
            onChange={(e) => {
              const otherCareers = e.target.value
                .split(",")
                .map((c) => c.trim())
                .filter((c) => c)
              const existingCareers = data.consideringCareers.filter((c) => careers.includes(c))
              updateData({
                consideringCareers: [...existingCareers, ...otherCareers],
              })
            }}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="salaryConcern" className="text-base font-medium">
            20. How important is earning a high salary to you?
          </Label>
          <RadioGroup
            value={data.salaryConcern}
            onValueChange={(value) => updateData({ salaryConcern: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Very Important" id="salary-very" className="text-purple-500" />
              <Label htmlFor="salary-very" className="flex-1 cursor-pointer font-medium">
                Very Important
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Somewhat Important" id="salary-somewhat" className="text-purple-500" />
              <Label htmlFor="salary-somewhat" className="flex-1 cursor-pointer font-medium">
                Somewhat Important
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Not Important" id="salary-not" className="text-purple-500" />
              <Label htmlFor="salary-not" className="flex-1 cursor-pointer font-medium">
                Not Important
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="furtherEducation" className="text-base font-medium">
            21. Are you interested in pursuing further education or certifications to achieve your career goals?
          </Label>
          <RadioGroup
            value={data.furtherEducation}
            onValueChange={(value) => updateData({ furtherEducation: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Yes" id="education-yes" className="text-purple-500" />
              <Label htmlFor="education-yes" className="flex-1 cursor-pointer font-medium">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="No" id="education-no" className="text-purple-500" />
              <Label htmlFor="education-no" className="flex-1 cursor-pointer font-medium">
                No
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Maybe" id="education-maybe" className="text-purple-500" />
              <Label htmlFor="education-maybe" className="flex-1 cursor-pointer font-medium">
                Maybe
              </Label>
            </div>
          </RadioGroup>
        </div>

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

// Additional Info Form Component
function AdditionalInfoForm({ data, updateData }: AdditionalInfoFormProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
        <p className="text-gray-600">
          Please provide any additional information that might help us suggest the best career path for you.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="limitations" className="text-base font-medium">
            23. Are there any challenges or limitations (e.g., financial, geographic) that might influence your career
            choices? If yes, please explain.
          </Label>
          <Textarea
            id="limitations"
            value={data.limitations}
            onChange={(e) => updateData({ limitations: e.target.value })}
            placeholder="Describe any challenges or limitations that might influence your career choices"
            className="min-h-[120px] rounded-lg border-gray-200 p-3 focus:border-purple-300 focus:ring-purple-300"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="emergingTrends" className="text-base font-medium">
            24. Would you like to explore careers that align with emerging trends, such as artificial intelligence or
            sustainability?
          </Label>
          <RadioGroup
            value={data.emergingTrends}
            onValueChange={(value) => updateData({ emergingTrends: value })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Yes" id="trends-yes" className="text-purple-500" />
              <Label htmlFor="trends-yes" className="flex-1 cursor-pointer font-medium">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="No" id="trends-no" className="text-purple-500" />
              <Label htmlFor="trends-no" className="flex-1 cursor-pointer font-medium">
                No
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Maybe" id="trends-maybe" className="text-purple-500" />
              <Label htmlFor="trends-maybe" className="flex-1 cursor-pointer font-medium">
                Maybe
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="otherInfo" className="text-base font-medium">
            25. Is there anything else you&apos;d like us to know about your interests, skills, or goals that could help
            us suggest the best career path for you?
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

// Results Page Component
function ResultsPage({ formData }: ResultsPageProps) {
  const [careerSuggestions, setCareerSuggestions] = useState<CareerSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to generate career suggestions
    setTimeout(() => {
      const suggestions = generateCareerSuggestions(formData)
      setCareerSuggestions(suggestions)
      setIsLoading(false)
    }, 1500)
  }, [formData])

  const generateCareerSuggestions = (data: FormData): CareerSuggestion[] => {
    // This is a simplified algorithm to generate career suggestions
    // In a real application, this would be much more sophisticated

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

    // Creative careers
    if (
      data.interests.subjects.includes("Arts") ||
      data.interests.hobbies.some((h) => ["Art/Drawing", "Music", "Writing"].includes(h))
    ) {
      suggestions.push({
        title: "Graphic Designer",
        description: "Create visual concepts to communicate ideas that inspire and inform consumers.",
        matchScore: 82,
        educationPath: "Graphic Design or Fine Arts degree",
        skills: ["Creativity", "Visual communication", "Technical design skills"],
        category: "Creative",
      })
    }

    // Education careers
    if (data.interests.preferredWorkType.includes("People") || data.interests.industries.includes("Education")) {
      suggestions.push({
        title: "Teacher/Professor",
        description: "Educate students in various subjects and help them develop knowledge and skills.",
        matchScore: 80,
        educationPath: "Education degree or subject-specific degree with teaching certification",
        skills: ["Communication", "Patience", "Subject expertise"],
        category: "Education",
      })
    }

    // Add more generic suggestions if we don't have enough
    if (suggestions.length < 3) {
      suggestions.push({
        title: "Marketing Specialist",
        description: "Develop and implement marketing strategies to promote products or services.",
        matchScore: 75,
        educationPath: "Marketing, Communications, or Business degree",
        skills: ["Creativity", "Communication", "Strategic thinking"],
        category: "Business",
      })

      suggestions.push({
        title: "Research Scientist",
        description: "Conduct research to expand knowledge in a particular field.",
        matchScore: 70,
        educationPath: "Advanced degree in a scientific field",
        skills: ["Analytical thinking", "Attention to detail", "Research methodology"],
        category: "Science",
      })
    }

    // Sort by match score
    return suggestions.sort((a, b) => b.matchScore - a.matchScore)
  }

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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-6"></div>
        <p className="text-lg font-medium text-gray-700">
          Analyzing your responses and generating career suggestions...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Your Career Suggestions
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your responses, we&apos;ve identified the following career paths that may be a good fit for you.
          Explore these options to find your ideal career path.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careerSuggestions.map((career, index) => (
          <Card key={index} className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-gray-800">{career.title}</CardTitle>
                <Badge variant="outline" className="bg-white font-medium">
                  {career.matchScore}% Match
                </Badge>
              </div>
              <CardDescription className="text-gray-600">{career.category}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <p className="text-gray-700">{career.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Education Path:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{career.educationPath}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Key Skills:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {career.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200"
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

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl space-y-6">
        <div className="flex items-start gap-4">
          <Lightbulb className="h-8 w-8 text-purple-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-xl text-gray-800">Next Steps</h4>
            <p className="text-gray-600 mt-2">
              Consider researching these career paths further, speaking with professionals in these fields, or exploring
              educational opportunities that align with these suggestions. EmpowerPath offers resources to help you
              connect with mentors and educational programs in your areas of interest.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button
            onClick={handleDownloadResults}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2.5 h-auto rounded-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Your Results
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 h-auto rounded-lg"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main Questionnaire Component
export function CareerQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      educationLevel: "",
      ageRange: "",
      major: "",
    },
    interests: {
      subjects: [],
      hobbies: [],
      industries: [],
      preferredWorkType: [],
    },
    skills: {
      topSkills: [],
      awards: "",
      analyticalThinking: "",
      teamwork: "",
      technicalSkills: "",
    },
    workPreferences: {
      environment: "",
      workLifeBalance: "",
      travel: "",
      motivation: [],
      role: "",
    },
    goals: {
      fiveYearPlan: "",
      consideringCareers: [],
      salaryConcern: "",
      furtherEducation: "",
      roleModels: "",
    },
    additionalInfo: {
      limitations: "",
      emergingTrends: "",
      otherInfo: "",
    },
  })

  const steps = [
    "Personal Information",
    "Interests",
    "Skills & Strengths",
    "Work Preferences",
    "Goals & Aspirations",
    "Additional Information",
    "Results",
  ]

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    window.scrollTo(0, 0)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm data={formData.personalInfo} updateData={(data) => updateFormData("personalInfo", data)} />
        )
      case 1:
        return <InterestsForm data={formData.interests} updateData={(data) => updateFormData("interests", data)} />
      case 2:
        return <SkillsForm data={formData.skills} updateData={(data) => updateFormData("skills", data)} />
      case 3:
        return (
          <WorkPreferencesForm
            data={formData.workPreferences}
            updateData={(data) => updateFormData("workPreferences", data)}
          />
        )
      case 4:
        return <GoalsForm data={formData.goals} updateData={(data) => updateFormData("goals", data)} />
      case 5:
        return (
          <AdditionalInfoForm
            data={formData.additionalInfo}
            updateData={(data) => updateFormData("additionalInfo", data)}
          />
        )
      case 6:
        return <ResultsPage formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            {steps[currentStep]}
          </h2>
          <span className="text-sm text-gray-500 font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress
          value={((currentStep + 1) / steps.length) * 100}
          className="h-2 bg-gray-100"
        />
      </div>

      <div className="p-8">{renderStep()}</div>

      <div className="px-8 py-6 bg-gray-50 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2 border-gray-300 text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

// Optional: Page Component with Header and Hero Section
export function CareerQuestionnairePage() {
  return (
    <div className="min-h-screen bg-[#f9f8ff]">
      {/* Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            EmpowerPath
          </h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-purple-500 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-500 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-500 transition-colors">
              Resources
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-500 transition-colors">
              Community
            </a>
          </nav>
          <button className="p-2 rounded-full hover:bg-gray-100">
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
              className="text-gray-700"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              <span className="text-gray-900">Discover Your</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Ideal Career Path
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              A personalized assessment designed to match your interests, skills, and values with career paths that will
              help you thrive professionally.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-6 rounded-lg text-lg h-auto">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 rounded-lg text-lg h-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute top-1/4 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-60"></div>
            <div className="absolute bottom-1/4 -right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-60"></div>
            <div className="absolute -bottom-10 left-1/4 w-40 h-40 bg-blue-200 rounded-full opacity-40"></div>
            <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Career Assessment"
                className="rounded-xl mx-auto"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Questionnaire Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <CareerQuestionnaire />
        </div>
      </section>
    </div>
  )
}