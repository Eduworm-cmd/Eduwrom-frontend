import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Vedio } from './Vedio';
import { Games } from './Games';
import { FileSpreadsheet, FileStack, Gamepad2, Video } from 'lucide-react';
import { WorkSheet } from './WookSheet';
import { Ppt } from './Ppt';

export const Lms = () => {
  return (
    <div>
      <div className="max-w-8xl p-4 bg-sky-200 shadow-md rounded-lg">
        <Tabs defaultValue="games" className="w-full h-auto">
          <TabsList className="flex h-auto space-x-2 bg-white p-2 rounded-md shadow">
            <TabsTrigger
              value="games"
              className="px-6 py-2 text-sm font-semibold rounded-md data-[state=active]:bg-sky-500 data-[state=active]:text-white hover:bg-sky-100 cursor-pointer"
            >
              <Gamepad2 size={60}/> Add Games
            </TabsTrigger>
            <TabsTrigger
              value="vedio"
              className="px-6 py-2 text-sm font-semibold rounded-md data-[state=active]:bg-sky-500 data-[state=active]:text-white hover:bg-sky-100 cursor-pointer"
            >
              <Video/>Add Vedio
            </TabsTrigger>
            <TabsTrigger
              value="worksheet"
              className="px-6 py-2 text-sm font-semibold rounded-md data-[state=active]:bg-sky-500 data-[state=active]:text-white hover:bg-sky-100 cursor-pointer"
            >
              <FileSpreadsheet size={32} />Add WorkSheet
            </TabsTrigger>
            <TabsTrigger
              value="ppt"
              className="px-6 py-2 text-sm font-semibold rounded-md data-[state=active]:bg-sky-500 data-[state=active]:text-white hover:bg-sky-100 cursor-pointer"
            >
              <FileStack size={32}/>Add PPT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="mt-6">
            <Games />
          </TabsContent>

          <TabsContent value="vedio" className="mt-6">
            <Vedio />
          </TabsContent>

          <TabsContent value="worksheet" className="mt-6">
            <WorkSheet/>
          </TabsContent>

          <TabsContent value="ppt" className="mt-6">
            <Ppt/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
