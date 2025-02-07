
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './App.css';
import { SessionProvider } from './context/SessionContext';

export default function App() {
  return <div className="bg-slate-800 h-screen">
      <div className="flex justify-center items-center h-s">
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>
       </div>
    </div>
}


