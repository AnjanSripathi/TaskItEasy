import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
// import DashBoardPage from '../pages/DashBoardPage';
function TopNavigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className ="sticky top-0 z-50 flex flex-col md:flex-row justify-between w-full border-b border-gray-200 bg-white px-8 py-4">
            <div className="flex items-center gap-3">
                <button className="md:hidden" aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen?<X />:<Menu />}
                </button>
                <Link to = "/dashboard" className = "text-xl font-semibold text-primary"> TaskItEasy </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden items-center gap-8 md:flex ">
                <NavLink to = "/dashboard" 
                className ={({isActive}) => isActive? "text-sm font-medium text-primary border-b-2 border-primary" : "text-sm font-medium text-gray-600 transition-colors hover:text-primary border-b-2 border-transparent"}>
                    Dashboard 
                </NavLink>
                <NavLink to = "/projects" 
                className = {({isActive}) => isActive? "text-sm font-medium text-primary border-b-2 border-primary" : "text-sm font-medium text-gray-600 transition-colors hover:text-primary border-b-2 border-transparent"}> 
                Projects 
                </NavLink>
                <NavLink to = "/tasks" 
                className = {({isActive}) => isActive? "text-sm font-medium text-primary border-b-2 border-primary" : "text-sm font-medium text-gray-600 transition-colors hover:text-primary border-b-2 border-transparent"}> 
                My Tasks 
                </NavLink>
            </div>

            {/* Mobile dropdown */}
            {isMenuOpen && ( 
            <div className = "flex flex-col items-start gap-2 md:hidden">
                <NavLink to = "/dashboard" 
                    className ={({isActive}) => isActive? "inline-block text-sm font-medium text-primary border-b-2 border-primary" : "text-sm font-medium text-gray-600 transition-colors hover:text-primary border-b-2 border-transparent"}
                    onClick={() => setIsMenuOpen(false)}>
                        Dashboard 
                </NavLink>
                <NavLink to = "/projects" 
                    className = {({isActive}) => isActive? "inline-block text-sm font-medium text-primary border-b-2 border-primary" : "text-sm font-medium text-gray-600 transition-colors hover:text-primary border-b-2 border-transparent"}
                    onClick={() => setIsMenuOpen(false)}> 
                    Projects 
                </NavLink>
                <NavLink to = "/tasks" 
                    className = {({isActive}) => isActive? "inline-block text-sm font-medium text-primary border-b-2 border-primary" : "text-sm font-medium text-gray-600 transition-colors hover:text-primary border-b-2 border-transparent"}
                    onClick={() => setIsMenuOpen(false)}> 
                    My Tasks 
                </NavLink>
            </div>
            )}
        </nav>
    )
}

export default TopNavigation;