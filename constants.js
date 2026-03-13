/* TFS PUBLISH | constants.js | Version 35 | March 12, 2026 */

var PLATFORMS = [
  { id: "stories", label: "Stories", icon: "fa-solid fa-book-open", color: "#a855f7", special: true },
  { id: "shared", label: "Shared", icon: "fa-solid fa-share-nodes", color: "#f97316", special: true },
  { id: "editing", label: "Editing", icon: "fa-solid fa-scissors", color: "#2563eb", special: true },
  { id: "tiktok", label: "TikTok", icon: "fa-brands fa-tiktok", color: "#ff0050", by: "Robert", via: "TikTok Studio" },
  { id: "instagram", label: "Instagram", icon: "fa-brands fa-instagram", color: "#E1306C", by: "Robert", via: "Native app" },
  { id: "youtube", label: "YouTube", icon: "fa-brands fa-youtube", color: "#FF0000", by: "Robert", via: "YouTube Studio" },
  { id: "fb_page", label: "FB Page", icon: "fa-brands fa-facebook", color: "#1877F2", by: "Robert", via: "Meta Business Suite" },
  { id: "fb_personal", label: "FB Pers", icon: "fa-solid fa-user", color: "#4267B2", by: "Robert", via: "Native app" },
  { id: "fb_groups", label: "Groups", icon: "fa-solid fa-users", color: "#3b5998", by: "Robert", via: "Native app" },
  { id: "x", label: "X", icon: "fa-brands fa-x-twitter", color: "#444", by: "Robert", via: "Browser" },
  { id: "threads", label: "Threads", icon: "fa-brands fa-threads", color: "#777", by: "Robert", via: "Browser" },
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
  stories: "Cannot schedule. Phone only, post natively",
  tiktok: "Schedule via TikTok Studio (not native app)",
  instagram: "Schedule via native app",
  youtube: "Schedule via YouTube Studio",
  fb_page: "Schedule via Meta Business Suite (desktop). NOT native FB app",
  fb_personal: "Post via native FB app. Share to Groups once live",
  fb_groups: "Share from live FB Personal post",
  x: "Auto-schedule via browser only (not desktop app)",
  threads: "Auto-schedule via browser only (not desktop app)",
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

var CHECKLISTS = {
  tiktok: {
    pre: ["Upload 1080x1920 9:16 MP4 H.264","Add trending sound (search in TikTok Studio)","On-screen text overlay keywords (first 2-3 sec)","Stickers: Add Yours / interactive (if applicable)","Cover image (once 9-12 posts)"],
    caption: ["2-3 keywords in caption","4 hashtags: 1 anchor + 1-2 genre + 0-1 comp","ONE CTA only"],
    settings: ["Everyone, Comments/Duets/Stitches ON","Allow downloads ON","AI disclosure toggle (if applicable)","Schedule or Post (trending = post now)"],
    post: ["Comments within 1 hour","Pin best (max 3)","Reminder: analytics 24h"],
    stories: ["Story 1: upload Canva pre-build (1080x1920), add stickers natively","Add poll or question sticker","Main post live: share to Story (Story 2)","Add text overlay to shared Story","Story 3: upload Canva pre-build (1080x1920), add stickers natively"]
  },
  instagram: {
    pre: ["Upload without watermark","Safe zone: keep text inside 1080x1420","Add IG trending audio (auto-mutes original audio)","On-screen text overlay keywords (first 2-3 sec)","Interactive stickers (if applicable)","Captions (cc) ON","Download reel to phone before posting","Edit cover image 4:5"],
    caption: ["IG caption (not TikTok copy)","2-3 keywords in caption","3-5 hashtags: #thefirststone + 4","ONE CTA","Poll button (optional: choice content)","Prompt button (pin CTA to comments)"],
    settings: ["Everyone","Threads cross-post OFF","Facebook Reels/Posts cross-post OFF","Facebook Stories ON (once connected ~3/17)","Your Story ON","Upload at Highest Quality ON","Translate Closed Captions ON","Allow Downloads ON","Allow Reel as Template ON"],
    post: ["Comments within 1 hour","Pin best (up to 3)","Insights 24h"],
    stories: ["Story 1: upload Canva pre-build (1080x1920), add stickers natively","Add poll or question sticker","Main post live: share to Story (Story 2)","Add text overlay to shared Story","Story 3: upload Canva pre-build (1080x1920), add stickers natively"]
  },
  youtube: {
    pre: ["Upload without watermark, max 60 sec, 9:16 MP4 H.264","Add trending audio"],
    caption: ["Title: keyword-rich (100 char limit)","Desc: add from DESKTOP after upload","2-3 discovery hashtags (paste into description, no #Shorts)","Tags: 5-10 keyword tags (Show More > Attributes)"],
    settings: ["Not made for kids (COPPA)","Remixing ON","Likes ON"],
    post: ["DESKTOP: Add Description","DESKTOP: Add Related Video (need 2+ videos)","Post Community Post (caption + image)","Comments within 1 hour","Analytics 24h"]
  },
  fb_page: {
    pre: ["Upload via Meta Business Suite (desktop, not native FB app)","1080x1920 9:16 MP4 H.264","Add trending audio for Reels"],
    caption: ["Page caption (polished brand voice)","0-1 hashtags","ONE CTA","NO links in caption (comment only)"],
    settings: ["Reel title + tags required","Captions ON"],
    post: ["Link as comment ONLY when tied to faction quiz (3-4x/week)","Keep link comment conversational","Comments within 1 hour","Insights 24h"]
  },
  fb_personal: {
    pre: ["Post via native FB app","Upload video or text post"],
    caption: ["Casual Robert voice","No hashtags, no CTAs","Links in comment only"],
    settings: [],
    post: ["Respond to comments","Share to Groups (see Groups tab)"]
  },
  fb_groups: {
    pre: ["Go to LIVE personal post","Tap Share > Share to a Group"],
    caption: [],
    settings: ["~9 groups per batch, 5-10 min apart","Max 20-25 groups per day"],
    post: ["Document groups shared","Note moderation queues","Rotate group list"]
  },
  x: {
    pre: ["Upload natively via browser","9:16 MP4 H.264, no watermark","No trending audio (not supported)"],
    caption: ["X caption (280 chars max)","2 hashtags exactly","ONE CTA"],
    settings: [],
    post: ["Respond to replies","Repost/quote if traction"]
  },
  threads: {
    pre: ["Post natively via browser","Video: 9:16 MP4 (if video post)","No trending audio (not supported)","Post Stories 1 and 3 as regular Threads posts"],
    caption: ["Threads caption (500 chars max)","Cold reader context (no prior awareness)","Topic tag as hashtag (e.g. #EpicFantasy)","Strong prompt/question to drive replies","ONE CTA"],
    settings: [],
    post: ["Engage with replies","Follow topic communities"]
  },
};

var TEMPLATES = {
  tiktok: [
    { key: "copy", label: "Caption", hint: "100-300ch, 800 SEO. ONE CTA in caption.", max: 800, multi: true },
    { key: "hashtags", label: "Hashtags", hint: "4 total: 1 anchor + 1-2 genre + 0-1 comp. No branded first 30 days" },
    { key: "keywords", label: "Keywords", hint: "On-screen text overlay block for indexing" },
    { key: "relatedVideo", label: "Related Video", hint: "Which content piece connects to this one" }
  ],
  instagram: [
    { key: "copy", label: "Caption", hint: "125-200ch. Google indexes. ONE CTA (link in bio OK).", max: 500, multi: true },
    { key: "hashtags", label: "Hashtags", hint: "5 max: #thefirststone + 4" },
    { key: "prompt", label: "Comment Prompt", hint: "Pinned question at top of comments" },
    { key: "keywords", label: "Keywords", hint: "On-screen text overlay block for indexing" },
    { key: "relatedVideo", label: "Related Video", hint: "Which content piece connects to this one" }
  ],
  youtube: [
    { key: "title", label: "Title", hint: "100ch limit. Title Case.", max: 100 },
    { key: "description", label: "Description", hint: "Add from desktop. Hashtags go here, count toward chars.", multi: true },
    { key: "hashtags", label: "Hashtags", hint: "2-3 discovery hashtags, no #Shorts" },
    { key: "tags", label: "Tags", hint: "5-10 keyword tags (Show More > Attributes)" },
    { key: "keywords", label: "Keywords", hint: "On-screen text overlay block for indexing" },
    { key: "relatedVideo", label: "Related Video", hint: "Which content piece connects to this one" }
  ],
  fb_page: [
    { key: "copy", label: "Caption", hint: "Polished brand voice. Links in comment only.", multi: true },
    { key: "reel_title", label: "Reel Title", hint: "Required" },
    { key: "hashtags", label: "Hashtags", hint: "0-1" },
    { key: "keywords", label: "Keywords", hint: "On-screen text overlay block for indexing" },
    { key: "relatedVideo", label: "Related Video", hint: "Which content piece connects to this one" }
  ],
  fb_personal: [
    { key: "title", label: "Title", hint: "Match YouTube Shorts title" },
    { key: "copy", label: "Caption", hint: "Casual Robert. No hashtags/CTAs.", multi: true },
    { key: "keywords", label: "Keywords", hint: "On-screen text overlay block for indexing" },
    { key: "relatedVideo", label: "Related Video", hint: "Which content piece connects to this one" }
  ],
  fb_groups: [],
  x: [
    { key: "copy", label: "Caption", hint: "280 max. Sentence case.", max: 280, multi: true },
    { key: "hashtags", label: "Hashtags", hint: "2 exactly" },
    { key: "keywords", label: "Keywords", hint: "On-screen text overlay block for indexing" },
    { key: "relatedVideo", label: "Related Video", hint: "Which content piece connects to this one" }
  ],
  threads: [
    { key: "copy", label: "Caption", hint: "500 max. Cold reader context. Strong prompt/question.", max: 500, multi: true },
    { key: "hashtags", label: "Topic Tag", hint: "0-1 topic tag as hashtag" },
    { key: "keywords", label: "Keywords", hint: "On-screen text overlay block for indexing" },
    { key: "relatedVideo", label: "Related Video", hint: "Which content piece connects to this one" }
  ],
};

var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var WDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

var ST_C = { not_started: "#cbd5e1", drafted: "#f59e0b", posted: "#3b82f6", done: "#22c55e" };
var ST_L = { not_started: "Not Started", drafted: "Drafted", posted: "Posted", done: "Done" };
var M_ST_C = { no_media: "#ccc", raw_uploaded: "#f59e0b", in_editing: "#a855f7", edited: "#3b82f6", final: "#22c55e" };
var M_ST_L = { no_media: "No Media", raw_uploaded: "Uploaded", in_editing: "Editing", edited: "Edited", final: "Final" };

var MAX_DAYS = 65;

var PLAT_CHAR_LIMITS = { tiktok: 800, instagram: 500, youtube: 5000, fb_page: 5000, fb_personal: 5000, x: 280, threads: 500 };
var PLAT_HASHTAG_LIMITS = { tiktok: 4, instagram: 5, youtube: 3, fb_page: 1, fb_personal: 0, fb_groups: 0, x: 2, threads: 1 };
var TRENDING_PLATFORMS = ["tiktok","instagram","youtube","fb_page"];

var XP_VALUES = { shared: 20, platform: 50, comment: 30, story: 20, group: 2 };
var COMP_TAGS = ["#grishaverse","#shadowandbone","#redrising","#childrenofbloodandbone","#anemberintheashes"];
