
function Shipment({ shipment }) {
  return (
    <div className="bg-white shadow-md p-3 mb-4 rounded-lg hover:text-blue-600 transition-colors">
      <table className="border-separate border border-slate-500 ...">
        <thead>
          <tr>
            <th className="border border-slate-600 ...">Vessel Name</th>
            <th className="border border-slate-600 ...">Arrival Time</th>
            <th className="border border-slate-600 ...">Origin</th>
            <th className="border border-slate-600 ...">Departure Time</th>
            <th className="border border-slate-600 ...">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-700 ...">{shipment.vessel_name}</td>
            <td className="border border-slate-700 ...">{shipment.arrival_time}</td>
            <td className="border border-slate-700 ...">{shipment.origin}</td>
            <td className="border border-slate-700 ...">{shipment.departure_time}</td>
            <td className="border border-slate-700 ...">{shipment.status}</td>
          </tr>
        </tbody>
      </table>
      <p>This shipment is currently under "{shipment.status}" status. For more details, please submit a booking request.</p>
    </div>
  );
}

export default Shipment;