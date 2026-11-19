import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// var config   = (fs.existsSync( '_config.js' )) ? await import( '_config.js' ) : {};                      // .(60609.02.1 RAM ?? not here)
   var LOG_DIR, LOG_FILE, Config_, config = { }                                                             // .(60609.02.2 RAM ?? here)

export const join = path.join;                                                                              // .(60609.02.3 RAM)

export function setEnv( aAppFile ) {
//     console.log( "    aAppFile:   ", aAppFile  )
       aAppFile     =    aAppFile.match( /^file/ ) ? aAppFile : 'file://' + path.resolve( aAppFile.replace( /(^[\\\/][CDEF]+)/i, '' ));
//     console.log( "    aAppPath:", aAppFile  )
//     console.log( "    aAppFile:", fileURLToPath( aAppFile ) )
//     console.log( "   __dirname:   ", path.dirname( fileURLToPath( aAppFile ) ) ); // process.exit()
       config.__dirname               = path.dirname( fileURLToPath( aAppFile ) );
       config.__apppath               = path.dirname( fileURLToPath( aAppFile ) );
       config.__repopath              = config.__apppath.replace( /[\\\/](client|server).+/, "" );
       config.__projpath              = path.dirname( config.__repopath );
       config.__filename              = fileURLToPath( aAppFile );

  var  aEnvPath =  path.join( config.__dirname, '.env' )
       dotenv.config({ path: aEnvPath, quiet: true });
//     console.log( "Current Path:   ", aEnvPath )
       Config_  =  config                                                                                   // .(60406.03.2 RAM Set Config_ here)
return config
       }
//--------------------------------------------------------------------------

// export const getEnv = (aKey) => { return process.env(aKey) || '' }
export function getEnv(aKey) { return process.env[aKey] || '' }

//--------------------------------------------------------------------------
export function chop( n, a ) { return a.length > n ? a.slice(0, n-4) + " ..." : a.padEnd(n) }

//--------------------------------------------------

export const getTS = ( n ) => { var d = new Date();  // 1) 60416,  2) 60405.0955 [defalt], 3, 0416:04.160 4, 2604.Apr
   var s = `${d.getFullYear().toString().slice(-1)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
       s = (n == 4) ? `2${s.slice( 0,3 )}.${d.toString(   ).slice( 4, 7)}` : s;
       s = (n == 5) ?  `${s.slice(6,8)}.${s.slice(-2)}.${d.toISOString().slice(17,21).replace( /\./, '')}` : s  // .(60527.02.1 RAM Add getTS(5))
    return (n == 3) ?  `${s.slice(  -4 )}.${d.toISOString().slice(17,23)}`
        : ((n == 1) ?  `${s.slice( 0,5 )}` : s )
    };
/*
  console.log( 1,   getTS(1) )  // 60416
  console.log( 2,   getTS(2) )  // 60416.0416
  console.log( ' ', getTS( ) )  // 60416.0416
  console.log( 3,   getTS(3) )  // 0416.04.016
  console.log( 4,   getTS(4) )  // 2604.Apr
  console.log( 5,   getTS(5) )  // 04.16.040
*/
//--------------------------------------------------------------------------

// console_log1 (was console_log). THIS-REPO version. Semantics changed for
// Phase 3 (a29-03): it no longer self-derives a path. The caller MUST set a
// preset LOG_FILE first (e.g. via a27_logpath.logFileFor). If LOG_FILE is
// undefined, console_log1 THROWS on the first call (fail-fast at startup).
// Otherwise it keeps the original console_log line format.
var _cl1_began = false;
export const console_log1 = (aMsg, pObj) => {
  if (typeof(LOG_FILE) == 'undefined') {                                                                    // .(60918.04.1 KIRO: require preset LOG_FILE in this script)
      throw new Error('console_log1: LOG_FILE is not set. Assign it (e.g. logFileFor(cfg)) before the first log call.');
      }
  if (!_cl1_began) {                                                                                        // .(60918 RAM: one-time Begin banner)
       _cl1_began = true;
  var aTS = getTS(2)
      LOG_DIR = path.dirname( LOG_FILE )
 if (!fs.existsSync(LOG_DIR)) { fs.mkdirSync( LOG_DIR, { recursive: true } ) };
  var aMsg1 = `\n[${aTS.slice(-4)} 2${aTS.slice(0,5)}]  Begin\n               ${"-".padEnd(93,"-")}`        // .(60406.04.4)
      console.log( aMsg1 )                                                                                  // .(61016.01.1 RAM Echo Begin msg)
      fs.appendFileSync( LOG_FILE, aMsg1 + "\n")                                                            // .(60406.04.4)
      process.env._logFile = LOG_FILE                                                                       // .(60824.04.1 RAM Set Config_ here)
      }
  var aCR = "";  if (aMsg.slice(0,1) == "\n") { aCR = "\n", aMsg  = aMsg.slice(1) }
  var aObj = typeof(pObj) == 'object' ? JSON.stringify(pObj, null, 2) : (pObj || '');                       // .(60609.01.1 RAM allow for string )
      aMsg = aCR + `[${getTS(3)}]  ${aMsg}${aObj ? ' ' + aObj : ''}`;                                       // .(60609.01.2).(60406.04.1)
      console.log( aMsg )                                                                                   // .(60406.04.2)
try { fs.appendFileSync( LOG_FILE,  aMsg + "\n") } catch(e) {} };                                           // .(60824.05.1 KAI)

// Preset the LOG_FILE that console_log1 writes to. Call this ONCE at startup
// (before the first console_log1 call). Pass an absolute file path, e.g.
// logFileFor(ownCfg, new Date()) from a27_logpath.mjs.
export function setLogFile( aFile ) {
  if (!aFile) throw new Error('setLogFile: a file path is required');
  LOG_FILE = aFile;
  LOG_DIR  = path.dirname( aFile );
  _cl1_began = false;                 // re-arm the one-time Begin banner
  return LOG_FILE;
  }
//--------------------------------------------------------------------------

export const getDataDir = (aAppNum) => {
  const dir = path.join(process.cwd(), `../data/sources/DOCs/${config.YM_MTH}/${aAppNum}_${config.PROJ_NAME}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};
