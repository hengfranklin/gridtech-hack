// Simplified GeoJSON polygons for NY utility service territories
// These are approximate boundaries for visualization purposes

export interface UtilityTerritory {
  provider: string;
  name: string;
  color: string;
  coordinates: [number, number][][]; // Array of polygon rings [lng, lat]
}

export const utilityTerritories: UtilityTerritory[] = [
  {
    provider: 'con_edison',
    name: 'Con Edison',
    color: '#059669',
    coordinates: [
      [
        // NYC + lower Westchester
        [-74.05, 40.50], // Staten Island south
        [-74.20, 40.55],
        [-74.25, 40.64], // NJ border
        [-74.02, 40.70], // Manhattan west
        [-73.97, 40.82], // Upper Manhattan
        [-73.91, 40.88], // Bronx north
        [-73.83, 40.91],
        [-73.73, 40.93],
        [-73.73, 41.02], // Westchester
        [-73.68, 41.10],
        [-73.62, 41.15],
        [-73.55, 41.17],
        [-73.48, 41.12],
        [-73.63, 40.99],
        [-73.70, 40.92],
        [-73.72, 40.85],
        [-73.74, 40.78], // Queens east
        [-73.73, 40.72],
        [-73.76, 40.60], // Brooklyn south
        [-74.00, 40.52], // Staten Island
        [-74.05, 40.50],
      ],
    ],
  },
  {
    provider: 'national_grid',
    name: 'National Grid',
    color: '#2563eb',
    coordinates: [
      [
        // Upstate — Syracuse/Albany/Buffalo corridor
        [-79.10, 42.70],
        [-78.60, 42.95],
        [-78.00, 43.10],
        [-77.40, 43.25],
        [-76.80, 43.30],
        [-76.20, 43.20],
        [-75.60, 43.10],
        [-75.10, 43.00],
        [-74.50, 42.90],
        [-73.90, 42.80],
        [-73.70, 42.65],
        [-73.65, 42.45],
        [-73.80, 42.25],
        [-74.10, 42.15],
        [-74.60, 42.10],
        [-75.10, 42.05],
        [-75.80, 42.10],
        [-76.50, 42.15],
        [-77.20, 42.30],
        [-77.80, 42.40],
        [-78.40, 42.50],
        [-79.00, 42.55],
        [-79.10, 42.70],
      ],
    ],
  },
  {
    provider: 'pseg_li',
    name: 'PSEG Long Island',
    color: '#7c3aed',
    coordinates: [
      [
        // Long Island
        [-73.72, 40.72],
        [-73.60, 40.74],
        [-73.40, 40.73],
        [-73.10, 40.78],
        [-72.70, 40.82],
        [-72.30, 40.88],
        [-71.90, 40.95],
        [-71.85, 41.05],
        [-72.00, 41.10],
        [-72.50, 41.10],
        [-72.80, 41.05],
        [-73.10, 40.97],
        [-73.30, 40.92],
        [-73.50, 40.88],
        [-73.60, 40.85],
        [-73.65, 40.80],
        [-73.72, 40.72],
      ],
    ],
  },
  {
    provider: 'central_hudson',
    name: 'Central Hudson',
    color: '#dc2626',
    coordinates: [
      [
        // Hudson Valley
        [-74.40, 41.20],
        [-74.10, 41.35],
        [-73.90, 41.55],
        [-73.75, 41.75],
        [-73.65, 41.95],
        [-73.55, 42.10],
        [-73.70, 42.15],
        [-73.95, 42.10],
        [-74.20, 42.00],
        [-74.50, 41.85],
        [-74.70, 41.65],
        [-74.75, 41.45],
        [-74.65, 41.30],
        [-74.40, 41.20],
      ],
    ],
  },
  {
    provider: 'nyseg',
    name: 'NYSEG',
    color: '#ea580c',
    coordinates: [
      [
        // Southern Tier / Finger Lakes
        [-79.70, 42.00],
        [-79.00, 42.00],
        [-78.30, 42.00],
        [-77.60, 42.00],
        [-76.90, 42.00],
        [-76.20, 42.00],
        [-75.50, 42.00],
        [-75.00, 42.00],
        [-75.00, 42.35],
        [-75.30, 42.55],
        [-75.80, 42.50],
        [-76.30, 42.45],
        [-76.80, 42.40],
        [-77.40, 42.45],
        [-78.00, 42.45],
        [-78.60, 42.40],
        [-79.20, 42.30],
        [-79.70, 42.20],
        [-79.70, 42.00],
      ],
    ],
  },
  {
    provider: 'rge',
    name: 'RG&E',
    color: '#0891b2',
    coordinates: [
      [
        // Rochester area
        [-77.90, 43.00],
        [-77.55, 43.15],
        [-77.30, 43.25],
        [-77.10, 43.30],
        [-77.00, 43.20],
        [-77.05, 43.05],
        [-77.15, 42.95],
        [-77.35, 42.90],
        [-77.55, 42.90],
        [-77.75, 42.92],
        [-77.90, 43.00],
      ],
    ],
  },
  {
    provider: 'orange_rockland',
    name: 'Orange & Rockland',
    color: '#ca8a04',
    coordinates: [
      [
        // Rockland / Orange counties
        [-74.35, 41.00],
        [-74.10, 41.05],
        [-73.95, 41.10],
        [-73.90, 41.20],
        [-73.95, 41.30],
        [-74.10, 41.35],
        [-74.30, 41.40],
        [-74.55, 41.35],
        [-74.70, 41.25],
        [-74.65, 41.10],
        [-74.50, 41.02],
        [-74.35, 41.00],
      ],
    ],
  },
];

// DAC (Disadvantaged Community) areas — approximate polygons
export const dacAreas = [
  {
    name: 'South Bronx',
    coordinates: [
      [-73.93, 40.80], [-73.90, 40.82], [-73.87, 40.84],
      [-73.85, 40.82], [-73.87, 40.80], [-73.90, 40.79], [-73.93, 40.80],
    ] as [number, number][],
  },
  {
    name: 'East Harlem',
    coordinates: [
      [-73.95, 40.79], [-73.93, 40.80], [-73.93, 40.82],
      [-73.96, 40.81], [-73.97, 40.80], [-73.95, 40.79],
    ] as [number, number][],
  },
  {
    name: 'Central Brooklyn',
    coordinates: [
      [-73.97, 40.67], [-73.93, 40.68], [-73.92, 40.66],
      [-73.93, 40.64], [-73.96, 40.64], [-73.97, 40.67],
    ] as [number, number][],
  },
  {
    name: 'East Brooklyn',
    coordinates: [
      [-73.90, 40.67], [-73.86, 40.68], [-73.85, 40.66],
      [-73.87, 40.64], [-73.90, 40.65], [-73.90, 40.67],
    ] as [number, number][],
  },
  {
    name: 'Southeast Queens',
    coordinates: [
      [-73.78, 40.68], [-73.74, 40.70], [-73.73, 40.67],
      [-73.75, 40.65], [-73.78, 40.66], [-73.78, 40.68],
    ] as [number, number][],
  },
];
