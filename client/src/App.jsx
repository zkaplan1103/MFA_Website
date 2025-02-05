
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './App.css';

export default function App() {
  return <div className="bg-slate-100 h-screen">
      <div className="flex justify-center items-center h-s">
         <RouterProvider router={ router } />
       </div>
    </div>
}


