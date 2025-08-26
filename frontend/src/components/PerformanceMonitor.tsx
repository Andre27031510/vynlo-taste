'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  memory: {
    heapUsed: number;
    heapMax: number;
    nonHeapUsed: number;
  };
  runtime: {
    uptime: number;
    startTime: number;
  };
  gc: {
    totalCollections: number;
    totalTime: number;
  };
  timestamp: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/performance/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchMetrics, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getMemoryPercentage = (used: number, max: number) => {
    return Math.round((used / max) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Performance Monitor</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchMetrics}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Carregando...' : 'Atualizar'}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded ${
              autoRefresh 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Memory Usage */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Memória JVM</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Heap Used</span>
                  <span>{metrics.memory.heapUsed} MB</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getMemoryPercentage(metrics.memory.heapUsed, metrics.memory.heapMax)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Max: {metrics.memory.heapMax} MB
              </div>
              <div className="text-sm text-gray-600">
                Non-Heap: {metrics.memory.nonHeapUsed} MB
              </div>
            </div>
          </div>

          {/* Runtime Info */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Runtime</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Uptime:</span>
                <span className="ml-2 font-medium">{formatUptime(metrics.runtime.uptime)}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Start:</span>
                <span className="ml-2 font-medium">
                  {new Date(metrics.runtime.startTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Garbage Collection */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Garbage Collection</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Collections:</span>
                <span className="ml-2 font-medium">{metrics.gc.totalCollections}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Total Time:</span>
                <span className="ml-2 font-medium">{metrics.gc.totalTime} ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        Última atualização: {metrics ? new Date(metrics.timestamp).toLocaleString() : 'Nunca'}
      </div>
    </div>
  );
}