# Project: [Vocab App]

## Stack
- Backend: Flask (Python)
- Frontend: Vue.js SPA
- Auth: [Flask-Login, JWT]

## Current Status
App is operational. Login works. Next focus: get the sockets/multiplayer game working again.

## Recent Fixes (2026-06-05)
- Redis hostname corrected (`singapore-keyvalue.render.com`)
- redis-py upgraded to 4.6.0 (ACL auth support)
- ENABLE_EXTERNALS defaults to "1" to connect Redis locally
- SQLAlchemy pool_pre_ping added to handle stale DB connections
- Fixed KeyError in updateAccount (`returnData[classroom]` → `classroom in returnData`)
- Flask-SocketIO: added `use_reloader=False` to fix Windows binding issue

## Structure
- /app or /backend — Flask routes and models
- /frontend or /src — Vue components
- entry point: app.py

## Rules
- Ask before making large structural changes
- Don't touch the database schema without confirming first
-