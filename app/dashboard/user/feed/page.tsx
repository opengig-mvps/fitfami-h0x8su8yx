"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const FeedPage: React.FC = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/recipes/feed?page=${page}`);
      if (res.data.success) {
        setPosts((prevPosts) => [...prevPosts, ...res.data.data]);
        setHasMore(res.data.data.length > 0);
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

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleScroll = (e: any) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="container px-4 md:px-6 py-6">
          <ScrollArea
            className="h-full"
            onScroll={handleScroll}
            style={{ overflowY: "auto" }}
          >
            {posts?.map((post: any, index: number) => (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <CardTitle>{post?.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={post?.imageUrl}
                    alt={`Post ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                  <p className="mt-4">{post?.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">Like</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">Comment</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">Share</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {loading && (
              <div className="flex justify-center py-6">
                <LoaderCircleIcon className="animate-spin" />
              </div>
            )}
          </ScrollArea>
        </section>
      </main>
    </div>
  );
};

export default FeedPage;