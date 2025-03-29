
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { DUMMY_LEADERBOARD } from "@/lib/sora-constants";

interface LeaderboardEntry {
  user_id: string;
  name: string;
  total_runes: number;
  submission_count: number;
}

export default function LeaderboardPanel() {
  const { isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all-time");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch the actual leaderboard from the database
        // For demo purposes, we'll use the dummy data and add a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate fetching data from backend
        const dummyData: LeaderboardEntry[] = DUMMY_LEADERBOARD.map((entry, i) => ({
          user_id: `user-${i}`,
          name: entry.name,
          total_runes: entry.totalRunes,
          submission_count: entry.submissions
        }));
        
        setLeaderboard(dummyData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe]);

  const getLeaderboardIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium">{index + 1}</div>;
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-primary" />
            SoraRunes Leaderboard
          </h3>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList className="h-8 p-1">
              <TabsTrigger value="weekly" className="text-xs h-6 px-2">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-6 px-2">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="all-time" className="text-xs h-6 px-2">
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="p-4 pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
                <div className="h-4 w-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50"
              >
                <div className="w-8 text-center">{getLeaderboardIcon(index)}</div>
                <div className="flex items-center gap-2 flex-1">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground">
                      {entry.name.charAt(0)}
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{entry.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-blue-400 mr-1" />
                    <span className="text-sm font-medium">{entry.total_runes}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{entry.submission_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-muted rounded-md text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Log in to appear on the leaderboard and track your SoraRunes!
            </p>
            <Button size="sm" variant="outline" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
