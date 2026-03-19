/* TFS PUBLISH | constants.js | Version 41 | March 18, 2026 */

var PLATFORMS = [
  { id: "shared", label: "Shared", icon: "fa-solid fa-share-nodes", color: "#f97316", special: true },
  { id: "editing", label: "Editing", icon: "fa-solid fa-scissors", color: "#2563eb", special: true },
  { id: "tiktok", label: "TikTok", icon: "fa-brands fa-tiktok", color: "#ff0050", by: "Robert", via: "TikTok Studio" },
  { id: "instagram", label: "Instagram", icon: "fa-brands fa-instagram", color: "#E1306C", by: "Robert", via: "Native app" },
  { id: "youtube", label: "YouTube", icon: "fa-brands fa-youtube", color: "#FF0000", by: "Robert", via: "YouTube Studio" },
  { id: "fb_personal", label: "FB Pers", icon: "fa-solid fa-user", color: "#4267B2", by: "Robert", via: "Native app" },
  { id: "fb_page", label: "FB Page", icon: "fa-brands fa-facebook", color: "#1877F2", by: "Robert", via: "Meta Business Suite" },
  { id: "fb_groups", label: "Groups", icon: "fa-solid fa-users", color: "#3b5998", by: "Miza", via: "Native app" },
  { id: "x", label: "X", icon: "fa-brands fa-x-twitter", color: "#444", by: "Robert", via: "Browser (x.com)" },
  { id: "reddit", label: "Reddit", icon: "fa-brands fa-reddit-alien", color: "#FF4500", by: "Robert", via: "Browser" },
];
var REAL_PLATFORMS = PLATFORMS.filter(function(p) { return !p.special; });

var VERSIONS = [
  { id: "a", label: "A: Talking Head", short: "A", music: "Trending sound in TikTok app" },
  { id: "b", label: "B: Caption React", short: "B", music: "Ambient/cinematic from Envato" },
  { id: "c", label: "C: B-Roll", short: "C", music: "Atmospheric from Envato" },
];

var CONTENT_TYPES = [
  { id: "none", label: "Not Set", short: "" },
  { id: "personal", label: "Personal Story", short: "PS" },
  { id: "world", label: "World / Lore", short: "WL" },
  { id: "bts", label: "Behind the Scenes", short: "BTS" },
  { id: "pitch", label: "Book Pitch", short: "BP" },
  { id: "craft", label: "Writing Craft", short: "WC" },
  { id: "community", label: "Community / Fan", short: "CF" },
  { id: "collab", label: "Collab / Feature", short: "CO" },
];

var SALESY_LEVELS = [
  { id: "none", label: "No Mention", color: "#22c55e", target: "30-40%" },
  { id: "soft", label: "Soft", color: "#f59e0b", target: "30-40%" },
  { id: "full", label: "Full", color: "#ef4444", target: "20-30%" },
];

var ALGO_WORDS = ["sexual content","sex","nudity","nude","porn","gore","graphic violence","suicide","self-harm","drugs","abuse","kill","die","dies","died","death","dead","murder","violence","assault","blood","shooting","weapon"];
var ALGO_SAFE = {"sexual content":"graphic content","sex":"graphic content","nudity":"graphic content","gore":"gratuitous darkness","graphic violence":"gratuitous violence","kill":"delete/erase","die":"get deleted","dies":"gets deleted","died":"got deleted","death":"final bow","dead":"gone","murder":"erasure","drugs":"substances","suicide":"unalive","self-harm":"self-unalive","abuse":"mistreatment","blood":"aftermath","shooting":"incident","weapon":"tool","assault":"confrontation","violence":"conflict"};

var SCHED_NOTES = {
  tiktok: "TikTok Studio. 10-day limit. Cannot edit after scheduling.",
  instagram: "Native app. 75-day limit.",
  youtube: "YouTube Studio (desktop). No limit.",
  fb_personal: "Native app (mobile). Professional mode required.",
  fb_page: "Meta Business Suite (desktop).",
  fb_groups: "Next-day task (Miza). Share from live FB Personal post.",
  x: "Manual only. No scheduling without X Premium.",
  reddit: "Manual post via browser.",
};

