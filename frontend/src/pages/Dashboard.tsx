import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardService } from '../services/api';

// Component Imports
import { VideoPlayer } from '../components/dashboard/VideoPlayer';
import { DetectionCard } from '../components/dashboard/DetectionCard';
import { DriveModeCard } from '../components/dashboard/DriveModeCard';
import { SuspensionCard } from '../components/dashboard/SuspensionCard';
import { SeverityGauge } from '../components/dashboard/SeverityGauge';
import { StatusCard } from '../components/dashboard/StatusCard';
import { CommandLog } from '../components/dashboard/CommandLog';
import { RecentAlertsCard } from '../components/dashboard/RecentAlertsCard';
import { VehicleCard } from '../components/dashboard/VehicleCard';
import { SystemStatusCard } from '../components/dashboard/SystemStatusCard';
import { Loading } from '../components/ui/Loading';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    DashboardService.getDashboardData()
      .then(res => {
        if (mounted) setData(res);
      })
      .catch(err => {
        if (mounted) setError(err);
      });
    return () => { mounted = false; };
  }, []);

  if (error) {
    throw error; // Let ErrorBoundary handle it
  }

  if (!data) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[500px]">
        <Loading message="Establishing Telemetry Uplink..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Diagnostic <span className="text-automotive-blue">Dashboard</span>
        </h1>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column - Video */}
        <motion.div variants={itemVariants} className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <VideoPlayer 
            status={data.video.status}
            resolution={data.video.resolution}
            fps={data.video.fps}
            source={data.video.source}
          />
        </motion.div>
        
        {/* Center Column - Terrain & Drive */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <DetectionCard 
            type={data.terrain.type}
            confidence={data.terrain.confidence}
          />
          <DriveModeCard 
            currentMode={data.driveMode.currentMode}
            activeAssist={data.driveMode.activeAssist}
          />
          <SuspensionCard 
            frontLeft={data.suspension.frontLeft}
            frontRight={data.suspension.frontRight}
            rearLeft={data.suspension.rearLeft}
            rearRight={data.suspension.rearRight}
            mode={data.suspension.mode}
            status={data.suspension.status}
          />
          <SeverityGauge 
            level={data.severity.level}
            score={data.severity.score}
            maxScore={data.severity.maxScore}
          />
        </motion.div>

        {/* Right Column - Status & Logs */}
        <motion.div variants={itemVariants} className="lg:col-span-3 xl:col-span-4 flex flex-col gap-4 sm:gap-6">
          <StatusCard 
            speed={data.vehicleStatus.speed}
            rpm={data.vehicleStatus.rpm}
            gear={data.vehicleStatus.gear}
            battery={data.vehicleStatus.battery}
            temp={data.vehicleStatus.temp}
          />
          <RecentAlertsCard alerts={data.alerts} />
          <CommandLog commands={data.commands} />
        </motion.div>
      </motion.div>

      {/* Bottom Section - System Overview */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-2">
        <motion.div variants={itemVariants} className="lg:col-span-6 xl:col-span-8">
          <VehicleCard 
            model={data.overview.model}
            vin={data.overview.vin}
            firmware={data.overview.firmware}
            uptime={data.overview.uptime}
          />
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-6 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <SystemStatusCard title="API Status" data={data.apiStatus} />
          <SystemStatusCard title="Connection" data={data.connectionStatus} />
        </motion.div>
      </motion.div>
    </div>
  );
};
