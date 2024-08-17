import React from 'react'


function Shipment({ shipment }) {
  return (
    <div className="bg-white shadow-md p-3 mb-4 rounded-lg hover:text-blue-600 transition-colors">
      {/* <h2 className="text-xl font-semibold mb-2">
        Shipment to {shipment.arrival_port}
      </h2>
      <p className="mb-1">Arrival: {shipment.arrival_time}</p>
      <p className="mb-1">Departure: {shipment.departure_time}</p>
      <p className="mb-1">Origin: {shipment.origin}</p>
      <p>Status: {shipment.status}</p> */}

      <table class="border-separate border border-slate-500 ...">
        <thead>
          <tr>
            <th class="border border-slate-600 ...">Vessel Name</th>
            <th class="border border-slate-600 ...">Arrival Time</th>
            <th class="border border-slate-600 ...">Origin</th>
            <th class="border border-slate-600 ...">Departure Time</th>
            <th class="border border-slate-600 ...">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-700 ...">{shipment.vessel_name}</td>
            <td class="border border-slate-700 ...">{shipment.arrival_time}</td>
            <td class="border border-slate-700 ...">{shipment.origin}</td>
            <td class="border border-slate-700 ...">{shipment.departure_time}</td>
            <td class="border border-slate-700 ...">{shipment.status}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Shipment;