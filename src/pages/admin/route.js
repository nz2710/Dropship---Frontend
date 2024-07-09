import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import goongjs from "@goongmaps/goong-js";
import polyline from "@mapbox/polyline";
import { formatNumber } from "../../utils/commonUtils";
import { API_URL2 } from "../../utils/constant"

function Route() {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const fetchRouteDetails = useCallback(async () => {
    try {
      let response = await fetch(`${API_URL2}/api/admin/route/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setRoute(data.data);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch route details");
      }
    } catch (error) {
      console.error("Error fetching route details:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [id, token]);

  const initializeMap = useCallback(() => {
    if (!route) return;

    const createMarkerElement = (index, stop) => {
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";

      if (index === 0 || index === route.route.length - 1) {
        markerElement.innerHTML = `<img src="/images/warehouse.png" alt="Warehouse" />`;
      } else {
        markerElement.innerHTML = `
          <div class="marker-container">
            <img src="/images/pin.png" alt="Stop" />
            <span class="marker-number">${index}</span>
          </div>
        `;
      }

      return markerElement;
    };

    const createPopup = (index, stop) => {
      const popup = new goongjs.Popup({
        offset: 10,
        className: "custom-popup",
      });

      if (index === 0 || index === route.route.length - 1) {
        popup.setHTML(`
          <div>
            <p><strong>${stop.depot_name}</strong></p>
            <p>Address: ${stop.address}</p>
            <p>Phone: ${stop.phone}</p>
          </div>
        `);
      } else {
        popup.setHTML(`
          <div>
            <p><strong>${stop.code_order}</strong></p>
            <p>Customer: ${stop.customer_name}</p>
            <p>Address: ${stop.address}</p>
            <p>Phone: ${stop.phone}</p>
            <p>Price: ${formatNumber(stop.price)} VND</p>
          </div>
        `);
      }

      return popup;
    };

    const getRouteLegs = async (coordinates) => {
      const legs = [];
      for (let i = 0; i < coordinates.length - 1; i++) {
        const startPoint = coordinates[i];
        const endPoint = coordinates[i + 1];
        const data = await getDirection(startPoint, endPoint);
        if (data.routes && data.routes.length > 0) {
          legs.push(data.routes[0]);
        }
      }
      return legs;
    };

    const getDirection = async (startPoint, endPoint) => {
      let url = `https://rsapi.goong.io/Direction?origin=${startPoint.join(
        ","
      )}&destination=${endPoint.join(
        ","
      )}&vehicle=car&api_key=sAOS9801oH13hSZORoMX3EZy2WzCbRSPWakuMjv9`;
      let response = await fetch(url);
      return await response.json();
    };

    const addRouteLayer = (map, index, geometry, color) => {
      map.addSource(`route-${index}`, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: geometry,
          },
        },
      });

      map.addLayer({
        id: `route-${index}`,
        type: "line",
        source: `route-${index}`,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": 6,
        },
      });
    };

    const addRouteArrows = (map, index) => {
      const arrowIconUrl = "/images/direction.png";

      map.loadImage(arrowIconUrl, (error, image) => {
        if (error) throw error;
        if (!map.hasImage("direction")) {
          map.addImage("direction", image);
        }
        map.addLayer({
          id: `route-arrows-${index}`,
          type: "symbol",
          source: `route-${index}`,
          layout: {
            "symbol-placement": "line",
            "icon-image": "direction",
            "icon-size": 0.05,
            "symbol-spacing": 15,
            "icon-rotation-alignment": "map",
            "icon-keep-upright": false,
          },
        });
      });
    };

    const fitMapToBounds = (map, legs) => {
      const bounds = new goongjs.LngLatBounds();
      legs.forEach((leg) => {
        const legGeometry = polyline.decode(leg.overview_polyline.points);
        legGeometry.forEach(([latitude, longitude]) => {
          bounds.extend([longitude, latitude]);
        });
      });
      map.fitBounds(bounds, { padding: 50 });
    };

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    goongjs.accessToken = "L1LNCc8swfaja1zv79dWYohDOn1hrkFyi2Kw00sF";

    const newMap = new goongjs.Map({
      container: mapRef.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [
        parseFloat(route.route[0].longitude),
        parseFloat(route.route[0].latitude),
      ],
      zoom: 12,
      maxZoom: 17,
    });

    newMap.on("load", () => {
      mapInstanceRef.current = newMap;

      const addMarkersToMap = (map) => {
        route.route.forEach((stop, index) => {
          const markerElement = createMarkerElement(index, stop);
          const marker = new goongjs.Marker({ element: markerElement })
            .setLngLat([parseFloat(stop.longitude), parseFloat(stop.latitude)])
            .addTo(map);

          const popup = createPopup(index, stop);

          markerElement.addEventListener("mouseenter", () =>
            marker.setPopup(popup).togglePopup()
          );
          markerElement.addEventListener("mouseleave", () =>
            marker.togglePopup()
          );
        });
      };

      const drawRouteOnMap = async (map) => {
        const coordinates = route.route.map((stop) => [
          parseFloat(stop.latitude),
          parseFloat(stop.longitude),
        ]);

        const legs = await getRouteLegs(coordinates);

        legs.forEach((leg, index) => {
          const legGeometry = polyline.decode(leg.overview_polyline.points);
          const geometry = legGeometry.map(([latitude, longitude]) => [
            longitude,
            latitude,
          ]);

          const color = getRandomColor();

          addRouteLayer(map, index, geometry, color);
          addRouteArrows(map, index);
        });

        fitMapToBounds(map, legs);
      };

      addMarkersToMap(newMap);
      drawRouteOnMap(newMap);
    });
  }, [route]);

  useEffect(() => {
    if (token) {
      fetchRouteDetails();
    }
  }, [fetchRouteDetails, token]);

  useEffect(() => {
    if (route) {
      initializeMap();
    }
  }, [route, initializeMap]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Route Details</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <RouteInfoTable route={route} />
        <RouteFinancialTable route={route} />
      </div>
      <RouteList route={route} />
      <div className="mt-8 h-[600px] w-full" ref={mapRef}></div>
      <MapStyles />
    </div>
  );
}

const RouteInfoTable = ({ route }) => (
  <table className="w-full border-collapse border border-gray-300">
    <tbody>
      {[
        { label: "ID", value: route.id },
        { label: "Plan ID", value: route.plan_id },
        { label: "Departure Depot", value: route.depot_name },
        {
          label: "Total Distance (km)",
          value: formatNumber(route.total_distance),
        },
        {
          label: "Total Time (minutes)",
          value: formatNumber(route.total_time_serving),
        },
        {
          label: "Total Demand (kg)",
          value: formatNumber(route.total_demand),
        },
        { label: "Alternative", value: route.alternative ? "Yes" : "No" },
        { label: "Is Served", value: route.is_served ? "Yes" : "No" },
        {
          label: "Created At",
          value: new Date(route.created_at).toLocaleString(),
        },
      ].map(({ label, value }) => (
        <tr key={label}>
          <td className="border border-gray-300 px-4 py-2 font-bold bg-gray-100">
            {label}
          </td>
          <td className="border border-gray-300 px-4 py-2">{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const RouteFinancialTable = ({ route }) => (
  <table className="w-full border-collapse border border-gray-300">
    <tbody>
      {[
        { label: "Moving Cost", value: formatNumber(route.moving_cost) },
        { label: "Labor Cost", value: formatNumber(route.labor_cost) },
        { label: "Total Cost", value: formatNumber(route.fee) },
        { label: "Shipping Fee", value: formatNumber(route.unloading_cost) },
        {
          label: "Total Order Value",
          value: formatNumber(route.total_order_value),
        },
        {
          label: "Total Order Profit",
          value: formatNumber(route.total_order_profit),
        },
        { label: "Route Value", value: formatNumber(route.total_route_value) },
        { label: "Profit", value: formatNumber(route.profit) },
      ].map(({ label, value }) => (
        <tr key={label}>
          <td className="border border-gray-300 px-4 py-2 font-bold bg-gray-100">
            {label}
          </td>
          <td className="border border-gray-300 px-4 py-2">{value} VND</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const RouteList = ({ route }) => (
  <div className="mt-8">
    <h3 className="text-xl font-bold mb-4">Route Stops:</h3>
    <ol className="list-decimal pl-6 bg-gray-100 p-4 rounded-md shadow">
      {route.route.map((stop, index) => (
        <li key={`${stop.id}-${index}`} className="mb-2">
          {stop.address}
          {(index === 0 || index === route.route.length - 1) && stop.depot_name && (
            <span className="ml-2 text-blue-600">
              {stop.depot_name}
            </span>
          )}
        </li>
      ))}
    </ol>
  </div>
);

const MapStyles = () => (
  <style jsx>{`
    .custom-marker {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .custom-marker img {
      width: 30px;
      height: 30px;
    }
    .marker-container {
      position: relative;
    }
    .marker-number {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
    }
    .custom-popup .mapboxgl-popup-content {
      padding: 10px;
      font-size: 12px;
    }
    .custom-popup .mapboxgl-popup-content p {
      margin: 0;
      line-height: 1.2;
    }
    .custom-popup .mapboxgl-popup-tip {
      border-top-color: #ffffff;
    }
  `}</style>
);

export default Route;
