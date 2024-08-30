export const arrivalPorts = {
  newYork: { lat: 40.7128, lng: -74.006 },
  losAngeles: { lat: 33.7405, lng: -118.2755 },
  houston: { lat: 29.7499, lng: -95.3584 },
  atlanta: { lat: 32.0809, lng: -81.0912 }, // Savannah (nearest seaport to Atlanta)
  vancouver: { lat: 49.2827, lng: -123.1207 },
  oakland: { lat: 37.8044, lng: -122.2711 },
};


export const originPorts = {
  istanbul: { lat: 41.0082, lng: 28.9784 },
  guangzhou: { lat: 23.1291, lng: 113.2644 },
  shanghai: { lat: 31.2304, lng: 121.4737 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  genoa: { lat: 44.4056, lng: 8.9463 },
  hamburg: { lat: 53.5511, lng: 9.9937 },
};



export const arrivalMarkers = [
      { position: arrivalPorts.newYork, label: "New York" },
      { position: arrivalPorts.losAngeles, label: "Los Angeles" },
      { position: arrivalPorts.houston, label: "Houston" },
      { position: arrivalPorts.atlanta, label: "Atlanta" },
      { position: arrivalPorts.vancouver, label: "Vancouver" },
      { position: arrivalPorts.oakland, label: "Oakland" },
    ];

export const originMarkers = [
      { position: originPorts.istanbul, label: "Istanbul" },
      { position: originPorts.guangzhou, label: "Guangzhou" },
      { position: originPorts.shanghai, label: "Shanghai" },
      { position: originPorts.mumbai, label: "Mumbai" },
      { position: originPorts.genoa, label: "Genoa" },
      { position: originPorts.hamburg, label: "Hamburg" },
    ];

//shipment arrival port and origin lng/lat here.