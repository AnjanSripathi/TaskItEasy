import { Outlet } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
function AppLayout(){
    return(
        <div>
            <TopNavigation />
            <Outlet />
        </div>
    )
}

export default AppLayout;