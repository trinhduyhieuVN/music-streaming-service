# Activity Diagram: Play Music

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ACTIVITY DIAGRAM - PLAY MUSIC                            │
│                              (Black & White Version)                             │
└─────────────────────────────────────────────────────────────────────────────────┘

     USER                    │         MUSIC STREAM SERVICE (System)
                             │
        ●                    │
        │                    │
        ▼                    │
   ┌─────────┐               │
   │ Click   │               │
   │ song to │               │
   │  play   │               │
   └────┬────┘               │
        │                    │
        │ Trigger            │
        └───────────────────────────────►┌──────────────────┐
                             │           │   useOnPlay()    │
                             │           │  hook triggered  │
                             │           └────────┬─────────┘
                             │                    │
                             │                    ▼
                             │           ╱────────────────╲
                             │          ╱   User logged    ╲           ┌──────────┐
                             │         │       in?          │──── No ──►│   Show   │
                             │          ╲                  ╱           │   Auth   │
                             │           ╲────────────────╱            │  Modal   │
                             │                    │                    └────┬─────┘
                             │                   Yes                        │
                             │                    │                         │
                             │                    ▼                         │
                             │           ┌──────────────────┐               │
                             │           │ player.setId()   │               │
                             │           │ player.setIds()  │◄──────────────┘
                             │           │  (set playlist)  │         User logs in
                             │           └────────┬─────────┘
                             │                    │
                             │                    ▼
                             │           ┌──────────────────┐
                             │           │  useLoadSongUrl  │
                             │           │    (Get URL      │
                             │           │  from Supabase   │
                             │           │    Storage)      │
                             │           └────────┬─────────┘
                             │                    │
                             │                    ▼
                             │           ╱────────────────╲
                             │          ╱   Song URL       ╲         ┌──────────┐
                             │         │      valid?        │── No ──►│ Display  │
                             │          ╲                  ╱         │  error   │
                             │           ╲────────────────╱          │ message  │
                             │                    │                  └────┬─────┘
                             │                  Valid                     │
                             │                    │                       │
                             │                    ▼                       │
                             │           ┌──────────────────┐             │
                             │           │   Initialize     │◄────────────┘
                             │           │  useSound hook   │
                             │           │ with song URL    │
                             │           └────────┬─────────┘
                             │                    │
                             │                    ▼
                             │           ┌──────────────────┐
   ┌─────────┐               │           │     Render       │
   │ Listen  │◄──────────────────────────│ PlayerContent    │
   │   to    │               │           │   component      │
   │  music  │               │           └────────┬─────────┘
   └────┬────┘               │                    │
        │                    │                    ▼
        │                    │           ┌──────────────────┐
        │                    │           │  sound.play()    │
        │                    │           │   Auto-play      │
        │                    │           └────────┬─────────┘
        │                    │                    │
        │                    │                    ▼
        ▼                    │           ╱────────────────╲
   ┌─────────┐               │          ╱   Song ended?    ╲
   │ Control │               │         │                    │
   │playback │               │          ╲                  ╱
   │(Play/   │               │           ╲────────────────╱
   │Pause/   │               │              │           │
   │Next/    │               │             Yes         No/Stop
   │Previous)│               │              │           │
   └────┬────┘               │              ▼           ▼
        │                    │      ┌──────────────┐   ●
        │  User action       │      │  onPlayNext  │
        └───────────────────────────►│ (play next  │
                             │      │   song in    │
                             │      │   playlist)  │
                             │      └──────┬───────┘
                             │             │
                             │             ▼
                             │             ●


Legend:
───────────────────────────
● = Start/End point (filled black circle)
┌─────┐ = Process/Action (rectangle)
╱─────╲ = Decision (diamond)
  │,▼  = Flow direction (arrows)
───────────────────────────

ACTORS:
1. USER (left swimlane) - ●  Black filled circle for start
2. MUSIC STREAM SERVICE (right swimlane) - System processes

KEY FLOWS:
- No overlapping arrows (all flows organized vertically or with clear horizontal connections)
- Clear separation between user actions and system processes
- All decision points clearly marked with Yes/No paths
```

## Implementation Details

### Corresponding Code Components:

1. **useOnPlay hook** → [hooks/useOnPlay.ts](../hooks/useOnPlay.ts)
2. **Auth check** → `if (!user) return authModal.onOpen()`
3. **Player state** → `player.setId()` and `player.setIds()`
4. **URL loading** → [hooks/useLoadSongUrl.ts](../hooks/useLoadSongUrl.ts)
5. **Sound initialization** → [components/PlayerContent.tsx](../components/PlayerContent.tsx)
6. **Auto-play on end** → `onend` callback in useSound hook
7. **Play next** → `onPlayNext()` function

### Key Features Shown:
- ✅ Authentication check
- ✅ Modal display for non-authenticated users
- ✅ Song URL retrieval from Supabase Storage
- ✅ Error handling for invalid URLs
- ✅ Sound initialization with useSound
- ✅ Auto-play functionality
- ✅ Playback controls (Play/Pause/Next/Previous)
- ✅ Queue management with repeat and shuffle
