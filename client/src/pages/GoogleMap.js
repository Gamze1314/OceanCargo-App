//import API Provider, Map Markers vis.gl
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { arrivalMarkers, originMarkers } from "../data/portCoordinates";
import { useState , useContext } from "react"
import { Context } from '../context/Context';

// this components renders Google Map with customer's shipment information marked.(arrival time, freight rate, departure time.) when customer clicks on the marker.
// user is able to scroll around the map, w zooming and panning.

// ArrivalPorts: New York, Los Angeles, Houston, Atlanta, Vancouver, Oakland
//Origin Ports: Istanbul, Guangzhou, Shanghai, Mumbai, Genoa, Hamburg

function GoogleMap() {
  console.log("GoogleMap component rendered");
  const [isOrigin, setIsOrigin] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState([]);
  const { shipments } = useContext(Context);

  // update state to show updated information on Map, if a shipment gets deleted or updated.

  // Handle arrival port click
  function handleArrivalPortClick(port) {
    const portShipments = shipments.filter(
      (shipment) => shipment.arrival_port === port
    );
    setIsOrigin(false);
    setSelectedShipment(portShipments);
  }

  // Handle origin port click
  function handleOriginPortClick(port) {
    const originShipments = shipments.filter(
      (shipment) => shipment.origin === port
    );
    setIsOrigin(true);
    setSelectedShipment(originShipments);
  }

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        // center={{ lat: 40.7128, lng: -74.006 }}, center removed, to fix zoomin in to new york only. default is set to new york.
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }} // initial center
        defaultZoom={3} // inital zoom when map first loads.
        gestureHandling={"greedy"} // map will capture all gestures, zoom in, scrolling, and panning for touch-screen devices.
        onClick={() =>
          alert("Click on the markers to see the details of each shipment.")
        } // Add map click event
      >
        {/* update marker labels depending on arrival or origin port */}
        {arrivalMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position} // to see a marker on the map, position property needs to be set.
            label={marker.label} // label to differentiate markers:
            clickable={true}
            onClick={() => handleArrivalPortClick(marker.label)}
          />
        ))}
        {originMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position} // to see a marker on the map, position property needs to be set.
            label={marker.label} // label to differentiate ports
            clickable={true}
            onClick={() => handleOriginPortClick(marker.label)}
          />
        ))}
        ;
      </Map>
      {selectedShipment && (
        <MarkerContainer shipment={selectedShipment} isOrigin={isOrigin} />
      )}
    </APIProvider>
  );
}



function MarkerContainer({ shipment, isOrigin }) {

return (
  <div className="absolute bottom-0 left-0 p-4 bg-white shadow-lg rounded-lg max-w-lg">
    {shipment.map((s, index) => (
      <div key={index} className="mb-2 border-b pb-2 text-md text-red-900">
        Shipment Details
        <ul>
          <li className="text-md text-blue-800">
            Ocean rate: ${s.freight_rate}
          </li>
          {/* Check if containers exist */}
          {s.containers.length > 0 ? (
            s.containers.map((c, containerIndex) => (
              <li key={containerIndex} className="text-md text-blue-800">
                <div>
                  Container: {c.container_number} - {c.container_type}
                </div>
                <div>Container price: ${c.price}</div>
              </li>
            ))
          ) : (
            <li className="text-md text-red-800">
              No registered container to display.
            </li>
          )}
        </ul>
        {/* Conditionally render Arrival Port or Departure Port based on isOrigin */}
        {isOrigin ? (
          <div className="text-md text-blue-800">
            Arrival Port: {s.arrival_port}
          </div>
        ) : (
          <div className="text-md text-blue-800">
            Departure Port: {s.origin}
          </div>
        )}
      </div>
    ))}
  </div>
);
}


export default GoogleMap


// GoogleMap component that uses the APIProvider and Map components from @vis.gl/react-google-maps.
// process.env.apiKey =>  access the env variable
// APIprovider component initializes and manages Google Maps JS API within the app. We wrap Map component with APIProvider to make sure, API is ready before the map is rendered.
// useCallback: ensures that only the function identity changes when dependencies change.



// click handler:
// when user clicks on the marker:
//display: container number, total cost, arrival time.


// access container numbers from customersShipment container_number property.
// hold selected shipment in different state.(upon click event)
// display a div box with cont number, and other info.
