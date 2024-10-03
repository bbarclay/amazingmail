import React from 'react';
import Link from 'next/link';

const settings = [
    { name: 'AI Settings', url: '/settings/ai' },
    { name: 'Domain URL Defaults', url: '/settings/domain' },
    { name: 'User Preferences', url: '/settings/preferences' },
    { name: 'Notification Settings', url: '/settings/notifications' },
    { name: 'Privacy Settings', url: '/settings/privacy' },
    { name: 'API Configuration', url: '/settings/api' },
    { name: 'Theme Settings', url: '/settings/theme' },
];

const SettingsGrid = () => {
    return (
        <div className="grid-container">
            {settings.map((setting) => (
                <Link key={setting.name} href={setting.url}>
                    <div className="grid-item">
                        <h2>{setting.name}</h2>
                    </div>
                </Link>
            ))}
            <style jsx>{`
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 10px;
                }
                .grid-item {
                    padding: 20px;
                    border: 1px solid #ccc;
                    text-align: center;
                    background-color: #f9f9f9;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default SettingsGrid;
