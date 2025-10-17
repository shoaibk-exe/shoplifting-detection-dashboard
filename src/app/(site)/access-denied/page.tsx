import React from "react";
import { Metadata } from "next";
import AccessTemplate from "@/components/Access-denied/AccessTemplate";
export const metadata: Metadata = {
    title: "Access Denied",
    description: "This is Access Denied page for Alf Vision Dashboard",
};

const AccessDenied: React.FC = () => {
    return (
        <AccessTemplate />
    );
};

export default AccessDenied;