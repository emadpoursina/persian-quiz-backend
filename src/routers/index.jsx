import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import authStorage from "@/helpers/storage";

// Routers
import PrivateRouter from "./pirvateRouter";

// Pages
import PersianQuizApp from "@/pages/PersianQuizApp";
import Login from "@/pages/Login";
import NotFound from "@/pages/404Page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* privacy */}
      {!authStorage.getToken() ? (
        <>
          <Route path="/" element={<PersianQuizApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NotFound />} />
        </>
      ) : (
        <Route path="/*" element={<PrivateRouter />} />
      )}
    </Route>
  )
);

export default router;
