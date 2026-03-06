import { useState, useRef, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TEAMS = {
  MI:   { name: "Mumbai Indians",               short: "MI",   color: "#004BA0", accent: "#D4AF37" },
  CSK:  { name: "Chennai Super Kings",          short: "CSK",  color: "#F9CD05", accent: "#1A1A1A" },
  RCB:  { name: "Royal Challengers Bengaluru",  short: "RCB",  color: "#CC0000", accent: "#FFD700" },
  KKR:  { name: "Kolkata Knight Riders",        short: "KKR",  color: "#3A225D", accent: "#B69020" },
  DC:   { name: "Delhi Capitals",               short: "DC",   color: "#0078BC", accent: "#EF1C25" },
  SRH:  { name: "Sunrisers Hyderabad",          short: "SRH",  color: "#F7A721", accent: "#EF1C25" },
  RR:   { name: "Rajasthan Royals",             short: "RR",   color: "#EA1A85", accent: "#254AA5" },
  PBKS: { name: "Punjab Kings",                 short: "PBKS", color: "#ED1B24", accent: "#A7A9AC" },
  LSG:  { name: "Lucknow Super Giants",         short: "LSG",  color: "#A72056", accent: "#00B4D8" },
  GT:   { name: "Gujarat Titans",               short: "GT",   color: "#1C1C5E", accent: "#ADB4BD" },
};

const VENUES = {
  WS:    "Wankhede Stadium, Mumbai",
  MA:    "M.A. Chidambaram Stadium, Chennai",
  CG:    "Chinnaswamy Stadium, Bengaluru",
  ES:    "Eden Gardens, Kolkata",
  AC:    "Arun Jaitley Stadium, Delhi",
  RIS:   "Rajiv Gandhi Intl. Stadium, Hyderabad",
  SMS:   "Sawai Man Singh Stadium, Jaipur",
  NC:    "New Chandigarh Stadium",
  BRSAB: "BRSAB Ekana Stadium, Lucknow",
  NS:    "Narendra Modi Stadium, Ahmedabad",
};

const INITIAL_MATCHES = [
  { id:1,  date:"2026-03-22", time:"19:30", team1:"MI",  team2:"CSK",  venue:"WS",    status:"completed", winner:"MI",   score1:"187/5", score2:"183/8" },
  { id:2,  date:"2026-03-22", time:"15:30", team1:"RCB", team2:"KKR",  venue:"CG",    status:"completed", winner:"KKR",  score1:"162/9", score2:"165/4" },
  { id:3,  date:"2026-03-23", time:"19:30", team1:"DC",  team2:"SRH",  venue:"AC",    status:"completed", winner:"SRH",  score1:"178/6", score2:"181/3" },
  { id:4,  date:"2026-03-24", time:"19:30", team1:"RR",  team2:"PBKS", venue:"SMS",   status:"completed", winner:"RR",   score1:"201/4", score2:"195/7" },
  { id:5,  date:"2026-03-25", time:"19:30", team1:"LSG", team2:"GT",   venue:"BRSAB", status:"completed", winner:"GT",   score1:"155/8", score2:"158/5" },
  { id:6,  date:"2026-03-26", time:"19:30", team1:"CSK", team2:"RCB",  venue:"MA",    status:"completed", winner:"CSK",  score1:"210/3", score2:"198/6" },
  { id:7,  date:"2026-03-27", time:"19:30", team1:"MI",  team2:"KKR",  venue:"WS",    status:"live",      winner:null,   score1:"142/4", score2:null, overs1:"16.2" },
  { id:8,  date:"2026-03-28", time:"19:30", team1:"SRH", team2:"RR",   venue:"RIS",   status:"upcoming",  winner:null },
  { id:9,  date:"2026-03-29", time:"15:30", team1:"PBKS",team2:"DC",   venue:"NC",    status:"upcoming",  winner:null },
  { id:10, date:"2026-03-29", time:"19:30", team1:"GT",  team2:"CSK",  venue:"NS",    status:"upcoming",  winner:null },
  { id:11, date:"2026-03-30", time:"19:30", team1:"KKR", team2:"LSG",  venue:"ES",    status:"upcoming",  winner:null },
  { id:12, date:"2026-03-31", time:"19:30", team1:"RCB", team2:"MI",   venue:"CG",    status:"upcoming",  winner:null },
  { id:13, date:"2026-04-01", time:"19:30", team1:"RR",  team2:"DC",   venue:"SMS",   status:"upcoming",  winner:null },
  { id:14, date:"2026-04-02", time:"19:30", team1:"SRH", team2:"GT",   venue:"RIS",   status:"upcoming",  winner:null },
  { id:15, date:"2026-04-03", time:"19:30", team1:"CSK", team2:"PBKS", venue:"MA",    status:"upcoming",  winner:null },
  { id:16, date:"2026-04-04", time:"15:30", team1:"MI",  team2:"LSG",  venue:"WS",    status:"upcoming",  winner:null },
  { id:17, date:"2026-04-04", time:"19:30", team1:"KKR", team2:"RR",   venue:"ES",    status:"upcoming",  winner:null },
  { id:18, date:"2026-04-05", time:"19:30", team1:"DC",  team2:"RCB",  venue:"AC",    status:"upcoming",  winner:null },
  { id:19, date:"2026-04-06", time:"19:30", team1:"GT",  team2:"MI",   venue:"NS",    status:"upcoming",  winner:null },
  { id:20, date:"2026-04-07", time:"19:30", team1:"PBKS",team2:"SRH",  venue:"NC",    status:"upcoming",  winner:null },
  { id:21, date:"2026-04-08", time:"19:30", team1:"LSG", team2:"RCB",  venue:"BRSAB", status:"upcoming",  winner:null },
  { id:22, date:"2026-04-09", time:"19:30", team1:"CSK", team2:"KKR",  venue:"MA",    status:"upcoming",  winner:null },
  { id:23, date:"2026-04-10", time:"19:30", team1:"RR",  team2:"GT",   venue:"SMS",   status:"upcoming",  winner:null },
  { id:24, date:"2026-04-11", time:"19:30", team1:"MI",  team2:"DC",   venue:"WS",    status:"upcoming",  winner:null },
  { id:25, date:"2026-04-12", time:"15:30", team1:"SRH", team2:"LSG",  venue:"RIS",   status:"upcoming",  winner:null },
  { id:26, date:"2026-04-12", time:"19:30", team1:"PBKS",team2:"RCB",  venue:"NC",    status:"upcoming",  winner:null },
  { id:27, date:"2026-04-13", time:"19:30", team1:"KKR", team2:"DC",   venue:"ES",    status:"upcoming",  winner:null },
  { id:28, date:"2026-04-14", time:"19:30", team1:"GT",  team2:"CSK",  venue:"NS",    status:"upcoming",  winner:null },
];

const SEED_USERS = [
  { mobile:"9876543210", name:"Rahul Sharma", points:420, predictions:18, correct:14 },
  { mobile:"9123456789", name:"Priya Patel",  points:380, predictions:18, correct:12 },
  { mobile:"9988776655", name:"Amit Kumar",   points:350, predictions:16, correct:11 },
  { mobile:"9090909090", name:"Sneha Iyer",   points:310, predictions:15, correct:10 },
  { mobile:"9000011111", name:"Vikram Nair",  points:290, predictions:17, correct:9  },
];

const ADMIN_PIN = "1234";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const formatDate = d => new Date(d).toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short" });
const isToday = d => new Date(d).toDateString() === new Date("2026-03-27").toDateString();
const tc = c => c === "#F9CD05" ? "#e6b800" : c;

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080B14;--surface:#0F1420;--surface2:#161C2D;--border:#1E2A45;
  --text:#E8EEFF;--muted:#6B7AA1;--accent:#FF6B2B;--accent2:#FFD700;
  --live:#00E676;--danger:#FF3D57;--radius:12px;
}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden;}
.bebas{font-family:'Bebas Neue',sans-serif;}
.rajdhani{font-family:'Rajdhani',sans-serif;}
.app-bg{position:fixed;inset:0;z-index:0;background:
  radial-gradient(ellipse 80% 50% at 20% -10%,rgba(255,107,43,.15) 0%,transparent 60%),
  radial-gradient(ellipse 60% 40% at 80% 100%,rgba(0,100,200,.12) 0%,transparent 50%),#080B14;}
.grain{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.04;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.app-wrap{position:relative;z-index:2;min-height:100vh;}

/* NAV */
nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;
  padding:0 20px;height:60px;background:rgba(8,11,20,.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
.nav-logo{font-family:'Bebas Neue';font-size:1.6rem;letter-spacing:2px;color:var(--accent);}
.nav-logo span{color:var(--accent2);}
.nav-tabs{display:flex;gap:4px;}
.nav-tab{padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-family:'Rajdhani';
  font-size:.9rem;font-weight:600;letter-spacing:.5px;background:transparent;color:var(--muted);transition:all .2s;}
.nav-tab:hover{color:var(--text);background:var(--surface);}
.nav-tab.active{background:var(--accent);color:#fff;}
.nav-tab.admin-tab{border:1px solid rgba(255,215,0,.3);color:var(--accent2);}
.nav-tab.admin-tab.active{background:var(--accent2);color:#000;}
.nav-right{display:flex;align-items:center;gap:8px;}
.nav-user{display:flex;align-items:center;gap:10px;padding:6px 14px;border-radius:8px;
  background:var(--surface2);border:1px solid var(--border);font-family:'Rajdhani';font-weight:600;font-size:.9rem;}
.pts-badge{background:var(--accent);color:#fff;padding:2px 8px;border-radius:20px;font-size:.75rem;font-weight:700;}

/* AUTH */
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
.auth-card{width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border);
  border-radius:20px;padding:40px 36px;box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,107,43,.1);animation:slideUp .4s ease;}
@keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
.auth-logo{text-align:center;margin-bottom:28px;}
.auth-logo .big{font-family:'Bebas Neue';font-size:3rem;color:var(--accent);letter-spacing:3px;line-height:1;}
.auth-logo .sub{font-family:'Rajdhani';color:var(--muted);font-size:.85rem;letter-spacing:2px;margin-top:4px;}
.cricket-icon{font-size:3rem;display:block;margin-bottom:8px;}
.auth-title{font-family:'Rajdhani';font-size:1.4rem;font-weight:700;margin-bottom:6px;}
.auth-sub{color:var(--muted);font-size:.85rem;margin-bottom:28px;}
.field{margin-bottom:18px;}
.field label{display:block;font-family:'Rajdhani';font-size:.85rem;font-weight:600;color:var(--muted);
  margin-bottom:8px;letter-spacing:.5px;text-transform:uppercase;}
.input-row{display:flex;gap:8px;}
.field input{width:100%;padding:12px 16px;border-radius:10px;background:var(--surface2);
  border:1px solid var(--border);color:var(--text);font-size:1rem;outline:none;transition:border-color .2s;}
.field input:focus{border-color:var(--accent);}
.field input::placeholder{color:var(--muted);}
.field select{width:100%;padding:12px 16px;border-radius:10px;background:var(--surface2);
  border:1px solid var(--border);color:var(--text);font-size:.9rem;outline:none;}
.btn{width:100%;padding:13px;border-radius:10px;border:none;cursor:pointer;
  font-family:'Rajdhani';font-size:1rem;font-weight:700;letter-spacing:1px;transition:all .2s;text-transform:uppercase;}
.btn-primary{background:var(--accent);color:#fff;box-shadow:0 4px 20px rgba(255,107,43,.4);}
.btn-primary:hover{background:#e55a1f;transform:translateY(-1px);}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-outline{background:transparent;color:var(--text);border:1px solid var(--border);}
.btn-outline:hover{border-color:var(--accent);color:var(--accent);}
.btn-gold{background:var(--accent2);color:#000;box-shadow:0 4px 20px rgba(255,215,0,.3);}
.btn-gold:hover{background:#e6c200;transform:translateY(-1px);}
.btn-sm{width:auto;padding:8px 14px;white-space:nowrap;flex-shrink:0;font-size:.82rem;}
.btn-danger{background:rgba(255,61,87,.15);color:var(--danger);border:1px solid rgba(255,61,87,.4);}
.btn-danger:hover{background:rgba(255,61,87,.25);}
.auth-switch{text-align:center;margin-top:20px;color:var(--muted);font-size:.9rem;}
.auth-switch button{background:none;border:none;color:var(--accent);cursor:pointer;font-weight:600;font-family:'Rajdhani';font-size:.9rem;}
.otp-boxes{display:flex;gap:10px;}
.otp-boxes input{flex:1;text-align:center;font-size:1.3rem;font-weight:700;padding:14px 8px;}
.alert{padding:12px 16px;border-radius:8px;font-size:.9rem;margin-bottom:16px;}
.alert-success{background:rgba(0,230,118,.12);color:var(--live);border:1px solid rgba(0,230,118,.3);}
.alert-error{background:rgba(255,61,87,.12);color:var(--danger);border:1px solid rgba(255,61,87,.3);}

/* MAIN */
.main{max-width:960px;margin:0 auto;padding:24px 20px 90px;}
.hero{background:var(--surface);border:1px solid var(--border);border-radius:20px;
  padding:32px;margin-bottom:28px;position:relative;overflow:hidden;}
.hero::before{content:'🏏';position:absolute;right:24px;top:50%;transform:translateY(-50%);font-size:5rem;opacity:.08;}
.hero h1{font-family:'Bebas Neue';font-size:2.2rem;letter-spacing:2px;color:var(--accent);}
.hero p{color:var(--muted);font-size:.95rem;margin-top:6px;}
.hero-stats{display:flex;gap:24px;margin-top:20px;}
.hero-stat label{font-family:'Rajdhani';font-size:.75rem;text-transform:uppercase;color:var(--muted);letter-spacing:1px;}
.hero-stat .val{font-family:'Bebas Neue';font-size:1.8rem;color:var(--accent2);}
.section-title{font-family:'Bebas Neue';font-size:1.3rem;letter-spacing:2px;color:var(--muted);
  margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.section-title::after{content:'';flex:1;height:1px;background:var(--border);}
.matches-grid{display:flex;flex-direction:column;gap:12px;}

/* MATCH CARD */
.match-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;
  padding:16px 20px;transition:border-color .2s,transform .2s;cursor:pointer;}
.match-card:hover{border-color:rgba(255,107,43,.4);transform:translateX(3px);}
.match-card.predicted{border-color:rgba(0,230,118,.4);}
.match-card.live-card{border-color:var(--live);box-shadow:0 0 20px rgba(0,230,118,.15);}
.match-meta{display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:.78rem;
  color:var(--muted);font-family:'Rajdhani';text-transform:uppercase;letter-spacing:.5px;}
.badge{padding:2px 8px;border-radius:20px;font-size:.7rem;font-weight:700;font-family:'Rajdhani';text-transform:uppercase;letter-spacing:.5px;}
.badge-live{background:var(--live);color:#001a0d;animation:pulse 1.5s infinite;}
.badge-upcoming{background:var(--surface2);color:var(--muted);border:1px solid var(--border);}
.badge-done{background:rgba(107,122,161,.2);color:var(--muted);}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.7;}}
.match-teams{display:flex;align-items:center;}
.team-side{flex:1;}
.team-side.right{text-align:right;}
.team-name{font-family:'Rajdhani';font-size:.78rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
.team-short{font-family:'Bebas Neue';font-size:1.6rem;letter-spacing:1px;}
.team-score{font-family:'Rajdhani';font-size:.9rem;font-weight:600;color:var(--accent2);margin-top:2px;}
.vs-box{width:48px;text-align:center;flex-shrink:0;}
.vs-txt{font-family:'Bebas Neue';font-size:1.1rem;color:var(--muted);}
.match-footer{margin-top:12px;display:flex;align-items:center;justify-content:space-between;font-size:.8rem;}
.venue-txt{color:var(--muted);font-size:.75rem;}
.btn-predict{padding:7px 18px;border-radius:8px;border:none;cursor:pointer;
  font-family:'Rajdhani';font-size:.85rem;font-weight:700;letter-spacing:.5px;
  background:var(--accent);color:#fff;transition:all .2s;}
.btn-predict:hover{background:#e55a1f;}
.btn-predict.done{background:rgba(0,230,118,.2);color:var(--live);border:1px solid rgba(0,230,118,.4);cursor:default;}
.btn-predict.done:hover{background:rgba(0,230,118,.2);}

/* MODAL */
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.75);
  backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:20px;
  padding:32px;width:100%;max-width:500px;animation:modalIn .3s ease;box-shadow:0 32px 80px rgba(0,0,0,.7);}
@keyframes modalIn{from{opacity:0;transform:scale(.92) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);}}
.modal-title{font-family:'Bebas Neue';font-size:1.6rem;letter-spacing:2px;margin-bottom:6px;}
.modal-sub{color:var(--muted);font-size:.85rem;margin-bottom:24px;}
.team-choice{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px;}
.team-btn{padding:20px;border-radius:14px;border:2px solid var(--border);background:var(--surface2);
  cursor:pointer;transition:all .2s;text-align:center;}
.team-btn:hover{border-color:rgba(255,107,43,.5);transform:translateY(-2px);}
.team-btn.selected{border-color:var(--accent);background:rgba(255,107,43,.1);}
.team-btn .tshort{font-family:'Bebas Neue';font-size:1.4rem;letter-spacing:1px;}
.team-btn .tfull{font-size:.72rem;color:var(--muted);margin-top:2px;}
.modal-actions{display:flex;gap:10px;}
.modal-actions .btn{flex:1;}

/* SCHEDULE */
.date-group{margin-bottom:28px;}
.date-header{font-family:'Rajdhani';font-size:.8rem;text-transform:uppercase;letter-spacing:1px;
  color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:10px;}
.today-tag{background:var(--accent);color:#fff;padding:2px 8px;border-radius:4px;font-size:.7rem;font-weight:700;}

/* TABS ROW */
.tabs-row{display:flex;gap:4px;margin-bottom:24px;padding:4px;background:var(--surface);
  border-radius:10px;border:1px solid var(--border);}
.tab-item{flex:1;padding:9px;border-radius:8px;border:none;cursor:pointer;
  font-family:'Rajdhani';font-size:.9rem;font-weight:600;background:transparent;color:var(--muted);transition:all .2s;}
.tab-item:hover{color:var(--text);}
.tab-item.active{background:var(--accent);color:#fff;}

/* LEADERBOARD */
.leaderboard{display:flex;flex-direction:column;gap:8px;}
.lb-row{display:flex;align-items:center;gap:16px;background:var(--surface);border:1px solid var(--border);
  border-radius:12px;padding:14px 18px;transition:border-color .2s;}
.lb-row:hover{border-color:rgba(255,107,43,.3);}
.lb-row.me{border-color:rgba(255,215,0,.4);background:rgba(255,215,0,.04);}
.lb-rank{font-family:'Bebas Neue';font-size:1.4rem;width:32px;color:var(--muted);}
.lb-name{flex:1;font-family:'Rajdhani';font-size:1rem;font-weight:600;}
.lb-pts{font-family:'Bebas Neue';font-size:1.3rem;color:var(--accent);}
.lb-acc{font-size:.75rem;color:var(--muted);text-align:right;}

/* MY PREDICTIONS */
.pred-list{display:flex;flex-direction:column;gap:10px;}
.pred-item{display:flex;align-items:center;gap:14px;background:var(--surface);
  border:1px solid var(--border);border-radius:12px;padding:14px 18px;}
.pred-match{flex:1;}
.pred-match .teams-line{font-family:'Rajdhani';font-size:1rem;font-weight:600;}
.pred-match .date-line{font-size:.75rem;color:var(--muted);margin-top:2px;}
.pred-pick{text-align:right;}
.pred-pick .pick-label{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;}
.pred-pick .pick-team{font-family:'Rajdhani';font-weight:700;font-size:.95rem;}
.pred-pick .correct{color:var(--live);}
.pred-pick .wrong{color:var(--danger);}
.pred-pick .pending{color:var(--accent2);}
.no-data{text-align:center;color:var(--muted);padding:40px;font-family:'Rajdhani';font-size:1rem;}
.confetti-msg{background:linear-gradient(135deg,rgba(255,107,43,.15),rgba(255,215,0,.1));
  border:1px solid rgba(255,107,43,.4);border-radius:12px;padding:16px 20px;margin-bottom:20px;font-family:'Rajdhani';}

/* ADMIN PANEL */
.admin-header{background:linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,107,43,.05));
  border:1px solid rgba(255,215,0,.3);border-radius:16px;padding:20px 24px;margin-bottom:24px;
  display:flex;align-items:center;gap:14px;}
.admin-badge{background:var(--accent2);color:#000;font-family:'Bebas Neue';letter-spacing:1px;
  padding:4px 12px;border-radius:6px;font-size:.85rem;}
.admin-grid{display:flex;flex-direction:column;gap:10px;}
.admin-row{background:var(--surface);border:1px solid var(--border);border-radius:12px;
  padding:14px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.admin-match-info{flex:1;min-width:180px;}
.admin-match-info .teams{font-family:'Rajdhani';font-size:1rem;font-weight:700;}
.admin-match-info .meta{font-size:.75rem;color:var(--muted);margin-top:2px;}
.admin-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.admin-controls select{padding:8px 12px;border-radius:8px;background:var(--surface2);
  border:1px solid var(--border);color:var(--text);font-size:.85rem;outline:none;min-width:120px;}
.score-inputs{display:flex;gap:6px;}
.score-inputs input{width:90px;padding:8px 10px;border-radius:8px;background:var(--surface2);
  border:1px solid var(--border);color:var(--text);font-size:.82rem;outline:none;}
.score-inputs input::placeholder{color:var(--muted);}
.admin-status{padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:700;font-family:'Rajdhani';}
.status-completed{background:rgba(0,230,118,.15);color:var(--live);border:1px solid rgba(0,230,118,.3);}
.status-live{background:rgba(0,230,118,.3);color:var(--live);animation:pulse 1.5s infinite;}
.status-upcoming{background:var(--surface2);color:var(--muted);border:1px solid var(--border);}

/* WINNER CARD */
.winner-card-wrap{background:linear-gradient(135deg,#0F1420,#1a1000);
  border:1px solid rgba(255,215,0,.4);border-radius:20px;padding:28px;
  text-align:center;position:relative;overflow:hidden;margin-bottom:20px;}
.winner-card-wrap::before{content:'🏆';position:absolute;font-size:8rem;opacity:.05;
  top:50%;left:50%;transform:translate(-50%,-50%);}
.wc-label{font-family:'Rajdhani';font-size:.8rem;text-transform:uppercase;letter-spacing:2px;
  color:var(--accent2);margin-bottom:8px;}
.wc-name{font-family:'Bebas Neue';font-size:2.4rem;letter-spacing:3px;color:#fff;margin-bottom:4px;}
.wc-sub{font-family:'Rajdhani';font-size:1rem;color:var(--muted);margin-bottom:16px;}
.wc-pts{font-family:'Bebas Neue';font-size:3.5rem;color:var(--accent2);line-height:1;}
.wc-pts-label{font-family:'Rajdhani';font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;}
.wc-acc{margin-top:12px;font-family:'Rajdhani';font-size:1rem;color:var(--live);}
.share-btn{display:flex;align-items:center;justify-content:center;gap:10px;
  padding:13px 24px;border-radius:12px;border:none;cursor:pointer;width:100%;
  font-family:'Rajdhani';font-size:1rem;font-weight:700;letter-spacing:1px;
  background:#25D366;color:#fff;transition:all .2s;margin-top:10px;}
.share-btn:hover{background:#1da851;transform:translateY(-1px);}
.share-btn svg{width:20px;height:20px;fill:currentColor;}
.share-self-btn{display:flex;align-items:center;justify-content:center;gap:10px;
  padding:10px 20px;border-radius:10px;border:1px solid #25D366;cursor:pointer;width:100%;
  font-family:'Rajdhani';font-size:.9rem;font-weight:600;
  background:rgba(37,211,102,.1);color:#25D366;transition:all .2s;margin-top:8px;}
.share-self-btn:hover{background:rgba(37,211,102,.2);}

/* MOBILE NAV */
@media(max-width:600px){
  .nav-tabs{display:none;}
  .main{padding:16px 14px 100px;}
  .mobile-nav{position:fixed;bottom:0;left:0;right:0;z-index:100;
    display:flex;background:var(--surface);border-top:1px solid var(--border);}
  .mobile-tab{flex:1;padding:10px 6px;border:none;background:transparent;
    color:var(--muted);cursor:pointer;font-family:'Rajdhani';font-size:.65rem;
    font-weight:600;text-transform:uppercase;letter-spacing:.3px;
    display:flex;flex-direction:column;align-items:center;gap:3px;transition:color .2s;}
  .mobile-tab.active{color:var(--accent);}
  .mobile-tab span{font-size:1.1rem;}
  .hero{padding:20px;}
  .hero-stats{gap:14px;}
  .admin-row{flex-direction:column;align-items:flex-start;}
  .score-inputs input{width:80px;}
}
@media(min-width:601px){.mobile-nav{display:none;}}

.divider{height:1px;background:var(--border);margin:20px 0;}
.tag-you{color:var(--accent2);font-size:.72rem;margin-left:8px;}
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function MatchCard({ match, prediction, onPredict }) {
  const t1 = TEAMS[match.team1], t2 = TEAMS[match.team2];
  const isLive = match.status === "live";
  const isDone = match.status === "completed";
  const pred = prediction?.[match.id];
  return (
    <div className={`match-card${isLive?" live-card":""}${pred?" predicted":""}`}>
      <div className="match-meta">
        {isLive && <span className="badge badge-live">● LIVE</span>}
        {isDone && <span className="badge badge-done">FINAL</span>}
        {match.status==="upcoming" && <span className="badge badge-upcoming">UPCOMING</span>}
        <span>#{match.id}</span><span>•</span><span>{match.time}</span>
      </div>
      <div className="match-teams">
        <div className="team-side">
          <div className="team-name">{t1.name}</div>
          <div className="team-short" style={{color:tc(t1.color)}}>{t1.short}</div>
          {match.score1&&<div className="team-score">{match.score1}{match.overs1?` (${match.overs1})`:""}</div>}
        </div>
        <div className="vs-box"><div className="vs-txt">VS</div></div>
        <div className="team-side right">
          <div className="team-name">{t2.name}</div>
          <div className="team-short" style={{color:tc(t2.color)}}>{t2.short}</div>
          {match.score2&&<div className="team-score">{match.score2}</div>}
        </div>
      </div>
      <div className="match-footer">
        <div className="venue-txt">📍 {VENUES[match.venue]}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {isDone&&match.winner&&<span style={{fontSize:".75rem",color:"var(--live)"}}>🏆 {TEAMS[match.winner].short} won</span>}
          {!isDone&&(
            <button className={`btn-predict${pred?" done":""}`} onClick={()=>!pred&&onPredict(match)}>
              {pred?`✓ ${TEAMS[pred].short}`:"Predict"}
            </button>
          )}
          {isDone&&pred&&(
            <span style={{fontSize:".8rem",color:pred===match.winner?"var(--live)":"var(--danger)"}}>
              {pred===match.winner?"✓ +30pts":"✗ Wrong"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PredictModal({ match, onConfirm, onClose }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">🏏 Pick Your Winner</div>
        <div className="modal-sub">Match #{match.id} · {formatDate(match.date)} {match.time}</div>
        <div className="team-choice">
          {[match.team1,match.team2].map(tk=>{
            const t=TEAMS[tk];
            return (
              <button key={tk} className={`team-btn${selected===tk?" selected":""}`}
                style={selected===tk?{borderColor:tc(t.color),background:`${t.color}18`}:{}}
                onClick={()=>setSelected(tk)}>
                <div className="tshort" style={{color:tc(t.color),fontSize:"2rem"}}>{t.short}</div>
                <div className="tfull">{t.name}</div>
              </button>
            );
          })}
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!selected} onClick={()=>selected&&onConfirm(match.id,selected)}>
            Confirm Prediction
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["","","",""]);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const refs = [useRef(),useRef(),useRef(),useRef()];

  const reset = () => { setStep(1); setOtp(["","","",""]); setMsg(null); };

  const sendOtp = () => {
    if (mobile.length!==10) { setMsg({type:"error",text:"Enter valid 10-digit mobile number"}); return; }
    if (mode==="register"&&!name.trim()) { setMsg({type:"error",text:"Enter your name"}); return; }
    setLoading(true);
    setTimeout(()=>{ setLoading(false); setStep(2); setMsg({type:"success",text:`OTP sent to +91 ${mobile} — use 1234 for demo`}); },1000);
  };

  const handleOtp = (i,v) => {
    if(!/^\d?$/.test(v)) return;
    const n=[...otp]; n[i]=v; setOtp(n);
    if(v&&i<3) refs[i+1].current?.focus();
  };

  const verify = () => {
    if(otp.join("")!=="1234") { setMsg({type:"error",text:"Invalid OTP. Use 1234 for demo."}); return; }
    if(mode==="login") {
      const known = SEED_USERS.find(u=>u.mobile===mobile);
      onLogin(known||{mobile,name:"New User",points:0,predictions:0,correct:0});
    } else {
      onLogin({mobile,name,points:0,predictions:0,correct:0});
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="cricket-icon">🏏</span>
          <div className="big">IPL<span style={{color:"var(--accent2)"}}>GURU</span></div>
          <div className="sub">PREDICT · COMPETE · WIN</div>
        </div>
        {msg&&<div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        {step===1 ? (
          <>
            <div className="auth-title rajdhani">{mode==="login"?"Welcome Back!":"Create Account"}</div>
            <div className="auth-sub">{mode==="login"?"Login with your mobile number":"Join your friends for IPL 2026!"}</div>
            {mode==="register"&&(
              <div className="field"><label>Your Name</label>
                <input placeholder="Rahul Sharma" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
            )}
            <div className="field"><label>Mobile Number</label>
              <div className="input-row">
                <input style={{width:60,flexShrink:0}} value="+91" readOnly/>
                <input placeholder="9876543210" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/,""))}/>
              </div>
            </div>
            <button className="btn btn-primary" onClick={sendOtp} disabled={loading}>
              {loading?"Sending OTP...":"Send OTP →"}
            </button>
          </>
        ):(
          <>
            <div className="auth-title rajdhani">Enter OTP</div>
            <div className="auth-sub">4-digit code sent to +91 {mobile}</div>
            <div className="field"><label>OTP</label>
              <div className="otp-boxes">
                {otp.map((v,i)=>(
                  <input key={i} ref={refs[i]} maxLength={1} value={v}
                    onChange={e=>handleOtp(i,e.target.value)}
                    onKeyDown={e=>{if(e.key==="Backspace"&&!v&&i>0)refs[i-1].current?.focus();}}/>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={verify}>Verify & {mode==="login"?"Login":"Register"}</button>
            <button className="btn btn-outline" style={{marginTop:10}} onClick={reset}>← Change Number</button>
          </>
        )}
        <div className="auth-switch">
          {mode==="login"?"New here? ":"Already registered? "}
          <button onClick={()=>{setMode(mode==="login"?"register":"login");reset();}}>
            {mode==="login"?"Create account":"Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

function AdminLoginModal({ onSuccess, onClose }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const verify = () => {
    if(pin===ADMIN_PIN) onSuccess();
    else setErr(true);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:360}} onClick={e=>e.stopPropagation()}>
        <div className="modal-title">🔐 Admin Access</div>
        <div className="modal-sub">Enter admin PIN to manage match results</div>
        {err&&<div className="alert alert-error">Wrong PIN. Try 1234 for demo.</div>}
        <div className="field"><label>Admin PIN</label>
          <input type="password" placeholder="••••" maxLength={6} value={pin}
            onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&verify()}/>
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={verify}>Enter Admin</button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ matches, onUpdateMatch, onLogout }) {
  const [editScores, setEditScores] = useState({});
  const [saved, setSaved] = useState(null);

  const handleUpdate = (match) => {
    const scores = editScores[match.id]||{};
    if(!scores.winner) return;
    onUpdateMatch(match.id, {
      status:"completed",
      winner:scores.winner,
      score1:scores.score1||match.score1||"",
      score2:scores.score2||match.score2||"",
    });
    setSaved(match.id);
    setTimeout(()=>setSaved(null),2000);
  };

  const handleLive = (match) => {
    const scores = editScores[match.id]||{};
    onUpdateMatch(match.id, {
      status:"live",
      winner:null,
      score1:scores.score1||"",
      overs1:scores.overs1||"",
    });
  };

  const setField = (id,key,val) => setEditScores(p=>({...p,[id]:{...(p[id]||{}),[key]:val}}));

  const pending = matches.filter(m=>m.status!=="completed");
  const done = matches.filter(m=>m.status==="completed");

  return (
    <div>
      <div className="admin-header">
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <span className="admin-badge">ADMIN</span>
            <span style={{fontFamily:"'Rajdhani'",fontWeight:700,fontSize:"1.1rem"}}>Match Control Panel</span>
          </div>
          <div style={{color:"var(--muted)",fontSize:".82rem"}}>Update scores & results after each match</div>
        </div>
        <button className="btn btn-danger btn-sm" style={{marginLeft:"auto"}} onClick={onLogout}>Exit Admin</button>
      </div>

      <div className="section-title">⏳ Pending / Live Matches</div>
      <div className="admin-grid" style={{marginBottom:28}}>
        {pending.map(m=>(
          <div key={m.id} className="admin-row">
            <div className="admin-match-info">
              <div className="teams">{TEAMS[m.team1].short} <span style={{color:"var(--muted)"}}>vs</span> {TEAMS[m.team2].short}</div>
              <div className="meta">#{m.id} · {formatDate(m.date)} {m.time}</div>
              <span className={`admin-status status-${m.status}`}>{m.status.toUpperCase()}</span>
            </div>
            <div className="admin-controls">
              <div className="score-inputs">
                <input placeholder={`${m.team1} score`} value={editScores[m.id]?.score1||""}
                  onChange={e=>setField(m.id,"score1",e.target.value)}/>
                <input placeholder={`${m.team2} score`} value={editScores[m.id]?.score2||""}
                  onChange={e=>setField(m.id,"score2",e.target.value)}/>
              </div>
              <select value={editScores[m.id]?.winner||""} onChange={e=>setField(m.id,"winner",e.target.value)}>
                <option value="">Winner…</option>
                <option value={m.team1}>{TEAMS[m.team1].short}</option>
                <option value={m.team2}>{TEAMS[m.team2].short}</option>
              </select>
              <button className="btn btn-primary btn-sm" onClick={()=>handleUpdate(m)}>
                {saved===m.id?"✓ Saved!":"Save Result"}
              </button>
              <button className="btn btn-outline btn-sm" onClick={()=>handleLive(m)}>Set Live</button>
            </div>
          </div>
        ))}
        {pending.length===0&&<div className="no-data">All matches completed 🎉</div>}
      </div>

      <div className="section-title">✅ Completed Matches</div>
      <div className="admin-grid">
        {done.map(m=>(
          <div key={m.id} className="admin-row">
            <div className="admin-match-info">
              <div className="teams">{TEAMS[m.team1].short} vs {TEAMS[m.team2].short}</div>
              <div className="meta">#{m.id} · {formatDate(m.date)}</div>
              <span className="admin-status status-completed">COMPLETED</span>
            </div>
            <div style={{fontFamily:"'Rajdhani'",fontSize:".9rem",color:"var(--live)"}}>
              🏆 {TEAMS[m.winner].short} won
              {m.score1&&<span style={{color:"var(--muted)",marginLeft:8}}>{m.score1} vs {m.score2}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WINNER CARD ──────────────────────────────────────────────────────────────

function WinnerCard({ topUser, allUsers, isMe }) {
  const shareText = `🏏 IPLGURU Leaderboard Update!\n\n🥇 ${topUser.name} leads with ${topUser.points} pts (${topUser.correct}/${topUser.predictions} correct)\n\nJoin our IPL 2026 prediction game! 🔥`;
  const waLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const shareMyText = isMe
    ? `🏏 I'm leading the IPLGURU leaderboard with ${topUser.points} pts!\n${topUser.correct}/${topUser.predictions} correct predictions 🎯\nJoin our IPL 2026 prediction game!`
    : null;

  return (
    <div>
      <div className="winner-card-wrap">
        <div className="wc-label">🏆 Current Leader</div>
        <div className="wc-name">{topUser.name}</div>
        <div className="wc-sub">+91 {topUser.mobile.slice(0,5)}XXXXX</div>
        <div className="wc-pts">{topUser.points}</div>
        <div className="wc-pts-label">Points</div>
        <div className="wc-acc">✅ {topUser.correct} correct out of {topUser.predictions} predictions</div>
      </div>

      <a href={waLink} target="_blank" rel="noreferrer" className="share-btn">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Share Leaderboard on WhatsApp
      </a>

      {shareMyText && (
        <a href={`https://wa.me/?text=${encodeURIComponent(shareMyText)}`} target="_blank" rel="noreferrer" className="share-self-btn">
          📤 Share My Score
        </a>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ matches, user, predictions, onPredict }) {
  const [predictingMatch, setPredictingMatch] = useState(null);
  const live = matches.filter(m=>m.status==="live");
  const today = matches.filter(m=>isToday(m.date));
  const upcoming = matches.filter(m=>m.status==="upcoming").slice(0,5);
  const handleConfirm = (id,team)=>{ onPredict(id,team); setPredictingMatch(null); };
  return (
    <div>
      <div className="hero">
        <h1 className="bebas">IPL 2026 — PREDICT & WIN 🏆</h1>
        <p>Pick match winners, earn points, crush your friends!</p>
        <div className="hero-stats">
          <div className="hero-stat"><div className="val">{user.points}</div><label>Points</label></div>
          <div className="hero-stat"><div className="val">{user.correct}/{user.predictions}</div><label>Correct</label></div>
          <div className="hero-stat"><div className="val">{matches.filter(m=>m.status==="upcoming").length}</div><label>Upcoming</label></div>
        </div>
      </div>
      {live.length>0&&<><div className="section-title">🔴 Live Now</div>
        <div className="matches-grid" style={{marginBottom:24}}>
          {live.map(m=><MatchCard key={m.id} match={m} prediction={predictions} onPredict={setPredictingMatch}/>)}
        </div></>}
      {today.length>0&&<><div className="section-title">📅 Today's Matches</div>
        <div className="matches-grid" style={{marginBottom:24}}>
          {today.map(m=><MatchCard key={m.id} match={m} prediction={predictions} onPredict={setPredictingMatch}/>)}
        </div></>}
      <div className="section-title">⏭ Coming Up</div>
      <div className="matches-grid">
        {upcoming.map(m=><MatchCard key={m.id} match={m} prediction={predictions} onPredict={setPredictingMatch}/>)}
      </div>
      {predictingMatch&&<PredictModal match={predictingMatch} onConfirm={handleConfirm} onClose={()=>setPredictingMatch(null)}/>}
    </div>
  );
}

function SchedulePage({ matches, predictions, onPredict }) {
  const [predictingMatch, setPredictingMatch] = useState(null);
  const grouped = matches.reduce((acc,m)=>{ (acc[m.date]=acc[m.date]||[]).push(m); return acc; },{});
  const handleConfirm = (id,team)=>{ onPredict(id,team); setPredictingMatch(null); };
  return (
    <div>
      <div className="section-title">📅 IPL 2026 Full Schedule</div>
      {Object.entries(grouped).map(([date,ms])=>(
        <div key={date} className="date-group">
          <div className="date-header">
            {formatDate(date)}
            {isToday(date)&&<span className="today-tag">TODAY</span>}
          </div>
          <div className="matches-grid">
            {ms.map(m=><MatchCard key={m.id} match={m} prediction={predictions} onPredict={setPredictingMatch}/>)}
          </div>
        </div>
      ))}
      {predictingMatch&&<PredictModal match={predictingMatch} onConfirm={handleConfirm} onClose={()=>setPredictingMatch(null)}/>}
    </div>
  );
}

function ResultsPage({ matches, predictions, user }) {
  const [tab, setTab] = useState("leaderboard");
  const totalPred = Object.keys(predictions).length;
  const correctCount = matches.filter(m=>m.status==="completed"&&predictions[m.id]===m.winner).length;
  const myPts = user.points + correctCount*30 + totalPred*5;

  const allUsers = [
    ...SEED_USERS.filter(u=>u.mobile!==user.mobile),
    { ...user, predictions:totalPred, correct:correctCount, points:myPts }
  ].sort((a,b)=>b.points-a.points);

  const myRank = allUsers.findIndex(u=>u.mobile===user.mobile)+1;
  const topUser = allUsers[0];
  const isLeader = topUser.mobile===user.mobile;

  return (
    <div>
      <div className="confetti-msg">
        🏆 Your rank: <strong>#{myRank}</strong> · <strong>{myPts} pts</strong> · {correctCount}/{totalPred} correct
      </div>

      <WinnerCard topUser={topUser} allUsers={allUsers} isMe={isLeader}/>

      <div className="divider"/>

      <div className="tabs-row">
        {[["leaderboard","🏅 Leaderboard"],["mypreds","📋 My Predictions"]].map(([v,l])=>(
          <button key={v} className={`tab-item${tab===v?" active":""}`} onClick={()=>setTab(v)}>{l}</button>
        ))}
      </div>

      {tab==="leaderboard"&&(
        <div className="leaderboard">
          {allUsers.map((u,i)=>(
            <div key={u.mobile} className={`lb-row${u.mobile===user.mobile?" me":""}`}>
              <div className="lb-rank" style={{color:i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":""}}>
                {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
              </div>
              <div className="lb-name">
                {u.name}
                {u.mobile===user.mobile&&<span className="tag-you">YOU</span>}
              </div>
              <div style={{textAlign:"right"}}>
                <div className="lb-pts">{u.points} pts</div>
                <div className="lb-acc">{u.correct}/{u.predictions} ✓</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="mypreds"&&(
        <div className="pred-list">
          {Object.keys(predictions).length===0&&<div className="no-data">No predictions yet! Go predict some matches 🏏</div>}
          {Object.entries(predictions).map(([mid,pickedTeam])=>{
            const match = matches.find(m=>m.id===parseInt(mid)); if(!match) return null;
            const isDone=match.status==="completed";
            const isCorrect=isDone&&match.winner===pickedTeam;
            const isWrong=isDone&&match.winner!==pickedTeam;
            return (
              <div key={mid} className="pred-item">
                <div className="pred-match">
                  <div className="teams-line">{TEAMS[match.team1].short} vs {TEAMS[match.team2].short}</div>
                  <div className="date-line">{formatDate(match.date)} · {match.time}</div>
                </div>
                <div className="pred-pick">
                  <div className="pick-label">Your Pick</div>
                  <div className={`pick-team${isCorrect?" correct":isWrong?" wrong":" pending"}`}>
                    {isCorrect?"✓ ":isWrong?"✗ ":"⏳ "}{TEAMS[pickedTeam].short}
                    {isCorrect&&<span style={{marginLeft:6,fontSize:".75rem"}}>+30</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [predictions, setPredictions] = useState({});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = u => setUser(u);
  const handleLogout = () => { setUser(null); setPredictions({}); setIsAdmin(false); setPage("home"); };
  const handlePredict = (id,team) => setPredictions(p=>({...p,[id]:team}));
  const handleAdminUpdate = (id, updates) => {
    setMatches(ms=>ms.map(m=>m.id===id?{...m,...updates}:m));
  };

  const totalPred = Object.keys(predictions).length;
  const correctCount = matches.filter(m=>m.status==="completed"&&predictions[m.id]===m.winner).length;
  const myPoints = (user?.points||0) + correctCount*30 + totalPred*5;

  const PAGES = [
    {id:"home",label:"Home",icon:"🏠"},
    {id:"schedule",label:"Schedule",icon:"📅"},
    {id:"results",label:"Results",icon:"🏆"},
  ];

  if (!user) return (
    <>
      <style>{css}</style>
      <div className="app-bg"/><div className="grain"/>
      <div className="app-wrap"><AuthScreen onLogin={handleLogin}/></div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app-bg"/><div className="grain"/>
      <div className="app-wrap">
        <nav>
          <div className="nav-logo">IPL<span>GURU</span></div>
          <div className="nav-tabs">
            {PAGES.map(p=>(
              <button key={p.id} className={`nav-tab${page===p.id?" active":""}`} onClick={()=>setPage(p.id)}>
                {p.icon} {p.label}
              </button>
            ))}
            <button
              className={`nav-tab admin-tab${page==="admin"?" active":""}`}
              onClick={()=>{ if(isAdmin) setPage("admin"); else setShowAdminLogin(true); }}>
              ⚙️ Admin
            </button>
          </div>
          <div className="nav-right">
            <div className="nav-user">
              👤 {user.name.split(" ")[0]}
              <span className="pts-badge">{myPoints}pts</span>
            </div>
            <button className="btn-predict" style={{padding:"7px 12px",fontSize:".75rem"}} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <div className="main">
          {page==="home"&&<HomePage matches={matches} user={{...user,points:myPoints,predictions:totalPred,correct:correctCount}} predictions={predictions} onPredict={handlePredict}/>}
          {page==="schedule"&&<SchedulePage matches={matches} predictions={predictions} onPredict={handlePredict}/>}
          {page==="results"&&<ResultsPage matches={matches} predictions={predictions} user={user}/>}
          {page==="admin"&&isAdmin&&<AdminPanel matches={matches} onUpdateMatch={handleAdminUpdate} onLogout={()=>{setIsAdmin(false);setPage("home");}}/>}
        </div>

        <div className="mobile-nav">
          {PAGES.map(p=>(
            <button key={p.id} className={`mobile-tab${page===p.id?" active":""}`} onClick={()=>setPage(p.id)}>
              <span>{p.icon}</span>{p.label}
            </button>
          ))}
          <button className={`mobile-tab${page==="admin"?" active":""}`}
            onClick={()=>{ if(isAdmin) setPage("admin"); else setShowAdminLogin(true); }}
            style={page==="admin"?{color:"var(--accent2)"}:{}}>
            <span>⚙️</span>Admin
          </button>
        </div>

        {showAdminLogin&&(
          <AdminLoginModal
            onSuccess={()=>{ setIsAdmin(true); setPage("admin"); setShowAdminLogin(false); }}
            onClose={()=>setShowAdminLogin(false)}
          />
        )}
      </div>
    </>
  );
}
