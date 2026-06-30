import React from 'react';
import { dashboardMockData } from '../utils/mockData';

// Component Imports
import { VideoPlayer } from '../components/dashboard/VideoPlayer';
import { TerrainDetectionCard } from '../components/dashboard/DetectionCard';
import { DriveModeCard } from '../components/dashboard/DriveModeCard';
import { SuspensionCard } from '../components/dashboard/SuspensionCard';
import { SeverityGauge } from '../components/dashboard/SeverityGauge';
import { StatusCard } from '../components/dashboard/StatusCard';
import { CommandLog } from '../components/dashboard/CommandLog';
import { RecentAlertsCard } from '../components/dashboard/RecentAlertsCard';
import { VehicleCard } from '../components/dashboard/VehicleCard';
import { SystemStatusCard } from '../components/dashboard/SystemStatusCard';

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Diagnostic <span className="text-automotive-blue">Dashboard</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column - Video */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <VideoPlayer 
            status={dashboardMockData.video.status}
            resolution={dashboardMockData.video.resolution}
            fps={dashboardMockData.video.fps}
            source={dashboardMockData.video.source}
          />
        </div>
        
        {/* Center Column - Terrain & Drive */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <TerrainDetectionCard 
            type={dashboardMockData.terrain.type}
            confidence={dashboardMockData.terrain.confidence}
          />
          <DriveModeCard 
            currentMode={dashboardMockData.driveMode.currentMode}
            activeAssist={dashboardMockData.driveMode.activeAssist}
          />
          <SuspensionCard 
            frontLeft={dashboardMockData.suspension.frontLeft}
            frontRight={dashboardMockData.suspension.frontRight}
            rearLeft={dashboardMockData.suspension.rearLeft}
            rearRight={dashboardMockData.suspension.rearRight}
            mode={dashboardMockData.suspension.mode}
            status={dashboardMockData.suspension.status}
          />
          <SeverityGauge 
            level={dashboardMockData.severity.level}
            score={dashboardMockData.severity.score}
            maxScore={dashboardMockData.severity.maxScore}
          />
        </div>

        {/* Right Column - Status & Logs */}
        <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-4 sm:gap-6">
          <StatusCard 
            speed={dashboardMockData.vehicleStatus.speed}
            rpm={dashboardMockData.vehicleStatus.rpm}
            gear={dashboardMockData.vehicleStatus.gear}
            battery={dashboardMockData.vehicleStatus.battery}
            temp={dashboardMockData.vehicleStatus.temp}
          />
          {/* I will add RecentAlertsCard, creating it if I forgot it earlier */}
          <RecentAlertsCard alerts={dashboardMockData.alerts} />
          <CommandLog commands={dashboardMockData.commands as any} />
        </div>
      </div>

      {/* Bottom Section - System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-2">
        <div className="lg:col-span-6 xl:col-span-8">
          <VehicleCard 
            model={dashboardMockData.overview.model}
            vin={dashboardMockData.overview.vin}
            firmware={dashboardMockData.overview.firmware}
            uptime={dashboardMockData.overview.uptime}
          />
        </div>
        <div className="lg:col-span-6 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <SystemStatusCard title="API Status" data={dashboardMockData.apiStatus} />
          <SystemStatusCard title="Connection" data={dashboardMockData.connectionStatus} />
        </div>
      </div>
    </div>
  );
};