//--------------------------------------------------------------------------
export const copyFile = ( a, b ) => { fs.copyFileSync(a, b) }                           // .(60404.01.11 RAM Write copyFile)

export const getJSONfile = (aAppNum, aFileType) => {
  const filePath = path.join(getDataDir(aAppNum), `${aFileType}.json`);
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : '';
};
//--------------------------------------------------------------------------

export const savJSONfile = (aAppNum, aFileType, pJSON) => {
  const dataDir  = getDataDir(aAppNum);
  const jsonPath = path.join(dataDir, `${aFileType}.json`);
  const mdPath   = path.join(dataDir, `${aFileType}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(pJSON, null, 2));
  fs.writeFileSync(mdPath,   fmtVideoResult(pJSON, aFileType));
};
//--------------------------------------------------------------------------

function fmtVideoResult(pJSON, aFileType) {
  const aType = aFileType.replace(/^.+-/, '');
  if (aType === 'transcript' ) return pJSON.map(i => `[${i.start}] ${i.text}`).join('\n');
  if (aType === 'chapters'   ) return pJSON.map(i => `## ${i.timestamp} - ${i.title}`).join('\n');
  if (aType === 'subChapters') return pJSON.map(i => `### ${i.timestamp} - ${i.title}\n${i.description}`).join('\n');
  return JSON.stringify(pJSON);
}
//--------------------------------------------------------------------------

export const getRoutes = (app) => {  // aka listEndpoints                               // .(60531.05.1 RAM Was listEndpoints)
  const endpoints = [];
  let router = app._router;                                                             // .(60531.06.1 RAM Express 4: _router, Express 5: app.router)
  if (!router) { try { router = app.router; } catch(e) { /* Express 4 throws */ } }
  if (!router || !router.stack) return endpoints;

  // Express stores routes in the internal stack
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      endpoints.push({
        method: Object.keys(middleware.route.methods).join(', ').toUpperCase(),
        path: middleware.route.path
      });
    } else if (middleware.name === 'router') {
      // Routes registered via express.Router()
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          endpoints.push({
            method: Object.keys(handler.route.methods).join(', ').toUpperCase(),
            path: `/api${handler.route.path}` // Prefixed with /api per your routes.mjs
          });
        }
      });
    }
  });

