import { React, useContext, useState } from 'react'
import UserContext from '../../Context/userContext'
const DynamicUrlInput = () => {
  const { url, setUrl } = useContext(UserContext)
  // const [url, setUrl] = useState('neko');

  return (
    <div className="flex items-center justify-center  p-4">
      <div className="flex items-center text-3xl font-inter">
        <span className="whitespace-nowrap">localhost:5173/</span>
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent outline-none "
            style={{ width: `${Math.max(1, url.length)}ch` }}
          />
          <span className="absolute top-0 left-0 text-gray-500 pointer-events-none">
            {url}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DynamicUrlInput;