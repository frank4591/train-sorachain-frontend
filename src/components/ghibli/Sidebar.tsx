
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LayoutList, Users } from "lucide-react";
import SoraRunesDisplay from "@/components/ghibli/SoraRunesDisplay";
import SessionsList from "@/components/ghibli/SessionsList";
import LeaderboardPanel from "@/components/ghibli/LeaderboardPanel";

interface SidebarProps {
  showSidebar: boolean;
  mobileSheetOpen: boolean;
  setMobileSheetOpen: (open: boolean) => void;
  activeSidebarTab: string;
  setActiveSidebarTab: (tab: string) => void;
  fetchSessionMessages: (id: string) => void;
  activeSessionId: string | null;
}

export default function Sidebar({
  showSidebar,
  mobileSheetOpen,
  setMobileSheetOpen,
  activeSidebarTab,
  setActiveSidebarTab,
  fetchSessionMessages,
  activeSessionId
}: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      {showSidebar && (
        <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-violet-800/20 bg-black/10 backdrop-blur-sm animate-fade-in-right">
          <Tabs
            defaultValue="sessions"
            value={activeSidebarTab}
            onValueChange={setActiveSidebarTab}
            className="flex-1 flex flex-col"
          >
            <div className="border-b border-violet-800/20 px-4 py-2">
              <TabsList className="w-full grid grid-cols-2 bg-violet-900/20">
                <TabsTrigger value="sessions" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
                  <LayoutList className="h-4 w-4" />
                  <span>Sessions</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
                  <Users className="h-4 w-4" />
                  <span>Leaderboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4">
              <SoraRunesDisplay />
            </div>
            
            <TabsContent value="sessions" className="flex-1 flex flex-col mt-0">
              <SessionsList 
                onSelectSession={fetchSessionMessages}
                activeSessionId={activeSessionId}
              />
            </TabsContent>
            
            <TabsContent value="leaderboard" className="flex-1 overflow-auto p-4 mt-0">
              <LeaderboardPanel />
            </TabsContent>
          </Tabs>
        </aside>
      )}
      
      {/* Mobile Sheet */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent 
          side="left" 
          className="w-full sm:max-w-md p-0 flex flex-col bg-[#121826] border-violet-800/30"
        >
          <Tabs
            defaultValue="sessions"
            value={activeSidebarTab}
            onValueChange={setActiveSidebarTab}
            className="flex-1 flex flex-col"
          >
            <div className="border-b border-violet-800/20 px-4 py-2">
              <TabsList className="w-full grid grid-cols-2 bg-violet-900/20">
                <TabsTrigger value="sessions" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
                  <LayoutList className="h-4 w-4" />
                  <span>Sessions</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
                  <Users className="h-4 w-4" />
                  <span>Leaderboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4">
              <SoraRunesDisplay />
            </div>
            
            <TabsContent value="sessions" className="flex-1 flex flex-col mt-0">
              <SessionsList 
                onSelectSession={(id) => {
                  fetchSessionMessages(id);
                  setMobileSheetOpen(false);
                }}
                activeSessionId={activeSessionId}
              />
            </TabsContent>
            
            <TabsContent value="leaderboard" className="flex-1 overflow-auto p-4 mt-0">
              <LeaderboardPanel />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}
