/**
 * Barrel export for questionnaire components
 * 
 * Re-exports all components and types for cleaner imports in the main page.
 */

// Types
export type {
    FormData,
    CareerSuggestion,
    PersonalInfoFormProps,
    InterestsFormProps,
    SkillsFormProps,
    WorkPreferencesFormProps,
    GoalsFormProps,
    AdditionalInfoFormProps,
    ResultsPageProps,
} from "./types"

export { initialFormData } from "./types"

// Form Components
export { PersonalInfoForm } from "./PersonalInfoForm"
export { InterestsForm } from "./InterestsForm"
export { SkillsForm } from "./SkillsForm"
export { WorkPreferencesForm } from "./WorkPreferencesForm"
export { GoalsForm } from "./GoalsForm"
export { AdditionalInfoForm } from "./AdditionalInfoForm"
export { ResultsPage } from "./ResultsPage"
