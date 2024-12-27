"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

const PaymentPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("stripe");
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        // Assuming there's an API to fetch payment history
        const res = await api.get(`/api/users/${session?.user.id}/payment-history`);
        setPaymentHistory(res.data.data);
      } catch (error: any) {
        console.error("Error fetching payment history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentHistory();
  }, [session]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedMethod === "stripe") {
        response = await api.post("/api/payments/stripe/create-session", {
          priceId: "price_123", // Example priceId
          successUrl: `${window.location.origin}/dashboard/user/payment-success`,
          cancelUrl: `${window.location.origin}/dashboard/user/payment-cancel`,
          mode: "payment",
        });
      } else {
        response = await api.post("/api/payments/razorpay/create-order", {
          amount: 1000, // Example amount
          receipt: "receipt_123",
          notes: { userId: session?.user.id },
        });
      }

      if (response.data.success) {
        window.location.href = response.data.data.sessionUrl || response.data.data.orderId;
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Payment Options</h2>
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedMethod("stripe")}
              className={`p-4 flex flex-col items-center justify-center rounded-lg border ${
                selectedMethod === "stripe"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } transition-colors`}
            >
              <span className="text-xl mb-2">Stripe</span>
            </button>
            <button
              onClick={() => setSelectedMethod("razorpay")}
              className={`p-4 flex flex-col items-center justify-center rounded-lg border ${
                selectedMethod === "razorpay"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } transition-colors`}
            >
              <span className="text-xl mb-2">Razorpay</span>
            </button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePayment} disabled={loading}>
            {loading ? <LoaderCircleIcon className="animate-spin" /> : "Proceed to Payment"}
          </Button>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mt-8 mb-6">Payment History</h2>
      {loading ? (
        <LoaderCircleIcon className="animate-spin mx-auto" />
      ) : (
        <div className="space-y-4">
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment: any) => (
              <Card key={payment?.id}>
                <CardContent>
                  <p>ID: {payment?.id}</p>
                  <p>Amount: ${payment?.amount}</p>
                  <p>Status: {payment?.status}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert>
              <AlertTitle>No Payment History</AlertTitle>
              <AlertDescription>You have not made any payments yet.</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;