import { Link, useLocation, useNavigate } from "react-router-dom";
import { BellIcon, LoaderCircle, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { logoutUser } from '../slice/authSlice';
import { useDispatch, useSelector } from "react-redux";
import { getFriendRequestsForNotification } from "../slice/friendSlice";
import { useEffect } from "react";

const Navbar = () => {
  const dispatch = useDispatch()
  const { user, isLoading,  } = useSelector((state)=> state.auth);
  const { incomingRequestsCount } = useSelector((state) => state.friends);
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const navigate = useNavigate()

    const handleLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
        navigate('/login', { replace: true });
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };

  useEffect(() => {
  if (user?._id) {
    dispatch(getFriendRequestsForNotification());
    const interval = setInterval(() => {
      dispatch(getFriendRequestsForNotification());
    }, 10000);
    return () => clearInterval(interval);
    }
  }, [dispatch, user]);


  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-5">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"} className="relative">
              <button className="btn btn-ghost btn-circle relative">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {incomingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {incomingRequestsCount}
                  </span>
                )}
              </button>
            </Link>

          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={user?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <button  
            className="btn btn-ghost btn-circle overflow-hidden" 
            onClick={handleLogout}
            disabled={isLoading}> 
            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-[6px]">
                <LoaderCircle className="animate-spin h-6 w-6"/>
                Logging out..
                </div>
            ):(
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70"/>
            )}  
           
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