var EDITING_CL = {
  steph: [
    "Edit raw footage per version style (A: Talking Head, B: Caption React, C: B-Roll Cinematic)",
    "Add auto-captions in Filmora, correct proper nouns (Exousia, Cass, Evelon, Prism Spire)",
    "Add zoom frames (split-and-scale method)",
    "Add on-screen text overlay keywords for indexing (from Shared Fields)",
    "Export: 1080x1920, 30fps, H.264, MP4, no watermark",
    "Upload to Filmora Cloud and mark ready for review"
  ],
  robert: [
    "Review exports in Filmora",
    "Add trending sound natively per platform (TikTok, Instagram, YouTube Shorts, Facebook)",
    "Note: Instagram auto-mutes original audio when trending audio is added",
    "Export final and upload to Google Drive"
  ],
};

/* ========================================
   POSTING STEP CHECKLISTS (single flow per platform)
   Each step matches the exact walkthrough from 3/18/26
   ======================================== */

var CHECKLISTS = {
  tiktok: [
    "Upload video to TikTok Studio",
    "Add trending music (adjust to 3% or lower if original music on video)",
    "Add stickers/polls",
    "Verify on-screen indexing text visible (evergreen + topic phrases)",
    "Add 'Add Yours' sticker",
    "Add description (caption)",
    "Verify CTA (one per post, matches assigned type)",
    "Verify hashtags (4 total: 1 anchor + 1-2 genre + 0-1 comp)",
    "Check for better 'Add Yours' after description populates options",
    "More Options ON: comments, reuse, English, similar products, high quality, save to device",
    "More Options OFF: AI generated content, watermark, audience controls",
    "Everyone can view",
    "Schedule or post now (10-day limit, cannot edit after scheduling)"
  ],
  instagram: [
    "Native app > + > Reel",
    "Upload video",
    "Add trending music (auto-mutes original audio; 3% if original music)",
    "Add stickers/polls",
    "Verify on-screen indexing text visible",
    "Add description",
    "Verify hashtags (3-5: #thefirststone + 4 discovery)",
    "Verify CTA",
    "Link Reel (if relevant, 2+ Reels published)",
    "Add Prompt (pins question to top of comments)",
    "Audience: everyone",
    "Sharing: Threads OFF, Facebook OFF, Facebook Stories ON",
    "Schedule Reel",
    "More Options ON: highest quality, closed captions, translate captions, allow download",
    "More Options OFF: don't let others use, hide likes, hide shares; commenting ON"
  ],
  youtube: [
    "YouTube Studio (desktop)",
    "Upload video (auto-detected as Short if 9:16 and under 3 min)",
    "Add title",
    "Verify visibility is Public (YT Studio sometimes flips to Private)",
    "Schedule (date and time)",
    "Verify 'Not made for kids'",
    "Add description + hashtags (2-3 in description)",
    "Verify CTA",
    "Link Video (if relevant)",
    "Add to playlist (if relevant)",
    "Paid promotion: NO",
    "Collaborations: comments ON, show likes ON, shorts remixing ON",
    "Altered content: NO",
    "Category: People and Blogs",
    "Verify tags (30 universal tags auto-applied via upload defaults, add 1-2 topic-specific)",
    "License: Standard YouTube License, allow embedding",
    "Upload"
  ],
  yt_community: [
    "YouTube native app > channel > view channel > Community tab",
    "Make poll",
    "Write description (use main post description as base)",
    "CTA at top of post",
    "Add divider between description and hashtags/promo",
    "Add hashtags (they work in community posts)",
    "Add poll answers/options",
    "Post"
  ],
  fb_personal: [
    "Verify Instagram Story 1 cross-posted successfully",
    "Native app",
    "Upload video",
    "Add trending music (3% if original music)",
    "Add description (casual Robert voice, same as FB Groups/YT Community)",
    "Add title (match YouTube Shorts title)",
    "Schedule first (greys out some options)",
    "Share to your story: ON",
    "Add to playlist (if relevant)",
    "Public",
    "Closed captions: ON",
    "Schedule"
  ],
  fb_page: [
    "Meta Business Suite",
    "Select Reel",
    "Upload video",
    "Add music",
    "Add tags/stickers",
    "Add description",
    "Schedule"
  ],
  fb_groups: [],
  x: [
    "Desktop (x.com in browser)",
    "Use screenshot from main video (NOT the video itself)",
    "Use main post caption",
    "Add image description (alt text, generated)",
    "Remove promo line",
    "Reduce to exactly 2 hashtags",
    "Post now (no scheduling without X Premium)"
  ],
  reddit: [],
};

