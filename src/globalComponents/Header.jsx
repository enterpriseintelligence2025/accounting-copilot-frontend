/*
  Header.jsx
  - Top-level header used across the app.
  - Minimal, presentational component (logo + short intro message).
*/
import React from 'react'
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils";


const Header = () => {
    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <header className="px-5 w-full border-b bg-white">
                <div className="container mx-auto flex items-center justify-between py-2">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <div className="text-2xl font-bold">
                            <span>△</span> 
                        </div>
                        {/* Navigation / short product tagline */}
                        <div>
                        <span>Hi it's </span>
                        <span style={{ fontSize:'30px',fontWeight:'bold'}}>Ivy, </span>
                        <span>your enterprise accounting copilot </span>
                        </div>
                    </div>

                    {/* Action Buttons (kept commented during early development) */}
                    <div className="flex space-x-4">
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header