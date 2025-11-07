import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ট্র্যাক আইকন (SVG)
const TrackIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <!-- Background Circle -->
  <circle cx="24" cy="24" r="22" fill="url(#grad)" stroke="#1E293B" stroke-width="2"/>
  
  <!-- Dashed Path (behind) -->
  <path d="M10 24 Q18 18, 24 24 T 38 24" stroke="#60A5FA" stroke-width="3" fill="none" 
        stroke-dasharray="6 6" opacity="0.6"/>
  
  <!-- Location Pin -->
  <path d="M24 30 L20 20 Q22 16, 24 16 Q26 16, 28 20 L24 30 Z" fill="#3B82F6"/>
  <circle cx="24" cy="20" r="4" fill="#1E40AF"/>
  <circle cx="24" cy="20" r="6" fill="#60A5FA" opacity="0.4"/>
  
  <!-- Gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
</svg>
`;

const trackIconUrl = `data:image/svg+xml;base64,${btoa(TrackIconSVG)}`;

const Maplanimation = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const trackMarker = useRef(null);
  const polyline = useRef(null);
  const [progress, setProgress] = useState(0);

  const routePath = [
    [23.6850, 90.3563],
    [23.8103, 90.4125],
    [23.8730, 90.3998],
    [24.0958, 90.4093],
    [24.3745, 91.0166],
    [24.8949, 91.8687],
    [23.4610, 91.1808],
    [22.3569, 91.7832],
  ];

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      }).setView([23.7, 90.7], 8);

      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
      }).addTo(mapInstance.current);

      // ট্র্যাক আইকন
      const trackIcon = L.divIcon({
        html: `
          <div class="relative">
            <img src="${trackIconUrl}" class="w-12 h-12 drop-shadow-lg"/>
            <!-- Pulse Ring -->
            <div class="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-75"></div>
            <div class="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse"></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        className: 'custom-track-icon',
      });

      trackMarker.current = L.marker(routePath[0], { icon: trackIcon }).addTo(mapInstance.current);

      // পাথ লাইন (অ্যানিমেটেড ড্যাশ)
      polyline.current = L.polyline([], {
        color: '#60A5FA',
        weight: 5,
        opacity: 0.9,
        dashArray: '12, 8',
        dashOffset: '0',
      }).addTo(mapInstance.current);

      // অ্যানিমেটেড ড্যাশ
      let dashOffset = 0;
      const animateDash = () => {
        dashOffset -= 1;
        polyline.current.setStyle({ dashOffset: dashOffset.toString() });
        requestAnimationFrame(animateDash);
      };
      animateDash();

      // স্টার্ট ও এন্ড
      L.circleMarker(routePath[0], { radius: 10, fillColor: '#10B981', color: '#065F46', weight: 3 })
        .addTo(mapInstance.current)
        .bindTooltip("শুরু: ঢাকা", { direction: 'top' });

      L.circleMarker(routePath[routePath.length - 1], { radius: 10, fillColor: '#EF4444', color: '#991B1B', weight: 3 })
        .addTo(mapInstance.current)
        .bindTooltip("গন্তব্য: চট্টগ্রাম", { direction: 'top' });
    }

    // ৩০ সেকেন্ড লুপ
    let startTime = Date.now();
    const duration = 30000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) % duration;
      const t = elapsed / duration;
      setProgress(t * 100);

      const totalSteps = routePath.length - 1;
      const segment = Math.floor(t * totalSteps);
      const segmentProgress = (t * totalSteps) % 1;

      if (segment < totalSteps) {
        const start = routePath[segment];
        const end = routePath[segment + 1];
        const lat = start[0] + (end[0] - start[0]) * segmentProgress;
        const lng = start[1] + (end[1] - start[1]) * segmentProgress;

        trackMarker.current?.setLatLng([lat, lng]);
        polyline.current?.setLatLngs(routePath.slice(0, segment + 1).concat([[lat, lng]]));
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <section className="py-16 px-6 bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
        </motion.div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 h-[500px] bg-black/50">
          <div ref={mapRef} className="w-full h-full" />

          {/* ট্র্যাক স্ট্যাটাস কার্ড */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-0 left-4 bg-black/80 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-xl max-w-xs"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                <TrackPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">ট্র্যাক #PKG-789</h3>
                <p className="text-xs text-green-400">চলমান</p>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">অবস্থান:</span>
                <span className="text-blue-400">কুমিল্লা</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ETA:</span>
                <span className="text-yellow-400">২ ঘণ্টা ১৫ মিনিট</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-1">{progress.toFixed(0)}%</p>
            </div>
          </motion.div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur px-3 py-1.5 rounded-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-cyan-500 border-t-transparent rounded-full"
            />
            <span className="text-xs text-cyan-300">লাইভ ট্র্যাকিং</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ট্র্যাক পিন আইকন
const TrackPin = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

export default Maplanimation;