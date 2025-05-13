import { useState, useEffect } from "react";
import { User } from "@blog-project/shared-types";
import useAuth from "./useAuth";

export const useProfile = () => {
    const { user, isLoading } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);

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