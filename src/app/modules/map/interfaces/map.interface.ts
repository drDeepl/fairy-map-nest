import { Topology, GeometryCollection } from 'topojson-specification';

interface EthnicGroupPoint {
  idPoint: number;
  ethnicGroupId: number;
  ethnicGroupName: string;
  latitude: number;
  longitude: number;
}

interface FeatureProperties {
  id: string;
  name: string;
  shapeGroup: string;
  shapeID: string;
  shapeISO: string;
  shapeType: string;
  ethnicGroupsPoints: EthnicGroupPoint[];
}

export interface MapTopology extends Topology {
  objects: {
    map: GeometryCollection<FeatureProperties>;
  };
}
