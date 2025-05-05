import { useState } from 'react';

function useUserData() {
    const [userData] = useState(() => {
        // Lazy initialization: Only runs on the first render
        const data = window.localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    });

    return userData;
}

export default useUserData;
