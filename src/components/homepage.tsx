import React, { useEffect, useState } from "react";
import {
  BANK_PROFILE,
  DONATION_APPROVE_URL,
  DONATION_CONFIRM_URL,
  DONATION_DELETE_URL,
} from "../../constants";
import { useNavigate } from "react-router-dom";
import secureStorage from "react-secure-storage";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Check, CheckCheck, X } from "lucide-react";

interface FoodDonation {
  id: number;
  content: string;
  approval: boolean;
  receivedFood: boolean;
  receiverBankId: string;
}

interface BankProfile {
  message: string;
  data: {
    bankName: string;
    email: string;
    FoodDonation: FoodDonation[];
  };
}

interface BankProfileData {
  FoodDonation: any;
  bankName: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = secureStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const [profileData, setProfileData] = useState<BankProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = secureStorage.getItem("email");
      const response = await fetch(BANK_PROFILE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setProfileData(data.data);
      console.log(data.data);
    };

    fetchProfile();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const handleApprove = (donationId: any) => {
    const approveDonation = async (donationId: number) => {
      const response = await fetch(`${DONATION_APPROVE_URL}/${donationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donationId }),
      });
      if (response.ok) {
        // Handle successful approval
        navigate(0)
        console.log("Donation approved successfully");
      } else {
        // Handle error
        console.error("Failed to approve donation");
      }
    };
    approveDonation(donationId);
  };

  const handleConfirm = (donationId: any) => {
    const point = "king";
    const confirmDonation = async (donationId: number) => {
      const response = await fetch(`${DONATION_CONFIRM_URL}/${donationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donationId, point }),
      });
      if (response.ok) {
        // Handle successful confirmation
        navigate(0)
        console.log("Donation confirmed successfully");
      } else {
        // Handle error
        console.error("Failed to confirm donation");
      }
    };
    confirmDonation(donationId);
  };

  const handleDelete = (donationId: any) => {
    const deleteDonation = async (donationId: number) => {
      const response = await fetch(`${DONATION_DELETE_URL}/${donationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donationId }),
      });
      if (response.ok) {
        // Handle successful deletion
        navigate(0)
        console.log("Donation deleted successfully");
      } else {
        // Handle error
        console.error("Failed to delete donation");
      }
    };
    deleteDonation(donationId);
  }
  profileData.FoodDonation.sort((a, b) => a.id - b.id);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="my-6 mx-6">
        <p className="text-6xl font-bold">Dashboard</p>
      </div>
      <div>
        <Card className="mx-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Donation ID</TableHead>{" "}
                {/* Column for donation ID */}
                <TableHead className="w-[500px]">Content</TableHead>{" "}
                {/* Column for content of the donation */}
                <TableHead className="w-[500px]">Status</TableHead>{" "}
                {/* Column for status (approval and receivedFood) */}
                <TableHead className="w-[500px]">
                  Receiver Bank ID
                </TableHead>{" "}
                {/* Column for receiver bank ID */}
                <TableHead className="text-center">Actions</TableHead>{" "}
                {/* Column for actions */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Map over the FoodDonation array */}
              {profileData.FoodDonation.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.id}</TableCell>{" "}
                  {/* Display Donation ID */}
                  <TableCell>{donation.content}</TableCell>{" "}
                  {/* Display content */}
                  <TableCell>
                    {/* Status column: showing approval and receivedFood */}
                    <span
                      className={`text-${
                        donation.approval ? "green" : "red"
                      }-500`}
                    >
                      {donation.approval ? "Approved" : "Pending Approval"}
                    </span>
                    <br />
                    <span
                      className={`text-${
                        donation.receivedFood ? "green" : "yellow"
                      }-500`}
                    >
                      {donation.receivedFood
                        ? "Food Received"
                        : "Food Not Received"}
                    </span>
                  </TableCell>
                    <TableCell>{donation.receiverBankId}</TableCell>{" "}
                    {/* Display receiver bank ID */}
                    <TableCell className="text-center">
                    {/* Actions: Tick for approval, X for rejection */}
                    {donation.approval && !donation.receivedFood ? (
                      <Button
                      variant="outline"
                      className="text-green-500 mx-2"
                      onClick={() => handleConfirm(donation.id)}
                      >
                      <CheckCheck />
                      </Button>
                    ) : !donation.approval ? (
                      <>
                      <Button
                        variant="outline"
                        className="text-green-500 mx-2"
                        onClick={() => handleApprove(donation.id)}
                      >
                        <Check />
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-500 mx-2 my-2"
                        onClick={() => handleDelete(donation.id)}
                      >
                        <X />
                      </Button>
                      </>
                    ) : null}
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