//console.log('--- Registered Route Endpoints ---');                                    //#.(60531.05.2)
//endpoints.forEach(e => console.log(`[${e.method}] ${e.path}`));                       //#.(60531.05.3)
//console.log('---------------------------');                                           //#.(60531.05.4)
  return endpoints.sort( (a,b) => a.path >= b.path ? 1 : -1 ).map( r => `${r.method.padEnd(6)} ${r.path}` );  // .(60602.03.1 RAM Add sort).(60531.05.5)
};
//--------------------------------------------------------------------------
/**
 * Calculates the delta in usage and returns a structured report.
 * @param {Object} conn - The VideoDB connection object.
 * @param {Object} pLastUsage - The costMetric object from a previous checkUsage() call.
 * @returns {Promise<Array>} Array of objects: { task: string, units: number, cost: string }
 */
     var TheLastUsage = [];
     var TheLogFile   = '';

function calcCosts(pUsage) {
  var pTotals  = {}
  var pMetrics = pUsage.costMetric;
  var mCosts   = Object.keys(pMetrics).map(key => {
      return pMetrics[key] * pUsage[key]
      } );
      mCosts.push( mCosts.reduce( (a, b) => a + b, 0 )  )      // 31
//    mCosts.push = pUsage.creditBalance                       // 32
//    mCosts.push = pUsage.creditUsed                          // 33
//    mCosts.push = pUsage.creditUsed + pUsage.creditBalance   // 34
      return mCosts;
      }

function fmtCosts( pMetrics, mLastUsage, mCurrUsage) {
  var mCosts   = Object.keys(pMetrics.costMetric).map( (key,i) => {
  var nAmount  = mCurrUsage ? (mCurrUsage[i]  - mLastUsage[i]) : 0;
  var aAmount  = nAmount.toFixed(4).padStart(7).replace( /0+$/, '' ).padEnd(7)
  var nUsage   = (nAmount / (pMetrics.costMetric[key] ? pMetrics.costMetric[key] : 1)).toFixed(4)
  var aMetrics = `${pMetrics.costMetric[key].toString().padEnd(8)} x ${nUsage.padStart(8).replace( /0+$/, '' ).padEnd(8)}`
      return `${ (i+0).toFixed(0).padStart(4) }. ${(key + ":").padEnd(20)} ${aAmount}  ( ${aMetrics})`
      } )
      return mCosts.filter( (aRow,i) => (aRow.slice(25,36) * 1) > 0 )
      }

export async function getCosts(conn, aCmd, aAppDir, aTask ) {   // .()
  var pUsage  = await conn.checkUsage();
//var aAppNo  = aAppNo  ? aAppNo  : "a00-00",         aYrMth = getTS(4);
  var aAppDir = aAppDir ? aAppDir : "a00-00_videodb", aYrMth = getTS(4);

//var aLogDir = path.join( config.__projpath, "._", "LOGs", `${aAppNo}_videodb` )
//var aLogDir = path.join( config.__projpath, "._", "LOGs", aYrMth, `${aAppDir}_v${ getTS(1)}.LOGs` )       //#.(60406.02.3)
  var aLogDir = LOG_DIR                                                                                     // .(60406.02.3)
//    aLogDir =        "../._/LOGs/${aYrMth}/${aAppNo}_videodb_v${aTS}.LOGs
//#"E:\Repos\Robin\YTVids_\._\LOGs\2604.Apr\a15-02_videodb_v60403.LOGs\videodb_v60403.1927.log"

//if (!fs.existsSync(aLogDir)) { fs.mkdirSync( aLogDir, { recursive: true } ) };                            // .(60406.02.4)
  var TheLogFile = LOG_FILE                                                                                 // .(60406.02.5)

  if (aCmd === 'reset') {
//    TheLastUsage.length = 0; // Clear the array
      TheLastUsage  = calcCosts( pUsage )
//    TheLogFile    = path.join( aLogDir, `${aAppDir.slice(0,6)}_videodb_v${getTS()}.log` )                 // .(60406.02.6 RAM ?)
      return
      }
  if (aCmd === 'show') {
  if (TheLastUsage.length == 0) { TheLastUsage = calcCosts( pUsage )
//    TheLogFile    = path.join( aLogDir, `${aAppDir.slice(0,6)}_videodb_v${getTS()}.log` )                 // .(60406.02.7 RAM ?)
      }
  var mCosts = fmtCosts( pUsage, Array(31).fill(0), TheLastUsage )
     console.log("\n      Current Usage        Amount     Price       Units")
     console.log(  "  --- ------------------- --------   ---------   --------")
      mCosts.push( `  32. Total  Usage:       ${ TheLastUsage[31].toFixed(4).padStart(8)}` )
      mCosts.push( `  33. Credit Usage:       ${ pUsage.creditUsed.toFixed(2).padStart(6)}` )
      mCosts.push( `  34. Credit Balance:     ${ pUsage.creditBalance.toFixed(2).padStart(6)}` )
      mCosts.push( `  35. Credit Month Total: ${(pUsage.creditUsed + pUsage.creditBalance).toFixed(2).padStart(6)}` )
     console.log( mCosts.join('\n', "" ) )
//    TheLastUsage = Array(31).fill(0)
      fs.appendFileSync( TheLogFile, "\n      Current Usage        Amount     Price       Units  \n" )
      fs.appendFileSync( TheLogFile,   "  --- ------------------- --------   ---------   --------\n" )
      fs.appendFileSync( TheLogFile, mCosts.join('\n', "" ) + "\n")
      return mCosts
      }
  if (aCmd === 'usage') {
  var mCurrUsage = calcCosts(pUsage)
  var mCosts = fmtCosts( pUsage, TheLastUsage, mCurrUsage)
      pUsage.creditBalance = pUsage.creditBalance + mCurrUsage[31]
     console.log(`\n      New Usage ${ typeof(aTask) != `undefined` ? `for ${aTask}` : '' }` )
     console.log(  "  --- ------------------- --------   ---------   --------")
      mCosts.push( `  32. Total  Usage:       ${ mCurrUsage[31].toFixed(2).padStart(6)}` )
//    mCosts.push( `  34. Credit Balance:     ${(pUsage.creditBalance).toFixed(2).padStart(6)}` )
//   console.log( mCosts.map(aRow => aRow.slice(34)).join('\n') )
     console.log( mCosts.join('\n'), "\n" )
      TheLastUsage = mCurrUsage
      fs.appendFileSync( TheLogFile, `\n      New Usage ${ typeof(aTask) != `undefined` ? `for ${aTask}` : '' }\n` )
      fs.appendFileSync( TheLogFile, mCosts.join('\n', "" ) + "\n\n" )
      return mCosts
      }
  }
