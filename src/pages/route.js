import React, { useState, useEffect, useRef } from "react";
import { API_URL2 } from "../utils/constant";
// import { useCookies } from "react-cookie";
import { useParams, useLocation } from "react-router-dom";
import goongjs from "@goongmaps/goong-js";
import polyline from "@mapbox/polyline";

function Route() {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [cookies] = useCookies(["token"]);
  const { id } = useParams();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const response = await fetch(`${API_URL2}/api/admin/route/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
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
    };

    if (token) {
      fetchRouteDetails();
    }
  }, [id, token]);

  useEffect(() => {
    const initializeMap = () => {
      goongjs.accessToken = "L1LNCc8swfaja1zv79dWYohDOn1hrkFyi2Kw00sF";

      const newMap = new goongjs.Map({
        container: mapRef.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [
          parseFloat(route.route[0].longitude),
          parseFloat(route.route[0].latitude),
        ],
        zoom: 12,
      });

      newMap.on("load", () => {
        setMap(newMap);

        route.route.forEach((stop, index) => {
          const markerElement = document.createElement("div");
          markerElement.className = "custom-marker";
          markerElement.innerHTML = `<span>${index + 1}</span>`;

          const marker = new goongjs.Marker({ element: markerElement })
            .setLngLat([parseFloat(stop.longitude), parseFloat(stop.latitude)])
            .addTo(newMap);

          const popup = new goongjs.Popup({
            offset: 10,
            className: "custom-popup",
          }).setHTML(
            `<div>
              <p><strong>${stop.customer_name}</strong></p>
              <p>${stop.address}</p>
            </div>`
          );

          markerElement.addEventListener("mouseenter", () =>
            marker.setPopup(popup).togglePopup()
          );
          markerElement.addEventListener("mouseleave", () =>
            marker.togglePopup()
          );
        });
      });
    };

    if (route) {
      initializeMap();
    }
  }, [route]);

  useEffect(() => {
    if (map && route) {
      const coordinates = route.route.map((stop) => [
        parseFloat(stop.latitude),
        parseFloat(stop.longitude),
      ]);

      const getDirection = async (startPoint, endPoint) => {
        const url = `https://rsapi.goong.io/Direction?origin=${startPoint.join(
          ","
        )}&destination=${endPoint.join(
          ","
        )}&vehicle=car&api_key=sAOS9801oH13hSZORoMX3EZy2WzCbRSPWakuMjv9`;

        const response = await fetch(url);
        const data = await response.json();
        return data;
      };

      const getRouteLegs = async () => {
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

      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      getRouteLegs()
        .then((legs) => {
          if (map.getSource("route")) {
            map.removeLayer("route");
            map.removeSource("route");
          }

          legs.forEach((leg, index) => {
            const legGeometry = polyline.decode(leg.overview_polyline.points);
            const geometry = legGeometry.map(([latitude, longitude]) => [
              longitude,
              latitude,
            ]);

            const color = getRandomColor();

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
          });

          const bounds = new goongjs.LngLatBounds();
          legs.forEach((leg) => {
            const legGeometry = polyline.decode(leg.overview_polyline.points);
            legGeometry.forEach(([latitude, longitude]) => {
              bounds.extend([longitude, latitude]);
            });
          });
          map.fitBounds(bounds, { padding: 50 });
        })
        .catch((error) => {
          console.error("Error fetching route:", error);
        });
    }
  }, [map, route]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto pt-2">
      <h2 className="text-2xl font-bold mb-2">Route Details</h2>
      <div className="mb-2">
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-bold">ID</td>
              <td className="border px-4 py-2">{route.id}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Plan ID</td>
              <td className="border px-4 py-2">{route.plan_id}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Departure Depot</td>
              <td className="border px-4 py-2">{route.depot_name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Total Demand (kg)</td>
              <td className="border px-4 py-2">
                {parseFloat(route.total_demand)}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">
                Total Distance (km)
              </td>
              <td className="border px-4 py-2">{route.total_distance}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">
                Total Time Travel (minutes)
              </td>
              <td className="border px-4 py-2">{route.total_time_serving}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Is Served</td>
              <td className="border px-4 py-2">
                {route.is_served ? "Yes" : "No"}
              </td>
            </tr>
            {/* <tr>
              <td className="border px-4 py-2 font-bold">Created At</td>
              <td className="border px-4 py-2">{route.created_at}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Updated At</td>
              <td className="border px-4 py-2">{route.updated_at}</td>
            </tr> */}
          </tbody>
        </table>
      </div>
      <div className="mb-1">
        <label className="block font-bold mb-2">Route:</label>
        <div className="bg-gray-100 pt-1 pb-2 pl-4 rounded-md">
          <ol className="list-decimal pl-4">
            {route.route.map((stop) => (
              <li key={stop.id} className="mb-2">
                {stop.address}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {/* Add map component here */}
      <div
        className="mb-4"
        style={{ width: "100%", height: "400px" }}
        ref={mapRef}
      ></div>
      <style>
        {`
    .custom-marker {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      background-color: #ffffff;
      border: 2px solid #ff0000;
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
      color: #ff0000;
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
  `}
      </style>
      {/* <Link
        to="/plan"
        className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Plan
      </Link> */}
    </div>
  );
}

export default Route;
