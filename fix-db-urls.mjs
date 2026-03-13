import mysql from 'mysql2/promise';

const urlMap = {
  '/clothing-1.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/oUpNzfPcbhUHbRye.png',
  '/clothing-2.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ZinvulEMVxpNIGyJ.png',
  '/clothing-3.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/QSAqfQCNmbZsfxBo.png',
  '/clothing-4.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/jAWiYlvJMtCFAuLP.png',
  '/clothing-5.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/fVafAPEKiAMmWCsj.png',
  '/clothing-6.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/WyqajVmemgHTbDsJ.png',
  '/clothing-7.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/UAucBQSsYsMVxNWI.png',
  '/clothing-8.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DWVExffDwhSTVioN.png',
  '/clothing-9.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/QpkLPVQnkLGsDRll.png',
  '/clothing-10.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/vurGBookwoQMNDZI.png',
  '/clothing-11.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/MNVKJZeUpfexfynK.png',
  '/hair-1.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/zINkLWrJClXSvLaZ.png',
  '/hair-2.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/oaePHoNmNErTpspk.png',
  '/hair-3.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/pijdNELiKHXVAZoi.png',
  '/hair-4.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/vCZvTBIRkxVAZBaB.png',
  '/hair-5.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/igqtUKRgAyKkCIrY.png',
  '/face-1.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/dONsdXprKDmwjpxE.png',
  '/face-2.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/fYJaCqnWtOMXweQt.png',
  '/face-3.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/PLZbNXgzVopQugeZ.png',
  '/face-4.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/KQwzdOHoNNaAwKKE.png',
  '/face-5.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/rlAJdkliJyzdDdHW.png',
  '/accessories-1.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/SJfgimulDwFrabVd.png',
  '/accessories-2.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/kMnKjQCKicjqPnhu.png',
  '/accessories-3.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ISuzPPkABiEVLkHD.png',
  '/accessories-4.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DhfOMDCNJjHolrpq.png',
  '/accessories-5.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DXSTjBSeSElktKZy.png',
  '/avatar-template-1.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/NyAfzOEwWRUShOjZ.png',
  '/avatar-template-2.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/stRdvuQAshXzMcsq.png',
  '/avatar-template-3.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/rrXfQANzrYJjROfT.png',
  '/avatar-template-4.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/yFHdiYIfyIfTRzIj.png',
  '/avatar-template-5.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/cZGeOhQAzcTIlDgk.png',
  '/starter-pack.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/KpRsFfJIzTmaDjij.png',
  '/fantasy-pack.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/CPAUlZiQbRjrTRUs.png',
  '/scifi-pack.png': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DjoBrKZsfQaLtKNz.png',
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const [localPath, cdnUrl] of Object.entries(urlMap)) {
    const [result] = await conn.execute(
      'UPDATE storeItems SET thumbnailUrl = ? WHERE thumbnailUrl = ?',
      [cdnUrl, localPath]
    );
    if (result.affectedRows > 0) {
      console.log(`✓ Updated ${localPath} -> CDN (${result.affectedRows} rows)`);
    }
  }
  
  // Verify
  const [rows] = await conn.execute('SELECT id, name, thumbnailUrl FROM storeItems LIMIT 5');
  console.log('\nVerification (first 5):');
  rows.forEach(r => console.log(`  ${r.name}: ${r.thumbnailUrl.substring(0, 60)}...`));
  
  await conn.end();
  console.log('\n✓ All database URLs updated to CDN!');
}

main().catch(console.error);
