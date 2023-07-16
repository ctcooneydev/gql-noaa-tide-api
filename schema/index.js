export const typeDefs = `#graphql
  type Station {
    id: ID!
    name: String!
    lat: Float!
    lng: Float!
    distance: Float
  }

  type Tide {
    t: String!
    v: String!
    type: String!
  }

  input ConfigInput {
    units: Unit
  }

  type Query {
    getNearbyStations(latitude: Float!, longitude: Float!, maxDistanceFromOrigin: Float): [Station]
    getStationsByName(name: String!): [Station]
    getTidePredictionsByStationId (stationId: String!, config: ConfigInput): [Tide]
  }

   enum Unit {
    metric
    english
  }
`;