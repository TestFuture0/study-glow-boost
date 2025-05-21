
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import PointsOverview from "@/components/points/PointsOverview";
import PointsHistory from "@/components/points/PointsHistory";
import { useEffect, useState } from "react";

const PointsPage = () => {
  // Save the active tab to preserve it on focus changes
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // This ensures we preserve the active tab when focusing in/out
  useEffect(() => {
    // Get the stored tab from localStorage or use default
    const storedTab = localStorage.getItem('pointsActiveTab') || 'overview';
    setActiveTab(storedTab);
    
    // Handle focus and visibility change events to ensure tab state persists
    const handleVisibilityChange = () => {
      const storedTab = localStorage.getItem('pointsActiveTab') || 'overview';
      setActiveTab(storedTab);
    };
    
    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Update localStorage when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('pointsActiveTab', value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Points & Levels</h1>
            <p className="text-muted-foreground">
              Track your progress and points earned through your study journey
            </p>
          </div>
          <div className="rounded-full border-2 border-amber-400 bg-white p-3 dark:bg-slate-800">
            <Star className="h-6 w-6 text-amber-400" />
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
          defaultValue="overview"
        >
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
            <TabsTrigger value="history" className="w-full">Points History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            <PointsOverview />
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <PointsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PointsPage;
