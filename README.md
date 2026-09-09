# Project Aquifer Web App

## Purpose

Project Aquifer Web App is a custom engineering project workspace developed for the ME 443 Capstone project at George Mason University.

The application provides the Project Aquifer team with a centralized location to organize tasks, meetings, CAD records, components, budget information, and project progress.

---

# Technologies

- HTML
- CSS
- JavaScript
- Browser Local Storage

---

# Application Structure

## Dashboard

The dashboard provides a summary of the project including:

- Current project phase
- Project progress
- Budget usage
- Open tasks
- Next meeting
- CAD record count
- Component count
- Completed meeting records

The project phase and progress can be edited directly from the dashboard.

---

## Tasks

The task management system allows users to:

- Add tasks
- Assign tasks
- Add due dates
- Complete tasks
- Reopen tasks
- Delete tasks
- View open and completed work

Tasks are saved using browser localStorage.

---

## Meetings

The meeting system allows users to:

- Schedule meetings
- Add date and time
- Add meeting location
- Add an agenda
- Complete meetings
- Record meeting summaries and notes
- Record decisions made
- Record action items
- Edit completed meeting notes
- Reopen meetings
- Delete meetings

Completed meetings become permanent meeting records inside the Completed Meetings section.

---

## CAD Library

The CAD Library currently tracks metadata for engineering design files.

Users can record:

- CAD model name
- Part / assembly / drawing type
- Revision
- Owner
- Design status
- File name
- Design notes

Actual cloud file upload and browser-based 3D visualization will be added in a later version.

---

## Components / BOM

The component system allows users to record:

- Component name
- Subsystem
- Quantity
- Unit cost
- Supplier
- Procurement status
- Engineering notes

The application automatically calculates:

- Total project component cost
- Remaining project budget
- Purchased component count

The current capstone material budget is $6,000.

---

# Data Storage

Version 1 currently uses browser localStorage.

This means project information remains available after refreshing the browser on the same computer.

A future version will replace localStorage with a shared online database so all Project Aquifer team members can access and edit the same project information.

---

# Planned Future Development

- Shared cloud database
- Team user accounts
- Permissions
- CAD file uploads
- 3D assembly viewer
- Requirements tracking
- Testing records
- Engineering decisions
- Issues / risk tracking
- Project timeline
- Sponsor view
- File revision history
- Cloud deployment

---

# Development Log

## September 2026

### Initial Setup

- Created Project-Aquifer directory
- Installed Visual Studio Code
- Created HTML, CSS, and JavaScript project structure
- Built first Project Aquifer dashboard

### Task System

- Added task creation
- Added assignment and due dates
- Added task completion
- Added task deletion
- Added localStorage persistence

### Meeting System

- Added meeting scheduling
- Added meeting agendas
- Added automatic next-meeting display
- Added completed meeting workflow
- Added meeting summaries and notes
- Added decision records
- Added action items
- Added meeting note editing and reopening

### Engineering Workspace

- Added CAD Library
- Added CAD revision tracking
- Added Components / BOM page
- Added automatic project budget calculation
- Added editable project phase and progress