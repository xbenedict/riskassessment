# Emoji to Icon Mapping

This document maps all existing emoji usage in the codebase to appropriate Lucide React icons.

## Navigation Icons
- 🏛️ (Sites) → `map-pin` (MapPin)
- 📊 (Dashboard) → `bar-chart-3` (BarChart3)
- 📈 (Analytics) → `trending-up` (TrendingUp)
- 📋 (Reports) → `file-text` (FileText)
- 💾 (Data Management) → `database` (Database)

## Action Icons
- ✕ (Close/Remove) → `x` (X)
- 👁️ (View) → `eye` (Eye)
- ✏️ (Edit) → `edit-3` (Edit3)
- 📷 (Add Photos) → `camera` (Camera)
- 🔍 (Search/No Results) → `search` (Search)
- 📝 (Add Assessment) → `edit-3` (Edit3)

## Status/Validation Icons
- ✅ (Success/Valid) → `check-circle` (CheckCircle)
- ⚠️ (Warning/Looting) → `alert-triangle` (AlertTriangle)

## Location Icons
- 📍 (Location/Map) → `map-pin` (MapPin)

## Chart/Data Icons
- 📊 (Charts/Assessments/Export) → `bar-chart` (BarChart)

## Threat Icons
- 🌍 (Earthquake) → `globe` (Globe)
- 🌊 (Flooding) → `waves` (Waves)
- 🌧️ (Weathering) → `cloud-rain` (CloudRain)
- 🌿 (Vegetation) → `leaf` (Leaf)
- 🏗️ (Urban Development) → `building` (Building)
- 👥 (Tourism Pressure) → `users` (Users)
- ⚔️ (Conflict) → `swords` (Swords)
- 🌡️ (Climate Change) → `thermometer` (Thermometer)
- ❓ (Unknown/Default) → `help-circle` (HelpCircle)

## Sort Icons
- ↕️ (Unsorted) → `arrow-up-down` (ArrowUpDown)
- ↑ (Ascending) → `arrow-up` (ArrowUp)
- ↓ (Descending) → `arrow-down` (ArrowDown)

## Usage Examples

```tsx
// Navigation
<Icon name="map-pin" size="md" />

// Actions
<Icon name="eye" size="sm" title="View Details" />
<Icon name="edit-3" size="sm" title="Edit Site" />

// Status
<Icon name="check-circle" size="md" color="#28a745" />
<Icon name="alert-triangle" size="md" color="#dc3545" />

// Threats
<Icon name="globe" size="lg" title="Earthquake Risk" />
<Icon name="waves" size="lg" title="Flooding Risk" />
```