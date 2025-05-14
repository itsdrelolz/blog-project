import { useState, useEffect } from "react";
import { GetUserData } from "@blog-project/shared-types/types/user";
import useAuth from "./useAuth";

export const useProfile = () => {
    const { user, isLoading } = useAuth();
    const [profile, setProfile] = useState<GetUserData | null>(null);

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    return {
        profile,
        isLoading,
        isAuthenticated: !!user
    };
};