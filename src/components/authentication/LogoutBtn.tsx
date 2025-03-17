"use client";

import { signOut } from "@/actions/auth-actions";

const LogoutBtn = () => {

    const handleLogOut = async () => {
        await signOut();
    };

    return (
        <span
            onClick={handleLogOut}
            className="inline-block w-full cursor-pointer text-destructive"
        >
            LogOut
        </span>
    );
};

export default LogoutBtn;