import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BrowserRouter } from "react-router-dom";
import NavRoutes from "./routes/NavRoutes";

const App = () => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AX58NppkZ0QfVjDIBAbrZIkjFJzKeMzPbbGgUNpP-PzfFcwX7zt4z3Wr7sjXQI3gOTQBNaHaO4QnEdpR",
        vault: true,
      }}
    >
      <BrowserRouter>
        <NavRoutes />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
};

export default App;
