"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ShopliftingAlerts from "@/components/ShopliftingAlerts/shop";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const ShopliftingAlertsPage: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Shoplifting Alerts" />
            <ShopliftingAlerts />
        </DefaultLayout>
    );
};

export default ShopliftingAlertsPage;