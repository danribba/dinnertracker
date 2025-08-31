'use client';

import { CouplesList } from '@/components/couples-list';
import { DinnerDatesList } from '@/components/dinner-dates-list';

export function DinnerDatesOverview() {
  return (
    <div className="py-4 sm:py-8 px-3 sm:px-4">
      <div className="flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 rounded-xl border border-[#E9DFCE]/70 bg-white/50 shadow-sm">
            <h2 className="text-[#1C160C] text-2xl font-bold leading-tight">
              Long time no see...
            </h2>
            <p className="text-[#A18249] text-sm">
              It's been a long time since you saw these couples. Maybe it's time for a new dinner?
            </p>
            <CouplesList />
          </div>
        </div>

        <div className="rounded-xl p-4 md:p-6 shadow-md border border-[#E9DFCE] bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DFCE] pb-3">
              <h3 className="text-lg md:text-xl font-bold text-[#1C160C]">Dinner dates</h3>
            </div>
            <DinnerDatesList />
          </div>
        </div>
      </div>
    </div>
  );
}