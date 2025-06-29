# Create Protocol Feature

## Overview

The Create Protocol feature allows users to build custom wellness protocols by selecting up to 8 biohacks from a comprehensive catalogue. This feature is part of the broader Protocols section of the Everla app.

## 🎯 Key Features

### 🧭 Top Navigation Bar
- **Fixed navigation** with EVERLA logo, navigation buttons (Home, Protocols, Insights)
- **Right-side icons**: Search, Checklist, Chat, Notifications, Profile
- **Active state highlighting** for current page
- **Responsive design** for mobile and desktop

### 🗂️ Protocols Page Context
- **Sub-tabs**: "Create a Protocol" (active) and "Protocol Catalogue"
- **Underline indicators** for active sections
- **Seamless navigation** between protocol creation and browsing

### 🔍 Search & Filter System
- **Real-time search** with debounced input (300ms delay)
- **Category filtering** with dynamically generated tabs
- **Favourites tab** showing user's favourited biohacks
- **Clear search functionality** with X button

### 🧱 Biohack Cards
- **Grid layout** (5 columns on large screens, responsive on smaller screens)
- **Hover effects** with three action icons:
  - ℹ️ **Info**: Detailed tooltip with description, scores, and metadata
  - ⭐ **Favourite**: Toggle favourite status
  - ➕ **Add to Protocol**: Add to current protocol (max 8)
- **Visual feedback** for selected and favourited states
- **Score bars** showing effectiveness and difficulty

### ➕ Protocol Builder Bar
- **Fixed bottom bar** that stays visible while scrolling
- **Horizontal scrollable** selected hacks display (5 visible at once)
- **Empty slot placeholders** with dashed borders
- **Remove functionality** with X buttons on each hack
- **Scroll indicator** when more than 5 hacks are selected

### 📊 Real-time Score Calculation
- **Four metric bars**: Effectiveness, Difficulty, Time Investment, Cost
- **Dynamic updates** as hacks are added/removed
- **Average calculation** across all selected hacks
- **Color-coded bars** for easy identification

### 📝 Protocol Form
- **Protocol name** (required, unique per user)
- **Description** (optional, 500 character limit)
- **Save Protocol**: Creates draft protocol
- **Save & Activate**: Creates and activates protocol immediately
- **My Protocols button**: Navigation to saved protocols

## 🗄️ Database Schema

### Required Tables

#### `biohacks`
```sql
- id (uuid, primary key)
- name (text, not null)
- description (text)
- category (text)
- efficacy_score (integer, 0-100)
- difficulty_score (integer, 0-100)
- time_investment_score (integer, 0-100)
- cost_score (integer, 0-100)
- image_url (text)
```

#### `hack_favourited`
```sql
- user_id (uuid, foreign key to auth.users)
- hack_id (uuid, foreign key to biohacks)
- timestamp (timestamp with time zone)
```

#### `protocols`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- name (text, not null)
- description (text)
- status (text: 'draft', 'active', 'completed')
- created_at (timestamp with time zone)
- activated_at (timestamp with time zone, nullable)
- completed_at (timestamp with time zone, nullable)
```

#### `protocol_hacks`
```sql
- id (uuid, primary key)
- protocol_id (uuid, foreign key to protocols)
- hack_id (uuid, foreign key to biohacks)
- position (integer, 0-7)
```

## 🧩 Component Architecture

### Main Components

1. **`CreateProtocol.js`** - Main container component
   - Manages state for biohacks, filters, selections
   - Handles data fetching and protocol saving
   - Coordinates between child components

2. **`TopNavigation.js`** - Global navigation bar
   - Logo and navigation buttons
   - Right-side action icons
   - Active page highlighting

3. **`BiohackCard.js`** - Individual biohack display
   - Image, name, and score bars
   - Hover overlay with action buttons
   - Info tooltip with detailed information

4. **`CategoryTabs.js`** - Filter tabs
   - Dynamic category generation
   - Active state management
   - Horizontal scrolling

5. **`SearchBar.js`** - Search functionality
   - Debounced input handling
   - Clear button
   - Search icon

6. **`ProtocolBuilder.js`** - Bottom protocol builder
   - Selected hacks display
   - Score calculation and display
   - Protocol form and save actions

### CSS Files
- `CreateProtocol.css` - Main layout and grid styles
- `TopNavigation.css` - Navigation bar styling
- `BiohackCard.css` - Card and tooltip styles
- `CategoryTabs.css` - Tab styling and scrolling
- `SearchBar.css` - Search input styling
- `ProtocolBuilder.css` - Bottom bar and form styles

## 🚀 Getting Started

### Prerequisites
- React 18+
- React Router DOM 6+
- Supabase client configured
- Required database tables created

### Installation
1. Ensure all components are in `src/components/`
2. Add route to `App.js`:
   ```jsx
   <Route path="/protocols/create" element={<CreateProtocol />} />
   ```
3. Update navigation to include Protocols link

### Database Setup
1. Create the required tables in Supabase
2. Set up Row Level Security (RLS) policies
3. Insert sample biohack data
4. Configure authentication

### RLS Policies Required
```sql
-- Allow authenticated users to read biohacks
CREATE POLICY "Allow authenticated users to read biohacks" ON biohacks
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to manage their own favourites
CREATE POLICY "Users can manage their own favourites" ON hack_favourited
FOR ALL USING (auth.uid() = user_id);