/* ========================================
   STORY CHECKLISTS (per platform, per story type)
   Story 1 = pre-post (before scheduled post goes live)
   Story 2 = after main post goes live
   Story 3 = personal angle (pre-recorded Canva or selfie)
   ======================================== */

var STORY_CHECKLISTS = {
  tiktok: {
    s1: [
      "Make in Canva (screenshot from video without text overlay)",
      "Upload via regular TikTok app",
      "Add trending music at 3% volume",
      "Add poll/stickers (edit answers if needed)",
      "Add mention sticker (@worldofexousia)",
      "Add 'Add Yours' sticker (if relevant)",
      "Post"
    ],
    s2: [
      "Go to live posted video",
      "Share arrow > 'Add to Story'",
      "Add text sticker with context",
      "Add trending music at 3% volume",
      "Post"
    ],
    s3: [
      "Upload pre-made Canva video",
      "Add trending music at 3% volume",
      "Add stickers if appropriate",
      "Add mention sticker (@worldofexousia)",
      "Post"
    ]
  },
  instagram: {
    s1: [
      "Upload pre-made Canva image",
      "Add stickers/polls (edit answers as needed)",
      "Add trending music at 3% volume",
      "Add caption (story caption field)",
      "Facebook connected stories: ON",
      "Post"
    ],
    s2: [
      "Go to live Reel",
      "Share arrow > 'Add to Story'",
      "Add text sticker with context",
      "Add trending music at 3% volume",
      "Fill story caption field",
      "Facebook connected stories: ON",
      "Post"
    ],
    s3: [
      "Upload pre-made Canva video",
      "Add trending music at 3% volume",
      "Add stickers if appropriate",
      "Add mention sticker (@worldofexousia)",
      "Fill story caption field",
      "Facebook connected stories: ON",
      "Post"
    ]
  },
  fb_personal: {
    s1: [
      "Verify cross-post from Instagram arrived. If not, upload manually."
    ],
    s2: [
      "Go to live posted video",
      "Share to story",
      "Add text sticker with context",
      "Add trending music at 3% volume",
      "Post",
      "FB Groups next-day sharing begins (Miza task, next morning)"
    ],
    s3: [
      "Upload pre-made Canva video",
      "Add trending music at 3% volume",
      "Add stickers if appropriate",
      "Post"
    ]
  },
  fb_page: {
    s1: [
      "Meta Business Suite > Stories",
      "Upload picture",
      "Add music",
      "Delete music sticker (music still plays)",
      "Add sticker (polls NOT available; use text sticker with question)"
    ],
    s2: [
      "Share live Reel to Page story via Meta Business Suite",
      "Add text sticker with context",
      "Add trending music at 3% volume"
    ],
    s3: [
      "Upload pre-made Canva video via Meta Business Suite",
      "Add trending music at 3% volume",
      "Add text sticker if appropriate"
    ]
  },
  x: {
    s1: [
      "Post Story 1 content as standalone regular post",
      "Use screenshot or Canva image",
      "Write standalone copy (must work on its own)",
      "Exactly 2 hashtags",
      "Post"
    ]
  },
  youtube: {},
  fb_groups: {},
  reddit: {},
};

/* ========================================
   TEMPLATE FIELDS (copy fields per platform)
   ======================================== */