//--------------------------------------------------------------------------

export function prtArray( mData, aFmt, aFlds ) {
   var mFmts =  aFmt.split( "%" ).map( a => { var m = a.match( /([-0-9]+)([nsdt])(.*)/ ); return m ? m.slice(1,4) : [,,,] } )
   var mFlds =  aFlds.split( "," ); var b = mFmts.length == mFlds.length + 2; var mFmts1 = mFmts; mFmts = mFmts.slice(1 + b)
 const pick  = (pRow, mFlds) => Object.fromEntries( mFlds.map(f => [ f.toLowerCase(), pRow[f] ] ) );
   var mRecs =  mData.map( (pRow) => Object.entries(pick( pRow, mFlds)).map( ([k, v],i) => fmtCell( mFmts[i], v)).join("") )
   if (b) { mRecs = mRecs.map( (aRec, i) => `${ fmtCell(mFmts1[1], i) }${aRec}` ) }
return mRecs
  function fmtCell(mFmt, aVal) {
     var a
     switch (mFmt[1]) {
       case 's': a =  aVal; break;
       case 'n': a =  Number(aVal).toLocaleString('en-US'); break;
       case 't': a = `${fmtDate(aVal,2)}s`; break;
       case 'd': a =    fmtDate(aVal,3); break;
        default: a = ""
       }
//   a = mFmt[0] > 0 ? a.padEnd( mFmt[0] )    : a.padStart( -mFmt[0] )
     a = mFmt[0] > 0 ?     chop( mFmt[0], a ) : a.padStart( -mFmt[0] )
     return a + mFmt[2]
     }
   }

/*
 const pick  = (obj, fields) => Object.fromEntries( fields.map((k) => [k, obj[k] ] ));
 const slim  =  array.map((row) => pick(row, ['Name', 'Type', 'Timestamp', 'Length', 'Size']);

array.map(({ Name, Type, Timestamp, Length, Size }, i) => (
        {i,  Name, Type, Timestamp, Length, Size} ) );
*/

function fmtDate(d,n) { n = n ? n : 3
     var sec = d; if (n != 2) { var dte = new Date(d); var sec = dte.getHours() * 3600 + dte.getMinutes() * 60 + dte.getSeconds(); }
   const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
   const t = h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
                   :                              `${m}:${String(s).padStart(2,'0')}`;
         d = (n != 2) ? `${String(dte.getMonth())}/${dte.getDate()}/${dte.getFullYear()}` : ''
 return `${ (n == 1 || n == 3) ? d : '' } ${ (n == 2 || n == 3) ? t : '' }`.trim()
             }