-- Allow users to manage their own protocols
CREATE POLICY "Users can manage their own protocols" ON protocols
FOR ALL USING (auth.uid() = user_id);

-- Allow users to manage their own protocol hacks
CREATE POLICY "Users can manage their own protocol hacks" ON protocol_hacks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM protocols 
    WHERE protocols.id = protocol_hacks.protocol_id 
    AND protocols.user_id = auth.uid()
  )
);
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#4a9eff`
- **Secondary Blue**: `#6bb3ff`
- **Background**: `#0a0e1a` to `#1a1f2e` gradient
- **Text**: `#ffffff` (primary), `#a0a0a0` (secondary)
- **Borders**: `rgba(255, 255, 255, 0.1)`

### Typography
- **Font Family**: System fonts (Inter, -apple-system, BlinkMacSystemFont)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Base Unit**: 0.25rem (4px)
- **Common Spacings**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem

### Responsive Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px
- **Large Desktop**: > 1440px

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Client Setup
Ensure `window.supabase` is available globally or import from `src/supabase.js`.

## 🧪 Testing

### Manual Testing Checklist
- [ ] Navigation between pages works correctly
- [ ] Search functionality filters biohacks
- [ ] Category tabs filter correctly
- [ ] Favourites tab shows user's favourites
- [ ] Biohack cards display hover effects
- [ ] Info tooltips show detailed information
- [ ] Favourite toggle works
- [ ] Add to protocol works (max 8)
- [ ] Remove from protocol works
- [ ] Score bars update in real-time
- [ ] Protocol form validation works
- [ ] Save protocol creates database entries
- [ ] Save & activate sets correct status
- [ ] Responsive design works on mobile

### Automated Testing
Run the test script to verify database connectivity:
```bash
node test-protocol-tables.js
```

## 🐛 Troubleshooting

### Common Issues

1. **Biohacks not loading**
   - Check Supabase connection
   - Verify RLS policies
   - Check browser console for errors

2. **Protocol save fails**
   - Ensure user is authenticated
   - Check protocol name uniqueness
   - Verify database permissions

3. **Favourites not working**
   - Check user authentication
   - Verify hack_favourited table exists
   - Check RLS policies

4. **Responsive issues**
   - Test on different screen sizes
   - Check CSS media queries
   - Verify grid layout breakpoints

## 📱 Mobile Considerations

- **Touch-friendly** button sizes (minimum 44px)
- **Swipe gestures** for horizontal scrolling
- **Optimized grid** (2 columns on mobile)
- **Collapsible sections** for better UX
- **Keyboard navigation** support

## 🔮 Future Enhancements

- **Drag & drop** reordering of selected hacks
- **Protocol templates** for quick creation
- **Social sharing** of protocols
- **Advanced filtering** (price range, time commitment)
- **Protocol recommendations** based on user preferences
- **Bulk operations** (select multiple hacks at once)
- **Offline support** with local storage
- **Protocol versioning** and history

## 📄 License

This feature is part of the Everla project. Please refer to the main project license for usage terms. 