import { useState, useEffect } from 'react';
export function useTheme() {
    const [theme, setTheme] = useState('default');
    useEffect(() => {
        // In a real application, you would fetch the theme based on the NPO or user preferences
        // For now, we'll just use a default theme
        setTheme('default');
    }, []);
    return { theme, setTheme };
}
