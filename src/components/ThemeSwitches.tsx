import { useState, useEffect } from 'react';
import { IoColorPalette } from 'react-icons/io5';

const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark');

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    const themeList = [
        "light", "dark"
    ];

    return (
        <details>
            <summary>
                <div className='flex flex-col justify-center items-center'>
                    <IoColorPalette className='text-2xl' />
                </div>
            </summary>
            <ul className="flex flex-col items-center space-y-1 p-4 h-32 overflow-y-auto right-0">
                {themeList.map((themeName) => (
                    <li
                        key={themeName}
                        className={`btn w-full ${theme === themeName ? 'btn-primary' : ''}`}
                        onClick={() => handleThemeChange(themeName)}
                    >
                        {themeName.charAt(0).toUpperCase() + themeName.slice(1)} Mode
                    </li>
                ))}
            </ul>
        </details>
    );
};

export default ThemeSwitcher;
