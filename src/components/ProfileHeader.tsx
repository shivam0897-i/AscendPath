import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Target, Flame, CheckCircle2, BookMarked, Camera, Loader2 } from 'lucide-react';
import { ProfileStats } from '@/hooks/useProfileStats';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileHeaderProps {
    profile: {
        first_name: string | null;
        last_name: string | null;
        email: string | null;
        avatar_url?: string | null;
        display_name?: string | null;
        bio?: string | null;
        goal_role?: string | null;
        created_at: string;
    };
    stats: ProfileStats;
    userId?: string;
    onAvatarUpdate?: () => void;
}

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (value === 0) {
            setCount(0);
            return;
        }

        const steps = 30;
        const increment = value / steps;
        const stepDuration = duration / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
}

export default function ProfileHeader({ profile, stats, userId, onAvatarUpdate }: ProfileHeaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/avatar.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            toast.success('Avatar updated!');
            onAvatarUpdate?.();
        } catch (error) {
            console.error('Avatar upload error:', error);
            toast.error('Failed to upload avatar');
        } finally {
            setIsUploading(false);
        }
    };

    const displayName = profile.display_name ||
        `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
        'User';

    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const joinDate = stats.joinDate
        ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(stats.joinDate)
        : 'Recently';

    const tagline = profile.goal_role
        ? `Aspiring ${profile.goal_role}`
        : 'Learning enthusiast';

    const statCards = [
        {
            icon: CheckCircle2,
            value: stats.completedMilestones,
            label: 'Completed',
            color: 'text-sage',
            bgColor: 'from-sage-light/50 to-sage/10',
        },
        {
            icon: Flame,
            value: stats.currentStreak,
            label: 'Day Streak',
            color: 'text-terracotta',
            bgColor: 'from-terracotta-light/50 to-terracotta/10',
        },
        {
            icon: Target,
            value: stats.overallProgress,
            label: '% Progress',
            color: 'text-amber-600',
            bgColor: 'from-amber-100/50 to-amber-200/10',
        },
        {
            icon: BookMarked,
            value: stats.savedRoadmaps,
            label: 'Roadmaps',
            color: 'text-purple-600',
            bgColor: 'from-purple-100/50 to-purple-200/10',
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cream via-white to-terracotta-light/20 dark:from-charcoal dark:via-charcoal/90 dark:to-sage/10 border border-terracotta/10 shadow-warm-lg p-6 md:p-8">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                {/* Profile info row */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                    {/* Avatar */}
                    <div className="relative group">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={userId ? handleAvatarClick : undefined}
                            className={userId ? 'cursor-pointer' : ''}
                        >
                            <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white dark:border-charcoal shadow-warm-md ring-2 ring-terracotta/20">
                                <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
                                <AvatarFallback className="bg-gradient-to-br from-terracotta to-terracotta-dark text-white text-2xl font-heading">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {userId && (
                                <>
                                    {/* Full overlay on hover (desktop) */}
                                    <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isUploading ? (
                                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                                        ) : (
                                            <Camera className="h-6 w-6 text-white" />
                                        )}
                                    </div>
                                    {/* Small camera badge on mobile (always visible) */}
                                    <div className="absolute bottom-0 right-0 sm:hidden flex items-center justify-center w-8 h-8 bg-terracotta rounded-full border-2 border-white dark:border-charcoal shadow-md">
                                        {isUploading ? (
                                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                                        ) : (
                                            <Camera className="h-4 w-4 text-white" />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {stats.currentStreak >= 7 && (
                            <Badge className="absolute -bottom-1 -right-1 bg-amber-500 text-white border-2 border-white dark:border-charcoal">
                                <Flame className="h-3 w-3 mr-0.5" />
                                {stats.currentStreak}
                            </Badge>
                        )}
                    </div>

                    {/* Name and info */}
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-heading font-bold text-charcoal dark:text-cream">
                            {displayName}
                        </h1>
                        <p className="text-lg text-terracotta font-medium mt-1">
                            {tagline}
                        </p>
                        {profile.bio && (
                            <p className="text-muted-foreground mt-2 max-w-lg">
                                {profile.bio}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {profile.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Member since {joinDate}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <Card
                            key={stat.label}
                            className={`p-4 bg-gradient-to-br ${stat.bgColor} border-0 backdrop-blur-sm shadow-warm hover:shadow-warm-md transition-all hover:-translate-y-0.5`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-white/50 dark:bg-charcoal/50 ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-heading text-charcoal dark:text-cream">
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
