import React, { useState } from 'react';
import { videoContext } from './VideoContext';

export default function SocketProvider({ children }) {
    const [video, setVideo] = useState(true);

    return (
        <videoContext.Provider value={{ video, setVideo }}>
            {children}
        </videoContext.Provider>
    );
};