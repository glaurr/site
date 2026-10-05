"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function isOptedOut()
{
    try {
        return localStorage.getItem("va-disable") !== null;
    } catch {
        return false;
    }
}

export function SiteAnalytics()
{
    return (
        <>
            <Analytics beforeSend = {(event) => (isOptedOut() ? null : event)} />
            <SpeedInsights beforeSend = {(event) => (isOptedOut() ? null : event)} />
        </>
    );
}