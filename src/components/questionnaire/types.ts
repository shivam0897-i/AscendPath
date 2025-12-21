/**
 * Shared types for Career Questionnaire components
 * 
 * Extracted from CareerQuestionnairePage.tsx to enable component separation
 * while maintaining type safety across all form steps.
 */

// Main form data type capturing all questionnaire sections
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
export interface CareerSuggestion {
    title: string
    description: string
    matchScore: number
    educationPath: string
    skills: string[]
    category: string
}

// Component props interfaces for each form step
export interface PersonalInfoFormProps {
    data: FormData["personalInfo"]
    updateData: (data: Partial<FormData["personalInfo"]>) => void
}

export interface InterestsFormProps {
    data: FormData["interests"]
    updateData: (data: Partial<FormData["interests"]>) => void
}

export interface SkillsFormProps {
    data: FormData["skills"]
    updateData: (data: Partial<FormData["skills"]>) => void
}

export interface WorkPreferencesFormProps {
    data: FormData["workPreferences"]
    updateData: (data: Partial<FormData["workPreferences"]>) => void
}

export interface GoalsFormProps {
    data: FormData["goals"]
    updateData: (data: Partial<FormData["goals"]>) => void
}

export interface AdditionalInfoFormProps {
    data: FormData["additionalInfo"]
    updateData: (data: Partial<FormData["additionalInfo"]>) => void
}

export interface ResultsPageProps {
    formData: FormData
}

// Initial form data used to reset the questionnaire
export const initialFormData: FormData = {
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
}
