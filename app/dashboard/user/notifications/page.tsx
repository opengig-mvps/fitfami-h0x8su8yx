"use client";

import React, { useEffect, useState } from "react";
import { Bell, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface Notification {
  notificationId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/notifications`);
        setNotifications(res.data.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session]);

  const toggleReadStatus = async (notificationId: string) => {
    try {
      // Assuming there's an API to toggle read status
      const res = await api.patch(`/api/notifications/${notificationId}`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: !notification.isRead }
              : notification
          )
        );
        toast.success("Notification status updated!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {loading ? (
        <LoaderCircle className="animate-spin mx-auto" />
      ) : (
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <Card key={notification?.notificationId}>
              <CardHeader className="flex justify-between">
                <CardTitle>{notification?.content}</CardTitle>
                <Checkbox
                  checked={notification?.isRead}
                  onChange={() => toggleReadStatus(notification?.notificationId)}
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {new Date(notification?.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;