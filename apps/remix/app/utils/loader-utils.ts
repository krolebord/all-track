import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

export const useMatchedData = (routeId: string): unknown => {
  const matches = useMatches();

  const route = useMemo(
    () => matches.find((x => x.id === routeId)),
    [matches, routeId]
  );
  
  return route?.data;
};


