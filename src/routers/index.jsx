import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import authStorage from "@/helpers/storage";

// Routers
import AuthRouter from "./authRouter";
import PrivateRouter from "./pirvateRouter";
import Privacy from "../pages/Privacy";
import NotFound from "../pages/404Page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* privacy */}
      <Route path="/privacy" element={<Privacy />} />
      {!authStorage.getToken() ? (
        <>
          <Route path="auth/*" element={<AuthRouter />} />
          <Route path="/" element={<Navigate to="/auth/login" />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </>
      ) : (
        <Route path="/*" element={<PrivateRouter />} />
      )}
    </Route>
  )
);

export default router;
