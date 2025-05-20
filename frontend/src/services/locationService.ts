import { getPlatform } from "./platformService";

export type Coordinate = [number, number];

export const getLocationAsync = (): Promise<Coordinate> => {
  const platform = getPlatform();

  switch (platform) {
    case "Browser":
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject("Geolocation is not supported by this browser.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;
            resolve([lon, lat]);
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                reject("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                reject("The request to get user location timed out.");
                break;
              default:
                reject("An unknown error occurred.");
                break;
            }
          },
          {
            enableHighAccuracy: true,
          }
        );
      });
    case "WebView":
      // TODO
      throw new Error();
  }
};
