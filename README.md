# SPFx Fluent UI Card with Audience Targeting & Dynamic Links

A modern **SPFx web part** featuring a **Fluent UI Card** with:
- **Right-top image**
- **Title** in the same row
- **Description** with a **View More** button
- **Right-side image**

All properties are configurable via the **Property Pane**.

---

## ✨ Features

- **Audience Targeting**:
  - Active Directory (AD) Groups
  - Microsoft 365 Groups
  - Direct Users
- **Dynamic Links**:
  - Up to **8 configurable buttons** using `PropertyFieldCollectionData`
  - Each button includes **Text**, **Icon**, and **URL**
- Clicking **Description** or **View More** opens a **right-side Panel** listing all configured buttons.
- Clicking a button navigates to its respective link.

---

## 🖼️ Screenshots

### Card View
![Card View](src/webparts/rightSideButtonPane/assets/Card.png)

### Right Popup Panel
![Right Popup](src/webparts/rightSideButtonPane/assets/Right_Popup.png)

### Properties Panel
![Properties Panel](src/webparts/rightSideButtonPane/assets/Properties_panel.png)

---

## 🧰 Tech Stack

- **SharePoint Framework (SPFx)**: `1.21.1`
- **React**: `17.0.1`
- **Fluent UI (React v8)**: `^8.125.1`
- **TypeScript**: `~5.3.3`

---

## ✅ Prerequisites

- Node.js (Recommended: **18.x LTS**)
- Gulp CLI
- Office 365 tenant with App Catalog

---

## 🚀 Getting Started

```bash
npm install
gulp trust-dev-cert
gulp serve
```

Open local or SharePoint workbench to test.

---

## ⚙️ Property Pane Configuration

- **Card Properties**:
  - Title
  - Description
  - Right-top Image URL
  - Right-side Image URL
- **Audience Targeting**:
  - AD Group
  - M365 Group
  - Direct Users
- **Dynamic Buttons**:
  - Configure up to 8 buttons using `PropertyFieldCollectionData`

Example JSON:
```json
{
  "title": "Resources",
  "description": "Quick links for your team",
  "rightTopImage": "https://contoso.com/top-image.png",
  "rightSideImage": "https://contoso.com/side-image.png",
  "audience": ["GroupID", "UserPrincipalName"],
  "buttons": [
    {"text": "Portal", "icon": "Globe", "url": "https://portal.contoso.com"},
    {"text": "Helpdesk", "icon": "Help", "url": "https://help.contoso.com"}
  ]
}
```

---

## 🏗️ Build & Deploy

```bash
gulp bundle --ship
gulp package-solution --ship
```

Upload `.sppkg` to App Catalog and deploy.

---

## 📄 License

MIT License
