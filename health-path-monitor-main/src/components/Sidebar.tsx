import { Link, useLocation } from 'react-router-dom';
import { Activity, History, Bell, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { alerts } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const isDark = localStorage.getItem('health-sync-theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('health-sync-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('health-sync-theme', 'light');
    }
  };

  // ✅ Added Profile section at the bottom of main navigation
  const navItems = [
    { path: '/dashboard', icon: Activity, label: 'Dashboard' },
    { path: '/history', icon: History, label: 'Health History' },
    { path: '/alerts', icon: Bell, label: 'Alerts', badge: unreadAlerts },
    { path: '/profile', icon: User, label: 'Profile' }, // 👈 New
  ];

  const NavContent = () => (
    <>
      <div className="px-6 py-8 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Health Sync
        </h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">
          Personal Health Monitor
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-custom-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-sidebar-border space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={toggleTheme}
        >
          {darkMode ? (
            <>
              <Sun className="h-5 w-5" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              Dark Mode
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-danger hover:text-danger"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-custom-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-sidebar">
            <div className="h-full flex flex-col">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-sidebar border-r border-sidebar-border shadow-custom-lg h-screen sticky top-0">
        <NavContent />
      </aside>
    </>
  );
};








// import { Link, useLocation } from 'react-router-dom';
// import { Activity, History, Bell, LogOut, Menu, Moon, Sun } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { alerts } from '@/lib/mockData';
// import { Badge } from '@/components/ui/badge';
// import { useState, useEffect } from 'react';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// export const Sidebar = () => {
//   const location = useLocation();
//   const { logout } = useAuth();
//   const unreadAlerts = alerts.filter(a => !a.read).length;
//   const [darkMode, setDarkMode] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   useEffect(() => {
//     // Check for saved theme preference
//     const isDark = localStorage.getItem('health-sync-theme') === 'dark';
//     setDarkMode(isDark);
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
//     if (newDarkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('health-sync-theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('health-sync-theme', 'light');
//     }
//   };

//   const navItems = [
//     { path: '/dashboard', icon: Activity, label: 'Dashboard' },
//     { path: '/history', icon: History, label: 'Health History' },
//     { path: '/alerts', icon: Bell, label: 'Alerts', badge: unreadAlerts },
//   ];

//   const NavContent = () => (
//     <>
//       <div className="px-6 py-8 border-b border-sidebar-border">
//         <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//           Health Sync
//         </h1>
//         <p className="text-sm text-sidebar-foreground/70 mt-1">
//           Personal Health Monitor
//         </p>
//       </div>

//       <nav className="flex-1 px-4 py-6 space-y-2">
//         {navItems.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               onClick={() => setIsMobileOpen(false)}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-custom-sm'
//                   : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
//               }`}
//             >
//               <item.icon className="h-5 w-5" />
//               <span className="flex-1">{item.label}</span>
//               {item.badge !== undefined && item.badge > 0 && (
//                 <Badge variant="destructive" className="ml-auto">
//                   {item.badge}
//                 </Badge>
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="px-4 py-6 border-t border-sidebar-border space-y-2">
//         <Button
//           variant="outline"
//           className="w-full justify-start gap-3"
//           onClick={toggleTheme}
//         >
//           {darkMode ? (
//             <>
//               <Sun className="h-5 w-5" />
//               Light Mode
//             </>
//           ) : (
//             <>
//               <Moon className="h-5 w-5" />
//               Dark Mode
//             </>
//           )}
//         </Button>
//         <Button
//           variant="outline"
//           className="w-full justify-start gap-3 text-danger hover:text-danger"
//           onClick={logout}
//         >
//           <LogOut className="h-5 w-5" />
//           Logout
//         </Button>
//       </div>
//     </>
//   );

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
//           <SheetTrigger asChild>
//             <Button variant="outline" size="icon" className="shadow-custom-md">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="p-0 w-72 bg-sidebar">
//             <div className="h-full flex flex-col">
//               <NavContent />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-sidebar border-r border-sidebar-border shadow-custom-lg h-screen sticky top-0">
//         <NavContent />
//       </aside>
//     </>
//   );
// };
