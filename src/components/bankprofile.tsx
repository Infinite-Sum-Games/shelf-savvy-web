import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureStorage from "react-secure-storage";
import { Button } from "./ui/button";
const BankProfile = () => {
  const navigate = useNavigate();
  const token = secureStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <div>
    <Button onClick={() => sessionStorage.clear()}>Logout</Button>
  </div>;
};
export default BankProfile;
