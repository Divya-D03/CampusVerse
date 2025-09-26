'use client';

import { type CoinTransaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CoinHistoryProps {
  transactions: CoinTransaction[];
}

export function CouponHistory({ transactions }: CoinHistoryProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="neumorphic-raised h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Transaction Log
        </CardTitle>
         <CardDescription>
          A record of your coin earnings and spending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length > 0 ? (
          <ScrollArea className="h-[450px]">
            <div className="space-y-4 pr-4">
              {sortedTransactions.map((tx, index) => (
                <div key={`${tx.id}-${index}`} className="flex items-center justify-between p-3 rounded-md neumorphic-flat">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full neumorphic-pressed",
                      tx.type === 'earned' ? 'text-green-500' : 'text-red-500'
                    )}>
                      {tx.type === 'earned' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tx.date), 'MMM d, yyyy, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "font-bold text-lg",
                    tx.type === 'earned' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No transactions yet.</p>
            <p className="text-sm">Start participating in events to earn coins!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
