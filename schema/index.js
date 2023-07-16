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
    getStationsByName(name: String!): [Station]
    getNearbyStations(latitude: Float!, longitude: Float!, maxDistanceFromOrigin: Float, config: ConfigInput): [Station]
    getTidePredictionsByStationId (stationId: String!, beginDate: String, endDate: String, config: ConfigInput): [Tide]
  }

  enum Unit {
    metric
    english
  }
`;