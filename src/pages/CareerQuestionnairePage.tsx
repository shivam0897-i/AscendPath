"use client"

/**
 * CareerQuestionnairePage
 * 
 * Multi-step career questionnaire with form sections and results.
 * Components have been extracted to @/components/questionnaire for maintainability.
 * 
 * Original file: 1501 lines → Current file: ~200 lines
 */

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, GraduationCap, Lightbulb, Award, ArrowRight, ArrowLeft, Home } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

import {
  FormData,
  initialFormData,
  PersonalInfoForm,
  InterestsForm,
  SkillsForm,
  WorkPreferencesForm,
  GoalsForm,
  AdditionalInfoForm,
  ResultsPage,
} from "@/components/questionnaire"

const STEPS = [
  "Personal Information",
  "Interests",
  "Skills & Strengths",
  "Work Preferences",
  "Goals & Aspirations",
  "Additional Information",
  "Results",
]

/**
 * Validate each step before allowing navigation to next step
 */
function validateStep(step: number, formData: FormData): { valid: boolean; message: string } {
  switch (step) {
    case 0: // Personal Information
      if (!formData.personalInfo.educationLevel) {
        return { valid: false, message: "Please select your education level" }
      }
      if (!formData.personalInfo.ageRange) {
        return { valid: false, message: "Please select your age range" }
      }
      return { valid: true, message: "" }

    case 1: // Interests
      if (formData.interests.subjects.length === 0) {
        return { valid: false, message: "Please select at least one subject you're interested in" }
      }
      if (formData.interests.industries.length === 0) {
        return { valid: false, message: "Please select at least one industry of interest" }
      }
      return { valid: true, message: "" }

    case 2: // Skills
      if (formData.skills.topSkills.length === 0) {
        return { valid: false, message: "Please select at least one skill" }
      }
      return { valid: true, message: "" }

    case 3: // Work Preferences
      if (!formData.workPreferences.environment) {
        return { valid: false, message: "Please select your preferred work environment" }
      }
      if (!formData.workPreferences.role) {
        return { valid: false, message: "Please select your preferred role type" }
      }
      return { valid: true, message: "" }

    case 4: // Goals
      if (!formData.goals.fiveYearPlan) {
        return { valid: false, message: "Please describe your 5-year career plan" }
      }
      return { valid: true, message: "" }

    case 5: // Additional Info (optional)
      return { valid: true, message: "" }

    default:
      return { valid: true, message: "" }
  }
}

