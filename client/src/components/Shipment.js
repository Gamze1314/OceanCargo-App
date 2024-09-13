function Shipment({ shipment }) {
  const thClass = "border border-slate-800 p-2 text-left";
  const tdClass = "border border-slate-500 p-2 font-semibold";

  return (
    <div className="bg-white shadow-md p-3 mb-4 rounded-lg hover:text-red-600 w-full sm:w-1/2 lg:w-1/2">
      <table className="w-full border-separate border border-slate-500">
        <thead>
          <tr>
            <th className={thClass}>Vessel Name</th>
            <th className={thClass}>Arrival Time</th>
            <th className={thClass}>Origin</th>
            <th className={thClass}>Departure Time</th>
            <th className={thClass}>Arrival Port</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={tdClass}>{shipment.vessel_name}</td>
            <td className={tdClass}>{shipment.arrival_time}</td>
            <td className={tdClass}>{shipment.origin}</td>
            <td className={tdClass}>{shipment.departure_time}</td>
            <td className={tdClass}>{shipment.arrival_port}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Shipment;
