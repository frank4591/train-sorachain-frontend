
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SessionItem {
  id: string;
  timestamp: Date;
  imageUrl: string;
  description: string;
}

interface SessionsListProps {
  onSelectSession: (sessionId: string) => void;
  activeSessionId: string | null;
}

export default function SessionsList({ onSelectSession, activeSessionId }: SessionsListProps) {
  const { user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setSessions([]);
      setIsLoading(false);
      return;
    }
    
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('image_submissions')
          .select('id, created_at, input_image, input_description')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedSessions = data.map(item => ({
          id: item.id,
          timestamp: new Date(item.created_at),
          imageUrl: item.input_image,
          description: item.input_description || 'No description'
        }));

        setSessions(formattedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-muted-foreground">No previous sessions found</p>
        {!isAuthenticated && (
          <p className="text-sm mt-2">Log in to save your sessions</p>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
        {sessions.map((session) => (
          <Button
            key={session.id}
            variant="ghost"
            className={cn(
              "w-full justify-start h-auto p-2 overflow-hidden",
              activeSessionId === session.id && "bg-muted"
            )}
            onClick={() => onSelectSession(session.id)}
          >
            <div className="flex w-full">
              <div className="w-12 h-12 mr-3 flex-shrink-0">
                <img
                  src={session.imageUrl}
                  alt="Session thumbnail"
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-medium truncate">
                  {session.description}
                </p>
                
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="mr-2">
                    {session.timestamp.toLocaleDateString()}
                  </span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {session.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
