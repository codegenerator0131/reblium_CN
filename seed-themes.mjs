import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);

// Sci-Fi items (Cyborg & Robotic theme)
const scifiItems = [
  { name: "Cyborg Skeleton", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/wGTpLzHbmeGxYapq.jpg", personalUSD: 35, personalCNY: 252, commercialUSD: 70, commercialCNY: 504 },
  { name: "Mech Warrior", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/TQzWHnBUjOSJHuoz.jpg", personalUSD: 40, personalCNY: 288, commercialUSD: 80, commercialCNY: 576 },
  { name: "Neural Interface Suit", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/BQUFSQawbrbnkSMH.jpg", personalUSD: 45, personalCNY: 324, commercialUSD: 90, commercialCNY: 648 },
  { name: "Cybernetic Enforcer", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/eirdoLJXelctrqjs.jpg", personalUSD: 38, personalCNY: 274, commercialUSD: 76, commercialCNY: 547 },
  { name: "Robotic Exosuit", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/tdlpxCBeOKvAXqrZ.jpg", personalUSD: 42, personalCNY: 302, commercialUSD: 84, commercialCNY: 605 },
  { name: "Plasma Core Armor", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/lwZyfyZiRgnfzKwS.jpg", personalUSD: 50, personalCNY: 360, commercialUSD: 100, commercialCNY: 720 },
  { name: "Android Chassis", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/kTlLSSwOeGIQegsQ.jpg", personalUSD: 35, personalCNY: 252, commercialUSD: 70, commercialCNY: 504 },
  { name: "Neon Circuit Body", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/OLJRCMZbBcpGopNo.jpg", personalUSD: 38, personalCNY: 274, commercialUSD: 76, commercialCNY: 547 },
  { name: "Stealth Recon Unit", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/nHDCemMHcLIPymPn.jpg", personalUSD: 45, personalCNY: 324, commercialUSD: 90, commercialCNY: 648 },
  { name: "Heavy Assault Mech", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/HsTzDSKcWroFKrOx.jpg", personalUSD: 55, personalCNY: 396, commercialUSD: 110, commercialCNY: 792 },
  { name: "Synth Operative", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/eaunVwMouiAWHohD.jpg", personalUSD: 40, personalCNY: 288, commercialUSD: 80, commercialCNY: 576 },
  { name: "Quantum Processor Suit", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/RRFZwuCueLpYvgCw.jpg", personalUSD: 48, personalCNY: 346, commercialUSD: 96, commercialCNY: 691 },
  { name: "Biotech Hybrid", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/rSfTgezwzUJTSVWL.jpg", personalUSD: 42, personalCNY: 302, commercialUSD: 84, commercialCNY: 605 },
  { name: "Chrome Sentinel", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/oMGPxVYvlXWCCENi.jpg", personalUSD: 44, personalCNY: 317, commercialUSD: 88, commercialCNY: 634 },
  { name: "Titanium Vanguard", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/JSbmhWFKuasGAhLf.jpg", personalUSD: 46, personalCNY: 331, commercialUSD: 92, commercialCNY: 662 },
  { name: "Nano Fiber Suit", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/xMznKlZuRyegIebK.jpg", personalUSD: 38, personalCNY: 274, commercialUSD: 76, commercialCNY: 547 },
  { name: "EMP Disruptor", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/XhBRNuvsBnlbaPXD.jpg", personalUSD: 40, personalCNY: 288, commercialUSD: 80, commercialCNY: 576 },
  { name: "Photon Blade Runner", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/phNjwRNdcYJlGukp.jpg", personalUSD: 52, personalCNY: 374, commercialUSD: 104, commercialCNY: 749 },
  { name: "Zero-G Combat Suit", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/bJlmPauYyAzIxMYS.jpg", personalUSD: 48, personalCNY: 346, commercialUSD: 96, commercialCNY: 691 },
];

// Fantasy items (Warrior, Knight & Sentinel theme)
const fantasyItems = [
  { name: "Ancient Guardian", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/cCJRWwrMdEaxWhkj.jpg", personalUSD: 35, personalCNY: 252, commercialUSD: 70, commercialCNY: 504 },
  { name: "Dragon Slayer Armor", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ODzrXyIbWXdmvDLJ.jpg", personalUSD: 45, personalCNY: 324, commercialUSD: 90, commercialCNY: 648 },
  { name: "Shadow Knight", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/BqpuAacwuzqmZnrn.jpg", personalUSD: 40, personalCNY: 288, commercialUSD: 80, commercialCNY: 576 },
  { name: "Elven Sentinel", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/nKnuXddjUehabsyt.jpg", personalUSD: 42, personalCNY: 302, commercialUSD: 84, commercialCNY: 605 },
  { name: "Holy Paladin", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ZSjoCJLmjUUApXmL.jpg", personalUSD: 48, personalCNY: 346, commercialUSD: 96, commercialCNY: 691 },
  { name: "Rune Guardian", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/FxPNCgNXPVlCYnWk.jpg", personalUSD: 50, personalCNY: 360, commercialUSD: 100, commercialCNY: 720 },
  { name: "Frost Warrior", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/wrFrTThGxRVQPvff.jpg", personalUSD: 38, personalCNY: 274, commercialUSD: 76, commercialCNY: 547 },
  { name: "Crimson Berserker", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/fhjZlMRAkRzkFxyV.jpg", personalUSD: 44, personalCNY: 317, commercialUSD: 88, commercialCNY: 634 },
  { name: "Storm Herald", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/wWJMBThcIFJPySSu.jpg", personalUSD: 46, personalCNY: 331, commercialUSD: 92, commercialCNY: 662 },
  { name: "Ironclad Champion", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ptGaXjJwQrbEMpPY.jpg", personalUSD: 52, personalCNY: 374, commercialUSD: 104, commercialCNY: 749 },
  { name: "Void Sentinel", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/snCeYNAGZGDRiipR.jpg", personalUSD: 40, personalCNY: 288, commercialUSD: 80, commercialCNY: 576 },
  { name: "Arcane Templar", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/xwrPpeHPZJgaVrQX.jpg", personalUSD: 45, personalCNY: 324, commercialUSD: 90, commercialCNY: 648 },
  { name: "Obsidian Knight", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/pvnaclgwqwJGDBGj.jpg", personalUSD: 48, personalCNY: 346, commercialUSD: 96, commercialCNY: 691 },
  { name: "Golden Warden", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DcrhdCIIahpNmbjO.jpg", personalUSD: 55, personalCNY: 396, commercialUSD: 110, commercialCNY: 792 },
  { name: "Phantom Assassin", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/qyiUsEdRpgVkaZqd.jpg", personalUSD: 42, personalCNY: 302, commercialUSD: 84, commercialCNY: 605 },
  { name: "Crystal Mage Armor", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/iJGAwRybamOvRtgJ.jpg", personalUSD: 38, personalCNY: 274, commercialUSD: 76, commercialCNY: 547 },
  { name: "Warlord Plate", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/VBRBDTIwBGQTtAIz.jpg", personalUSD: 50, personalCNY: 360, commercialUSD: 100, commercialCNY: 720 },
  { name: "Celestial Avenger", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/LsDSagMTlgiZCepm.jpg", personalUSD: 55, personalCNY: 396, commercialUSD: 110, commercialCNY: 792 },
  { name: "Mythic Conqueror", thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/lAkyGFVDMZUYDWfi.jpg", personalUSD: 60, personalCNY: 432, commercialUSD: 120, commercialCNY: 864 },
];

const sql = `INSERT INTO storeItems (name, description, category, thumbnailUrl, thumbnailKey, personalPriceUSD, personalPriceCNY, commercialPriceUSD, commercialPriceCNY, artistName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

try {
  for (const item of scifiItems) {
    await connection.execute(sql, [
      item.name,
      `${item.name} - Premium Sci-Fi themed avatar clothing by Andre Ferwerda`,
      "sci-fi",
      item.thumbnail,
      item.thumbnail,
      item.personalUSD,
      item.personalCNY,
      item.commercialUSD,
      item.commercialCNY,
      "Andre Ferwerda"
    ]);
  }
  console.log(`Inserted ${scifiItems.length} Sci-Fi items`);

  for (const item of fantasyItems) {
    await connection.execute(sql, [
      item.name,
      `${item.name} - Premium Fantasy themed avatar armor by Andre Ferwerda`,
      "fantasy",
      item.thumbnail,
      item.thumbnail,
      item.personalUSD,
      item.personalCNY,
      item.commercialUSD,
      item.commercialCNY,
      "Andre Ferwerda"
    ]);
  }
  console.log(`Inserted ${fantasyItems.length} Fantasy items`);
  console.log("Done! Total new items:", scifiItems.length + fantasyItems.length);
} catch (err) {
  console.error("Error:", err.message);
}

await connection.end();
