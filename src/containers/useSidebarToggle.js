// // src/contexts/SidebarToggleContext.js
// import React, { createContext, useState, useEffect, useContext } from 'react';

// const SidebarToggleContext = createContext();

// export const SidebarToggleProvider = ({ children }) => {
//     const [toggle, setToggle] = useState(true); // Sidebar initially open

//     const Toggle = () => {
//         setToggle(!toggle);
//     };

//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth <= 768) {
//                 setToggle(false); // Close sidebar when screen size is reduced
//             }
//         };

//         // Add event listener for window resize
//         window.addEventListener('resize', handleResize);

//         // Cleanup function to remove event listener
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     return (
//         <SidebarToggleContext.Provider value={{ toggle, Toggle }}>
//             {children}
//         </SidebarToggleContext.Provider>
//     );
// };

// export const useSidebarToggle = () => useContext(SidebarToggleContext);
