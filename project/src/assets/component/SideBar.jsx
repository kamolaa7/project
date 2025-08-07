import { useState, useEffect } from 'react';
import { AlignJustify } from 'lucide-react';

function SideBar({info}) {
    const [isInfo, setIsInfo] = useState(false);
    function toggleOverlay() {
        setIsInfo(!isInfo);
    }

    return (
        <div className="SideBar">
            <button onClick={toggleOverlay} className="toggle-button">
                <AlignJustify size={30} className="text-gray-700" />
            </button>
            <div className={`overlay ${isInfo ? 'active' : ''}`}>
                {isInfo && (
                    <div className="overlay-content bg-white p-4 rounded shadow-lg absolute top-12 left-0 z-50">
                        <h2 className="font-bold mb-2">Information</h2>
                        <p>{info}</p>
                        <button onClick={toggleOverlay} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SideBar;
