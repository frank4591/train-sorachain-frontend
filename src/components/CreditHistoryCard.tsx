
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { CreditEvent } from "@/lib/constants";
import { format } from "date-fns";
import { CreditCard, ChevronDown, Plus, Minus } from "lucide-react";

interface CreditHistoryCardProps {
  creditHistory: CreditEvent[];
  className?: string;
}

export default function CreditHistoryCard({ creditHistory, className }: CreditHistoryCardProps) {
  const [showAllHistory, setShowAllHistory] = useState(false);
  
  // Sort transactions by date, most recent first
  const sortedHistory = [...creditHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Show only recent transactions initially
  const visibleTransactions = showAllHistory 
    ? sortedHistory 
    : sortedHistory.slice(0, 5);
  
  return (
    <BlurredCard className={className}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <CreditCard className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Credit History</h3>
        </div>
        
        <div className="space-y-4">
          {visibleTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No credit transactions yet
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {visibleTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center">
                      {transaction.amount >= 0 ? (
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                          <Plus className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center mr-3">
                          <Minus className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{transaction.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.timestamp), "MMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      transaction.amount >= 0 ? "text-green-500" : "text-destructive"
                    )}>
                      {transaction.amount >= 0 ? "+" : ""}{transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
              
              {creditHistory.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowAllHistory(!showAllHistory)}
                >
                  {showAllHistory ? "Show less" : "View all transactions"}
                  <ChevronDown className={cn(
                    "ml-1 h-3 w-3 transition-transform",
                    showAllHistory && "rotate-180"
                  )} />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </BlurredCard>
  );
}
