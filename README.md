
# Starfield Outpost Optimizer

A professional-grade logistical tool for Starfield explorers. Calculate the minimum number of outposts needed to manufacture complex components like Aldumite Drilling Rigs or Vytinium Fuel Rods.

## Core Capabilities

- **Recursive Blueprint Analysis**: Automatically breaks down Tier 4 items into raw extracted resources.
- **Planetary Network Optimization**: Greedy algorithm identifies the most efficient set of planets to cover all resource requirements.
- **Logistics Visualization**: Generates a system topology map showing Local and Inter-System Cargo Link requirements.
- **Helium-3 Calculation**: Factors in fuel costs for long-distance transport.
- **Blueprint Previews**: Hover over any item to see its full manufacturing hierarchy.

## Technical Stack

- **React 19**: Modern UI framework.
- **Tailwind CSS**: High-performance utility styling.
- **Recharts**: Logistical data visualization.
- **TypeScript**: Type-safe resource and recipe definitions.

## Usage

1. Select the items you wish to construct from the database.
2. Click **Run Logistics**.
3. Review the recommended planetary network and Cargo Link configuration.
