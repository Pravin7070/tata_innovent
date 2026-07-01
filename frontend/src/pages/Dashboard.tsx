import { useEffect, useState, useRef } from 'react';
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
import { SimulationCard } from '../components/dashboard/SimulationCard';
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

  const [telemetry, setTelemetry] = useState({
    suspension: 'NORMAL',
    terrain: 'Smooth',
    severity: 'Low',
    driveMode: '4WD'
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;
    DashboardService.getDashboardData()
      .then(res => {
        if (mounted) {
          setData(res);
          // Initialize telemetry with data if needed, or leave defaults
        }
      })
      .catch(err => {
        if (mounted) setError(err);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8000/live');

    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'telemetry') {
          // Update simulation telemetry
          setTelemetry(prev => ({
            ...prev,
            suspension: msg.suspension || prev.suspension,
            terrain: msg.terrain || prev.terrain,
            severity: msg.severity || prev.severity,
            driveMode: msg.drive_mode || prev.driveMode,
            animation: msg.animation || 'normal'
          }));

          // Update main dashboard data dynamically
          setData((prevData: any) => {
            if (!prevData) return prevData;
            
            // Generate dynamic severity score
            let score = 2.0;
            if (msg.severity === 'Medium') score = 5.5;
            if (msg.severity === 'High') score = 8.5;
            if (msg.severity === 'Critical') score = 9.8;
            
            // Generate command log if suspension or drive mode changed
            let newCommands = [...prevData.commands];
            if (msg.suspension !== prevData.suspension.mode) {
               newCommands.unshift({ id: Date.now(), time: new Date().toLocaleTimeString(), command: `SET_SUSPENSION_${msg.suspension}`, status: "Success" });
            }
            if (msg.drive_mode !== prevData.driveMode.currentMode) {
               newCommands.unshift({ id: Date.now()+1, time: new Date().toLocaleTimeString(), command: `SET_MODE_${msg.drive_mode.replace(/\s+/g, '_')}`, status: "Success" });
            }
            
            // Ensure we only keep latest 5 commands
            newCommands = newCommands.slice(0, 5);

            // Generate alerts
            let newAlerts = [...prevData.alerts];
            if (msg.alert && msg.alert !== 'Clear path') {
                const type = msg.severity === 'Critical' ? 'Critical' : (msg.severity === 'High' ? 'Warning' : 'Info');
                newAlerts.unshift({ id: Date.now(), time: new Date().toLocaleTimeString(), type, message: msg.alert });
                newAlerts = newAlerts.slice(0, 3);
            } else if (msg.alert === 'Clear path' && newAlerts.length > 0 && newAlerts[0].message !== 'Clear path') {
                newAlerts.unshift({ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'Info', message: 'Clear path' });
                newAlerts = newAlerts.slice(0, 3);
            }

            return {
              ...prevData,
              terrain: {
                ...prevData.terrain,
                type: msg.terrain,
                confidence: (msg.confidence * 100).toFixed(0)
              },
              severity: {
                ...prevData.severity,
                level: msg.severity,
                score: score
              },
              driveMode: {
                ...prevData.driveMode,
                currentMode: msg.drive_mode
              },
              suspension: {
                ...prevData.suspension,
                mode: msg.suspension
              },
              vehicleStatus: {
                ...prevData.vehicleStatus,
                speed: msg.target_speed || prevData.vehicleStatus.speed
              },
              commands: newCommands,
              alerts: newAlerts
            };
          });
        }
      } catch (err) {
        // Not a JSON message
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
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

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Left Column - Video */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <VideoPlayer 
            status={data.video.status}
            resolution={data.video.resolution}
            fps={data.video.fps}
            source={data.video.source}
          />
        </motion.div>
        
        {/* Right Column - Simulation */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <SimulationCard 
            status="RUNNING"
            suspension={telemetry.suspension}
            driveMode={telemetry.driveMode}
            terrain={telemetry.terrain}
            severity={telemetry.severity}
            animation={(telemetry as any).animation || 'normal'}
          />
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Col 1 */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <DetectionCard 
            type={data.terrain.type}
            confidence={data.terrain.confidence}
          />
          <SeverityGauge 
            level={data.severity.level}
            score={data.severity.score}
            maxScore={data.severity.maxScore}
          />
        </motion.div>

        {/* Col 2 */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
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
        </motion.div>

        {/* Col 3 */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
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
