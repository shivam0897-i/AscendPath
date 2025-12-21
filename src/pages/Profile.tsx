import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileHeader from '@/components/ProfileHeader';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useRoadmap';
import { useProfileStats } from '@/hooks/useProfileStats';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
    Loader2,
    User,
    Target,
    Settings,
    Pencil,
    Save,
    X,
    GraduationCap,
    Clock,
    Briefcase,
    BookOpen,
    Sparkles,
    Trash2,
    LogOut,
    Moon,
    Sun,
    Bell,
    CheckCircle2,
    TrendingUp,
    Award,
} from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { data: profile, isLoading: profileLoading, refetch } = useProfile();
    const { data: stats, isLoading: statsLoading } = useProfileStats();

    const [activeTab, setActiveTab] = useState('journey');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        display_name: '',
        bio: '',
        goal_role: '',
        goal_timeline: '',
        experience_level: '',
    });

    // Settings state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [themePreference, setThemePreference] = useState('system');

    // Initialize edit form when profile loads
    const startEditing = () => {
        if (profile) {
            // Cast to any to access new columns that may not be in types yet
            const p = profile as Record<string, unknown>;
            setEditForm({
                display_name: (p.display_name as string) || `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                bio: (p.bio as string) || '',
                goal_role: profile.goal_role || '',
                goal_timeline: profile.goal_timeline || '',
                experience_level: profile.experience_level || '',
            });
        }
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const saveProfile = async () => {
        if (!user?.id) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: editForm.display_name || null,
                    bio: editForm.bio || null,
                    goal_role: editForm.goal_role || null,
                    goal_timeline: editForm.goal_timeline || null,
                    experience_level: editForm.experience_level || null,
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success('Profile updated successfully!');
            setIsEditing(false);
            refetch();
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        // This would require a Supabase Edge Function to properly delete the user
        toast.error('Account deletion requires contacting support');
    };

    if (profileLoading || statsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-terracotta" />
                <p className="ml-4 text-lg text-muted-foreground font-heading">Loading profile...</p>
            </div>
        );
    }

    if (!profile || !stats) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-heading font-bold mb-2">Profile Not Found</h2>
                    <p className="text-muted-foreground mb-6">Please complete onboarding first.</p>
                    <Button onClick={() => navigate('/onboarding')} className="bg-terracotta hover:bg-terracotta-dark">
                        Go to Onboarding
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream/50 to-white dark:from-charcoal dark:to-charcoal/90">
            <Navbar />

            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Profile Header */}
                <ProfileHeader profile={profile} stats={stats} />

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                    <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-cream/50 dark:bg-charcoal/50">
                        <TabsTrigger value="journey" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
                            <Target className="h-4 w-4 mr-2" />
                            Journey
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Progress
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Journey Tab */}
                    <TabsContent value="journey" className="mt-6 animate-fade-in">
                        <Card className="shadow-warm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="font-heading flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-terracotta" />
                                        Your Career Journey
                                    </CardTitle>
                                    <CardDescription>Your learning path and career aspirations</CardDescription>
                                </div>
                                {!isEditing ? (
                                    <Button variant="outline" size="sm" onClick={startEditing}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={saveProfile} disabled={isSaving} className="bg-terracotta hover:bg-terracotta-dark">
                                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isEditing ? (
                                    // Edit mode
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="display_name">Display Name</Label>
                                            <Input
                                                id="display_name"
                                                value={editForm.display_name}
                                                onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                                                placeholder="Your display name"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                placeholder="Tell us about yourself..."
                                                rows={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="goal_role">Goal Role</Label>
                                            <Input
                                                id="goal_role"
                                                value={editForm.goal_role}
                                                onChange={(e) => setEditForm({ ...editForm, goal_role: e.target.value })}
                                                placeholder="e.g., Data Scientist, Full Stack Developer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="goal_timeline">Timeline</Label>
                                            <Input
                                                id="goal_timeline"
                                                value={editForm.goal_timeline}
                                                onChange={(e) => setEditForm({ ...editForm, goal_timeline: e.target.value })}
                                                placeholder="e.g., 6 months, 1 year"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="experience_level">Experience Level</Label>
                                            <Input
                                                id="experience_level"
                                                value={editForm.experience_level}
                                                onChange={(e) => setEditForm({ ...editForm, experience_level: e.target.value })}
                                                placeholder="e.g., Beginner, Intermediate"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // View mode
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-terracotta-light/30 to-cream dark:from-terracotta/10 dark:to-charcoal/50">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Target className="h-4 w-4" />
                                                Goal Role
                                            </div>
                                            <p className="font-medium text-charcoal dark:text-cream">
                                                {profile.goal_role || 'Not set'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-sage-light/30 to-cream dark:from-sage/10 dark:to-charcoal/50">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Clock className="h-4 w-4" />
                                                Timeline
                                            </div>
                                            <p className="font-medium text-charcoal dark:text-cream">
                                                {profile.goal_timeline || profile.time_available || 'Not set'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100/50 to-cream dark:from-amber-500/10 dark:to-charcoal/50">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Briefcase className="h-4 w-4" />
                                                Experience
                                            </div>
                                            <p className="font-medium text-charcoal dark:text-cream capitalize">
                                                {profile.experience_level || 'Not set'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100/50 to-cream dark:from-purple-500/10 dark:to-charcoal/50">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <BookOpen className="h-4 w-4" />
                                                Learning Style
                                            </div>
                                            <p className="font-medium text-charcoal dark:text-cream capitalize">
                                                {profile.learning_style || 'Not set'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100/50 to-cream dark:from-blue-500/10 dark:to-charcoal/50">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Sparkles className="h-4 w-4" />
                                                Primary Field
                                            </div>
                                            <p className="font-medium text-charcoal dark:text-cream capitalize">
                                                {profile.primary_field || profile.background || 'Not set'}
                                            </p>
                                        </div>
                                        {profile.skills && profile.skills.length > 0 && (
                                            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-100/50 to-cream dark:from-pink-500/10 dark:to-charcoal/50">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <Award className="h-4 w-4" />
                                                    Skills
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {profile.skills.slice(0, 5).map((skill: string) => (
                                                        <Badge key={skill} variant="secondary" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {profile.skills.length > 5 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{profile.skills.length - 5} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Separator />

                                <div className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/onboarding')}
                                        className="border-terracotta/30 hover:border-terracotta hover:text-terracotta"
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Retake Career Assessment
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Progress Tab */}
                    <TabsContent value="progress" className="mt-6 animate-fade-in">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Overall Progress */}
                            <Card className="shadow-warm">
                                <CardHeader>
                                    <CardTitle className="font-heading flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-sage" />
                                        Overall Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-center">
                                        <div className="relative">
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="currentColor"
                                                    strokeWidth="12"
                                                    fill="none"
                                                    className="text-cream dark:text-charcoal"
                                                />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="url(#progressGradient)"
                                                    strokeWidth="12"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(stats.overallProgress / 100) * 352} 352`}
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                                <defs>
                                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#C16E4B" />
                                                        <stop offset="100%" stopColor="#7C9082" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-3xl font-bold font-heading text-charcoal dark:text-cream">
                                                    {stats.overallProgress}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center text-muted-foreground">
                                        {stats.completedMilestones} of {stats.totalMilestones} milestones completed
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Achievements */}
                            <Card className="shadow-warm">
                                <CardHeader>
                                    <CardTitle className="font-heading flex items-center gap-2">
                                        <Award className="h-5 w-5 text-amber-500" />
                                        Achievements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-sage-light/30 to-cream dark:from-sage/10 dark:to-charcoal/50">
                                            <CheckCircle2 className="h-8 w-8 mx-auto text-sage mb-2" />
                                            <div className="text-2xl font-bold font-heading">{stats.completedMilestones}</div>
                                            <div className="text-xs text-muted-foreground">Steps Completed</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-100/50 to-cream dark:from-purple-500/10 dark:to-charcoal/50">
                                            <BookOpen className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                                            <div className="text-2xl font-bold font-heading">{stats.totalResources}</div>
                                            <div className="text-xs text-muted-foreground">Resources</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-terracotta-light/30 to-cream dark:from-terracotta/10 dark:to-charcoal/50">
                                            <GraduationCap className="h-8 w-8 mx-auto text-terracotta mb-2" />
                                            <div className="text-2xl font-bold font-heading">{stats.completedRoadmaps}</div>
                                            <div className="text-xs text-muted-foreground">Roadmaps Done</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-100/50 to-cream dark:from-amber-500/10 dark:to-charcoal/50">
                                            <Target className="h-8 w-8 mx-auto text-amber-600 mb-2" />
                                            <div className="text-2xl font-bold font-heading">{stats.savedRoadmaps}</div>
                                            <div className="text-xs text-muted-foreground">Active Goals</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-6 animate-fade-in">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Preferences */}
                            <Card className="shadow-warm">
                                <CardHeader>
                                    <CardTitle className="font-heading flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-muted-foreground" />
                                        Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Bell className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Receive learning reminders</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={emailNotifications}
                                            onCheckedChange={setEmailNotifications}
                                        />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {themePreference === 'dark' ? (
                                                <Moon className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                <Sun className="h-5 w-5 text-muted-foreground" />
                                            )}
                                            <div>
                                                <p className="font-medium">Theme</p>
                                                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {['light', 'dark', 'system'].map((theme) => (
                                                <Button
                                                    key={theme}
                                                    variant={themePreference === theme ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setThemePreference(theme)}
                                                    className={themePreference === theme ? 'bg-terracotta hover:bg-terracotta-dark' : ''}
                                                >
                                                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account */}
                            <Card className="shadow-warm">
                                <CardHeader>
                                    <CardTitle className="font-heading flex items-center gap-2">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        Account
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-xl bg-cream/50 dark:bg-charcoal/50">
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{profile.email}</p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="w-full">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Delete Account
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            <Footer />
        </div>
    );
}
