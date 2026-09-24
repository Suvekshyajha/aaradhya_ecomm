import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import axios from "axios";

import { Toaster } from "./components/ui/toaster.jsx";


// The auth token lives in an httpOnly cookie, so every request must opt in to
// sending it. Without this the server-side authMiddleware/adminMiddleware
// would reject the admin product/order and shop cart/address/order calls.
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
      
    </Provider>
  </BrowserRouter>
);