var TEMPLATES = {
  tiktok: [
    { key: "copy", label: "Caption", hint: "100-300ch, 4000 max. ONE CTA.", max: 4000, multi: true },
    { key: "hashtags", label: "Hashtags", hint: "4 total: 1 anchor + 1-2 genre + 0-1 comp" }
  ],
  instagram: [
    { key: "copy", label: "Caption", hint: "125-200ch. Google indexes. ONE CTA.", max: 2200, multi: true },
    { key: "hashtags", label: "Hashtags", hint: "5 max: #thefirststone + 4" },
    { key: "prompt", label: "Comment Prompt", hint: "Pinned question at top of comments" }
  ],
  youtube: [
    { key: "title", label: "Title", hint: "100ch limit. Title Case.", max: 100 },
    { key: "description", label: "Description", hint: "Add from desktop. Hashtags go here.", multi: true },
    { key: "hashtags", label: "Hashtags", hint: "2-3 discovery, no #Shorts" },
    { key: "tags", label: "Tags", hint: "5-10 keyword tags (Show More > Attributes)" }
  ],
  fb_personal: [
    { key: "title", label: "Title", hint: "Match YouTube Shorts title" },
    { key: "copy", label: "Caption", hint: "Casual Robert. No hashtags/CTAs.", multi: true }
  ],
  fb_page: [
    { key: "copy", label: "Caption", hint: "Polished brand voice. Links in comment only.", multi: true },
    { key: "reel_title", label: "Reel Title", hint: "Required" },
    { key: "hashtags", label: "Hashtags", hint: "0-1" }
  ],
  fb_groups: [],
  x: [
    { key: "copy", label: "Caption", hint: "280 max. Sentence case.", max: 280, multi: true },
    { key: "hashtags", label: "Hashtags", hint: "2 exactly" },
    { key: "screenshot", label: "Screenshot", hint: "Screenshot from main video (NOT video). Image post." },
    { key: "altText", label: "Alt Text", hint: "Image description for accessibility" }
  ],
  reddit: [
    { key: "title", label: "Title", hint: "Post title" },
    { key: "copy", label: "Body", hint: "Post text. Follow subreddit rules.", multi: true }
  ],
};

var YT_UNIVERSAL_TAGS = "the first stone, world of exousia, Robert Biehn, fantasy books, ya books, ya fantasy, epic fantasy, dystopian books, scifi books, dark fantasy, debut author, writing life, worldbuilding, found family, sibling bonds, morally grey, elemental powers, regime oppression, shadow and bone, an ember in the ashes, red rising, booktok, fantasy book recommendations, books like shadow and bone, fantasy series, hunger games, fourth wing, mistborn, children of blood and bone, ya lit";

var INDEX_EVERGREEN_DEFAULT = "YA dystopian fantasy author";

var FB_GROUPS_PROTOCOL = {
  source: "Share Robert's personal profile post (NOT the Page post)",
  timing: "Morning after each posting day (Tue/Thu/Sat for Mon/Wed/Fri posts)",
  pace: "6-7 groups per hour, max 20 groups per day",
  total: "30 groups total, rotate which go first",
  tracking: "Google Sheet with 'Last Shared Date' column",
  safety: "If CAPTCHAs appear, stop immediately"
};

var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var WDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

var ST_C = { not_started: "#cbd5e1", drafted: "#f59e0b", posted: "#3b82f6", done: "#22c55e" };
var ST_L = { not_started: "Not Started", drafted: "Drafted", posted: "Posted", done: "Done" };
var M_ST_C = { no_media: "#ccc", raw_uploaded: "#f59e0b", in_editing: "#a855f7", edited: "#3b82f6", final: "#22c55e" };
var M_ST_L = { no_media: "No Media", raw_uploaded: "Uploaded", in_editing: "Editing", edited: "Edited", final: "Final" };

var MAX_DAYS = 65;

var PLAT_CHAR_LIMITS = { tiktok: 4000, instagram: 2200, youtube: 5000, fb_page: 63206, fb_personal: 63206, x: 280, reddit: 40000 };
var PLAT_HASHTAG_LIMITS = { tiktok: 4, instagram: 5, youtube: 3, fb_page: 1, fb_personal: 0, fb_groups: 0, x: 2, reddit: 0 };
var TRENDING_PLATFORMS = ["tiktok","instagram","youtube","fb_page","fb_personal"];

var XP_VALUES = { shared: 20, platform: 50, comment: 30, story: 20, group: 2 };
var COMP_TAGS = ["#grishaverse","#shadowandbone","#redrising","#childrenofbloodandbone","#anemberintheashes"];
