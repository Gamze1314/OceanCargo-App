//import API Provider, Map Markers vis.gl
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { arrivalMarkers, originMarkers } from "./data/portCoordinates";
import { useOutletContext } from 'react-router-dom'
import { useState } from "react"

// this components renders Google Map with customer's shipment information marked.(arrival time, freight rate, departure time.) when customer clicks on the marker.
// user is able to scroll around the map, w zooming and panning.

// ArrivalPorts: New York, Los Angeles, Houston, Atlanta, Vancouver, Oakland
//Origin Ports: Istanbul, Guangzhou, Shanghai, Mumbai, Genoa, Hamburg



function GoogleMap() {
    const [isOrigin, setIsOrigin] = useState(false)
    const [selectedShipments, setSelectedShipments] = useState([])
    const { customerContainers } = useOutletContext()


    function handleArrivalPortClick(port) {
        console.log(port);
        // Find shipments arriving into this port
        // Filter shipments where arrival_port matches the port clicked
        console.log("arrival port clicked");
        const portShipments = customerContainers.filter(
        (shipment) => shipment.arrival_port === port
        );
        console.log(portShipments);
        setIsOrigin(false)
        setSelectedShipments(portShipments)

    }


    function handleOriginPortClick(port) {
        //find shipments originating from this port.
        //display markerContainer with departure time if origin port is clicked
        console.log("origin port clicked")
        const originShipments = customerContainers.filter((shipment) => shipment.origin === port)
        console.log(originShipments)
        setIsOrigin(true)
        setSelectedShipments(originShipments)

    }
 


  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        // center={{ lat: 40.7128, lng: -74.006 }}, center removed, to fix zoomin in to new york only. default is set to new york.
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }} // initial center
        defaultZoom={3} // inital zoom when map first loads.
        gestureHandling={"greedy"} // map will capture all gestures, zoom in, scrolling, and panning for touch-screen devices.
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
      {selectedShipments && (
        <MarkerContainer
          selectedShipments={selectedShipments}
          isOrigin={isOrigin}
        />
      )}
    </APIProvider>
  );
}


function MarkerContainer({ selectedShipments, isOrigin }) {
  console.log(selectedShipments);

  // Check if there are any selected shipments and if isOrigin is true
  if (selectedShipments.length > 0) {
    return (
      <div className="absolute bottom-0 left-0 p-4 bg-white shadow-lg rounded-lg max-w-lg">
        {selectedShipments.map((shipment, index) => (
          <div key={index} className="mb-2 border-b pb-2 text-md text-red-900">
            {index + 1}. Shipment
            <li className="text-md text-blue-800">
              Container: {shipment.container_number} - {shipment.container_type}
            </li>
            <li className="text-md text-blue-800">
              Container price: ${shipment.container_price}
            </li>
            <li className="text-md text-blue-800">
              Ocean rate: ${shipment.ocean_rate}
            </li>
            {/* Conditionally render Arrival Port or Departure Port based on isOrigin */}
            {isOrigin ? (
              <li className="text-md text-blue-800">
                Departure Port: {shipment.departure_port}
              </li>
            ) : (
              <li className="text-md text-blue-800">
                Arrival Port: {shipment.arrival_port}
              </li>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Return null if no shipments
  return null;
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
