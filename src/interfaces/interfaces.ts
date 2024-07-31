
export interface CourseInterface {
    name: string;
    provider?: string;
    link?: string;
}

export interface SkillsInterface {
    name: string;
    priority: number;
}

export interface ProfilesInterface {
    name: string;
    url: string;
    type: string;
    icon: string;
}

export interface MembershipInterface {
    club: string;
    position: string;
    clubwebsite: string;
}

export interface WorkExperienceInterface {
    timeframe: string;
    company: string;
    post: string;
    description: string[] | string;
}