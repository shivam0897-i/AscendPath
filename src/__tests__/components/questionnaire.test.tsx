/**
 * Tests for extracted questionnaire components
 * 
 * Tests the form components extracted from CareerQuestionnairePage
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonalInfoForm } from '@/components/questionnaire/PersonalInfoForm';
import { InterestsForm } from '@/components/questionnaire/InterestsForm';
import { SkillsForm } from '@/components/questionnaire/SkillsForm';
import { AdditionalInfoForm } from '@/components/questionnaire/AdditionalInfoForm';

// Mock data for testing
const mockPersonalInfo = {
    educationLevel: '',
    ageRange: '',
    major: '',
};

const mockInterests = {
    subjects: [],
    hobbies: [],
    industries: [],
    preferredWorkType: [],
};

const mockSkills = {
    topSkills: [],
    awards: '',
    analyticalThinking: '',
    teamwork: '',
    technicalSkills: '',
};

const mockAdditionalInfo = {
    limitations: '',
    emergingTrends: '',
    otherInfo: '',
};

describe('PersonalInfoForm', () => {
    it('renders education level question', () => {
        const updateData = vi.fn();
        render(<PersonalInfoForm data={mockPersonalInfo} updateData={updateData} />);

        expect(screen.getByText(/What is your current level of education/i)).toBeInTheDocument();
    });

    it('renders age range question', () => {
        const updateData = vi.fn();
        render(<PersonalInfoForm data={mockPersonalInfo} updateData={updateData} />);

        expect(screen.getByText(/What is your age range/i)).toBeInTheDocument();
    });

    it('renders major input field', () => {
        const updateData = vi.fn();
        render(<PersonalInfoForm data={mockPersonalInfo} updateData={updateData} />);

        expect(screen.getByPlaceholderText(/Computer Science, Business/i)).toBeInTheDocument();
    });

    it('calls updateData when major is entered', () => {
        const updateData = vi.fn();
        render(<PersonalInfoForm data={mockPersonalInfo} updateData={updateData} />);

        const input = screen.getByPlaceholderText(/Computer Science, Business/i);
        fireEvent.change(input, { target: { value: 'Computer Science' } });

        expect(updateData).toHaveBeenCalledWith({ major: 'Computer Science' });
    });
});

describe('InterestsForm', () => {
    it('renders subjects question', () => {
        const updateData = vi.fn();
        render(<InterestsForm data={mockInterests} updateData={updateData} />);

        expect(screen.getByText(/Which subjects or topics do you enjoy/i)).toBeInTheDocument();
    });

    it('renders hobbies question', () => {
        const updateData = vi.fn();
        render(<InterestsForm data={mockInterests} updateData={updateData} />);

        expect(screen.getByText(/What hobbies or activities/i)).toBeInTheDocument();
    });

    it('renders industry checkboxes', () => {
        const updateData = vi.fn();
        render(<InterestsForm data={mockInterests} updateData={updateData} />);

        // Healthcare appears in both subjects and industries, use getAllBy
        const healthcareLabels = screen.getAllByLabelText(/Healthcare/i);
        expect(healthcareLabels.length).toBeGreaterThan(0);
    });

    it('renders work type preferences', () => {
        const updateData = vi.fn();
        render(<InterestsForm data={mockInterests} updateData={updateData} />);

        expect(screen.getByText(/Do you prefer working with people, data/i)).toBeInTheDocument();
    });
});

describe('SkillsForm', () => {
    it('renders skills question', () => {
        const updateData = vi.fn();
        render(<SkillsForm data={mockSkills} updateData={updateData} />);

        expect(screen.getByText(/What skills do you believe you excel at/i)).toBeInTheDocument();
    });

    it('renders awards textarea', () => {
        const updateData = vi.fn();
        render(<SkillsForm data={mockSkills} updateData={updateData} />);

        expect(screen.getByPlaceholderText(/Describe any awards/i)).toBeInTheDocument();
    });

    it('renders analytical thinking question', () => {
        const updateData = vi.fn();
        render(<SkillsForm data={mockSkills} updateData={updateData} />);

        expect(screen.getByText(/comfortable with tasks that require analytical thinking/i)).toBeInTheDocument();
    });

    it('renders teamwork rating question', () => {
        const updateData = vi.fn();
        render(<SkillsForm data={mockSkills} updateData={updateData} />);

        expect(screen.getByText(/How would you rate your ability to work in a team/i)).toBeInTheDocument();
    });

    it('calls updateData when technical skills are entered', () => {
        const updateData = vi.fn();
        render(<SkillsForm data={mockSkills} updateData={updateData} />);

        const textarea = screen.getByPlaceholderText(/List any technical skills/i);
        fireEvent.change(textarea, { target: { value: 'Python, JavaScript' } });

        expect(updateData).toHaveBeenCalledWith({ technicalSkills: 'Python, JavaScript' });
    });
});

describe('AdditionalInfoForm', () => {
    it('renders limitations question', () => {
        const updateData = vi.fn();
        render(<AdditionalInfoForm data={mockAdditionalInfo} updateData={updateData} />);

        expect(screen.getByText(/Are there any challenges or limitations/i)).toBeInTheDocument();
    });

    it('renders emerging trends question', () => {
        const updateData = vi.fn();
        render(<AdditionalInfoForm data={mockAdditionalInfo} updateData={updateData} />);

        expect(screen.getByText(/Would you like to explore careers that align with emerging trends/i)).toBeInTheDocument();
    });

    it('renders other info textarea', () => {
        const updateData = vi.fn();
        render(<AdditionalInfoForm data={mockAdditionalInfo} updateData={updateData} />);

        expect(screen.getByPlaceholderText(/Share any additional information/i)).toBeInTheDocument();
    });

    it('calls updateData when limitations are entered', () => {
        const updateData = vi.fn();
        render(<AdditionalInfoForm data={mockAdditionalInfo} updateData={updateData} />);

        const textarea = screen.getByPlaceholderText(/Describe any challenges/i);
        fireEvent.change(textarea, { target: { value: 'Remote location' } });

        expect(updateData).toHaveBeenCalledWith({ limitations: 'Remote location' });
    });
});
