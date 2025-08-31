'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-[#E9DFCE] p-6">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">
              What is Dinner Tracker?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Dinner Tracker is an app that helps you keep track of dinners with your friends.
              You can add couples, register dinner dates, register what you ate, and receive reminders when it's time
              to invite someone for dinner again.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">
              How do I add a new couple?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Click on "Add Couple" in the navigation, fill in the name (doesnt nescessarily have to be a couple. Could be one person, or three people) of the couple and select
              the interval for how often you want reminders. Do you want to be reminded after just 3 months, or is 6 months more appropriate? Then click "Add Couple" to save.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">
              How do I add a dinner date?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Click on "Add Dinner Date" in the navigation, select the couple, or couples, and date for the dinner,
              and whether you were the host or guest. Shortly describe the menu and perhaps som simple notes. Then click "Add Dinner Date" to save.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium">
              How do reminders work?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Based on the interval you've chosen for each couple (3, 6, or 12 months), the
              app will show you when it's time to meet again. You can see this on the home page
              and in the statistics view.

              At the moment, you can't get a reminder by mail. But we are working on that. Right now you will se the reminders on your start page.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium">
              Can I edit or delete a couple?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Yes, go to "Manage Couples" in the navigation where you can edit or delete
              existing couples.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-medium">
              Can I see the history of all dinners?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Yes, on the statistics page you can see all registered dinners sorted by couple
              and date.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-medium">
              Does it cost anything to use Dinner Tracker?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Dinner Tracker is completely free to use at the moment.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
} 