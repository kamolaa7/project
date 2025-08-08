import { useState, useEffect } from 'react';
import { AlignJustify } from 'lucide-react';

function SideBar({info}) {
    const [isOpen, setIsOpen] = useState(false);
    function toggleSidebar() {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            {!isOpen && (
                <button onClick={toggleSidebar} className="fixed top-6 left-6 z-50" aria-label="Open sidebar">
                    <AlignJustify size={30} className="text-gray-700" />
                </button>
            )}
             <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 backdrop-blue-sm ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6">
                    <h2 className="font-bold mb-2">About BrandAid</h2>
                    <p>{info}</p>
                    <button onClick={toggleSidebar} className="mt-4 px-4 py-2 bg-green-900 text-white rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}        

export default SideBar;
