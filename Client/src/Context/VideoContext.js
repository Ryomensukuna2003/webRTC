import { createContext, useContext } from 'react';

const videoContext = createContext();

export const useVideoContext = () => useContext(videoContext);

export default videoContext;