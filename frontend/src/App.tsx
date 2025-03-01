import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Frame from './pages/Frame';
import { routes } from './routes/config';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Frame />}>
            <Route index element={<Navigate to="/news" replace />} />
            {routes.map(({ path, component: Component }) => (
              <Route key={path} path={path.replace('/', '')} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;