// Main Questionnaire Component
export function CareerQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const updateFormData = <K extends keyof FormData>(section: K, data: Partial<FormData[K]>) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }))
  }

  const handleNext = () => {
    // Validate current step before proceeding
    const validation = validateStep(currentStep, formData)
    if (!validation.valid) {
      toast.error(validation.message)
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    window.scrollTo(0, 0)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const handleStartOver = () => {
    setFormData(initialFormData)
    setCurrentStep(0)
    window.scrollTo(0, 0)
    toast.success("Questionnaire reset!")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoForm data={formData.personalInfo} updateData={(data) => updateFormData("personalInfo", data)} />
      case 1:
        return <InterestsForm data={formData.interests} updateData={(data) => updateFormData("interests", data)} />
      case 2:
        return <SkillsForm data={formData.skills} updateData={(data) => updateFormData("skills", data)} />
      case 3:
        return <WorkPreferencesForm data={formData.workPreferences} updateData={(data) => updateFormData("workPreferences", data)} />
      case 4:
        return <GoalsForm data={formData.goals} updateData={(data) => updateFormData("goals", data)} />
      case 5:
        return <AdditionalInfoForm data={formData.additionalInfo} updateData={(data) => updateFormData("additionalInfo", data)} />
      case 6:
        return <ResultsPage formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white dark:bg-charcoal-light shadow-warm-lg rounded-2xl overflow-hidden border border-terracotta/10 dark:border-cream/10">
      <div className="p-6 border-b border-terracotta/10 dark:border-cream/10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-heading font-semibold gradient-text">
            {STEPS[currentStep]}
          </h2>
          <span className="text-sm text-muted-foreground dark:text-cream/60 font-medium">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
        <Progress
          value={((currentStep + 1) / STEPS.length) * 100}
          className="h-2 bg-cream dark:bg-charcoal"
        />
      </div>

      <div className="p-6 sm:p-8">{renderStep()}</div>

      <div className="px-6 sm:px-8 py-5 sm:py-6 bg-cream/50 dark:bg-charcoal/50 flex justify-between items-center gap-4">
        {currentStep === 0 ? (
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2 border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream hover:bg-sage/10"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center gap-2 border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream hover:bg-sage/10"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
        )}

        {/* Results page buttons */}
        {currentStep === STEPS.length - 1 ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="flex items-center gap-2 border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream hover:bg-sage/10"
            >
              <ArrowLeft className="h-4 w-4" /> Start Over
            </Button>
            <Button
              asChild
              className="flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white shadow-warm"
            >
              <Link to="/">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white shadow-warm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Page Component with Header and Hero Section
export function CareerQuestionnairePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-charcoal">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-sage/10 dark:from-charcoal dark:via-charcoal-light dark:to-sage/5" />
          <div className="absolute top-20 right-[10%] w-64 h-64 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-[5%] w-48 h-48 bg-sage/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-charcoal dark:hover:text-cream transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                  <span className="text-charcoal dark:text-cream">Discover Your</span>
                  <br />
                  <span className="gradient-text">Ideal Career Path</span>
                </h1>
                <p className="text-lg text-muted-foreground dark:text-cream/70 max-w-md leading-relaxed">
                  A personalized assessment designed to match your interests, skills, and values with career paths that will help you thrive professionally.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="bg-terracotta hover:bg-terracotta-dark text-white px-6 py-5 rounded-xl text-base h-auto shadow-warm transition-all hover:shadow-warm-lg"
                    onClick={() => document.getElementById('questionnaire-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream hover:bg-sage/10 px-6 py-5 rounded-xl text-base h-auto"
                  >
                    <Link to="/resources">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative hidden md:block">
                <div className="absolute top-1/4 -left-6 w-16 h-16 bg-terracotta/20 rounded-full opacity-60 animate-pulse-soft"></div>
                <div className="absolute bottom-1/4 -right-6 w-24 h-24 bg-amber-300/30 rounded-full opacity-60"></div>
                <div className="absolute -bottom-6 left-1/4 w-32 h-32 bg-sage/20 rounded-full opacity-40"></div>
                <div className="relative z-10 bg-white dark:bg-charcoal-light p-6 rounded-2xl shadow-warm-lg border border-border/50 dark:border-cream/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-terracotta/10 dark:bg-terracotta/20 p-6 rounded-xl flex flex-col items-center justify-center gap-2">
                      <GraduationCap className="h-10 w-10 text-terracotta" />
                      <span className="text-sm font-medium text-charcoal dark:text-cream">Education</span>
                    </div>
                    <div className="bg-sage/10 dark:bg-sage/20 p-6 rounded-xl flex flex-col items-center justify-center gap-2">
                      <Lightbulb className="h-10 w-10 text-sage-dark dark:text-sage" />
                      <span className="text-sm font-medium text-charcoal dark:text-cream">Skills</span>
                    </div>
                    <div className="bg-amber-500/10 p-6 rounded-xl flex flex-col items-center justify-center gap-2">
                      <Award className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-charcoal dark:text-cream">Goals</span>
                    </div>
                    <div className="bg-terracotta/10 dark:bg-terracotta/20 p-6 rounded-xl flex flex-col items-center justify-center gap-2">
                      <ArrowRight className="h-10 w-10 text-terracotta" />
                      <span className="text-sm font-medium text-charcoal dark:text-cream">Career</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Questionnaire Section */}
        <section id="questionnaire-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <CareerQuestionnaire />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}