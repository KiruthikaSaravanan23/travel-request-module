# Travel Request Module

A standalone, production-ready React application for managing **Travel Requests**, ported and adapted with the exact calculation engine, validation schemas, fields, and workflows from the Expense project.

---

## 🚀 Features & Capabilities

### 1. Trip & Request Management (`MyTrips`)
- **KPI Summary Cards**: Live counts for Total Trips, Active Trips, Pending Approvals, and Drafts.
- **Search & Status Filtering**: Filter by keyword (destination, trip name, ID, or purpose) and status (`All`, `Active`, `Draft`, `Completed`, `Rejected`).
- **Comprehensive Trips Table**: Route legs summary, requested budget vs approved budget, status badges, and quick actions.
- **Multi-Version Expansion**: Trips with multiple revisions can be expanded to inspect and manage individual versions (`v1`, `v2`, etc.).
- **Full Action Lifecycle**:
  - `Create Travel Request`
  - `Edit` (Draft mode)
  - `Submit for Approval`
  - `Withdraw Request`
  - `Delete Request / Trip`
  - `Mark Complete`
  - `+ Add Revision / Itinerary Leg`

### 2. Form & Calculation Engine (`TravelRequestForm`)
- **Basic Information**:
  - Trip Name (Required)
  - Travel Type: `Domestic` / `International`
  - Purpose of Travel (Required)
  - Duration Type: `One Day`, `Round Trip`, `Multi City`
- **One Day Trip Rule**: Automatically displays the **Boarding Allowance** banner (*"One day trips are claimed as a boarding allowance. No lodging is required"*).
- **Dynamic Destinations**:
  - Origin & Destination city selectors
  - Project code association (`PRJ-001`, `PRJ-002`, etc.)
  - Start Date & End Date (labeled "Return Date" for round trips) with date order validations
  - Travel Mode (`Flight`, `Train`, `Bus`, `Own vehicle`)
  - Preferred Time of Travel slots (`Early morning 12am-6am`, `Morning 6am-11am`, `Noon`, `Afternoon`, `Evening`, `Night`)
  - For **Multi-City trips**: Dynamic addition/removal of legs with auto-chaining of cities (next leg's departure defaults to previous leg's arrival).
- **Accommodation & Vehicle Requirements**:
  - Hotel Accommodation toggle: Dynamic hotel list (Name, Location, Check-in, Check-out).
  - Vehicle / Local Transport toggle: Dynamic vehicle list (Date, Category: Airport transfer/Local commute/Rental/Company vehicle, Mode: Cab/Rental/Bus/Train/Own vehicle, Notes).
- **Per Diem Cost Engine (`useEligibleCost`)**:
  - Calculates travel days (`getDurationInDays(start, end)`) and hotel nights (`getNightsCount(check_in, check_out)`).
  - Matches destinations against tier per-diem rates for meals and lodging.
  - Automatically derives and locks `Estimated Cost` in real-time.
  - **Estimated Cost Breakdown Popover**: Shows exact breakdown of Accommodation Cost, Meals Cost, and Grand Total.
- **Additional Budget & Advance Payout**:
  - Additional Cost input with INR formatting.
  - Reason for Additional Cost (mandatory if additional cost > 0).
  - Advance Needed toggle with Advance Amount input.
  - Advance validation: Advance amount cannot exceed Estimated Cost + Additional Cost.

### 3. Detailed Request View (`TripDetails`)
- Breadcrumb navigation with status badge.
- Official Travel Authorization banner (`TRIP-2026-XXX`).
- Employee Information & Trip Classification cards.
- Full destination leg details, accommodations, and transport legs.
- Advance disbursement status.
- Approval chain log with reviewer comments and decision timestamps.

### 4. Review & Approval Modal (`ReviewTripDialog`)
- Approve or Reject travel requests.
- Rejection reason / comments enforcement.
- Approved advance amount configuration.

---

## 📁 Project Directory Structure

```text
travel/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   └── utils.ts
│   ├── types/
│   │   └── trips.type.ts
│   ├── services/
│   │   └── travelService.ts
│   ├── helpers/
│   │   ├── constants/
│   │   │   └── trips.ts
│   │   ├── hooks/
│   │   │   └── useEligibleCost.ts
│   │   ├── utils/
│   │   │   └── tripFormMapper.ts
│   │   └── zod-schema/
│   │       ├── commonSchema.ts
│   │       └── travelRequestFormSchema.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── switch.tsx
│   │   │   └── tabs.tsx
│   │   └── common/
│   │       ├── AppAccordion.tsx
│   │       ├── ConfigureSheet.tsx
│   │       ├── ConfirmAlertDialog.tsx
│   │       ├── FormDateField.tsx
│   │       ├── FormInputField.tsx
│   │       ├── FormSelectField.tsx
│   │       ├── FormSwitchField.tsx
│   │       ├── GradientOutlineButton.tsx
│   │       └── SelectDropdown.tsx
│   └── pages/
│       └── Trip/
│           └── components/
│               ├── BasicTripInformation.tsx
│               ├── BoardingAllowanceSection.tsx
│               ├── DestinationFields.tsx
│               ├── DestinationsList.tsx
│               ├── EstimatedCostBreakdown.tsx
│               ├── FormTabSelectElement.tsx
│               ├── FormTimeSlotField.tsx
│               ├── HotelFields.tsx
│               ├── HotelsList.tsx
│               ├── MyTrips.tsx
│               ├── ReviewTripDialog.tsx
│               ├── TravelRequestForm.tsx
│               ├── TripDetails.tsx
│               ├── TripNeedsSection.tsx
│               ├── TripRequestsTable.tsx
│               ├── TripStatusBadge.tsx
│               ├── VehicleFields.tsx
│               └── VehiclesList.tsx
```

---

## 🏃 Running the Application

```bash
# Start Vite development server
npm run dev

# Build for production
npm run build
```

