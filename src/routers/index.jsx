import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import authStorage from "@/helpers/storage";

// Routers
import PrivateRouter from "./privateRouter";

// Pages
import PersianQuizApp from "@/pages/PersianQuizApp";
import Login from "@/pages/admin/Login";
import NotFound from "@/pages/404Page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<PersianQuizApp />} />
      {!authStorage.getToken() ? (
        <>
          <Route path="/admin/*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NotFound />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/*" element={<PrivateRouter />} />
        </>
      )}
    </Route>
  )
);

export default router;
