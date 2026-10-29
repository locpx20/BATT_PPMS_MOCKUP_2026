/* Regression checks for the documented prototype workflows. No browser data is read or changed. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function harness() {
  const root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [], append() {} };
  const error = {hidden:true, textContent:''};
  const document = { getElementById(id) {return id === 'app' ? root : id === 'form-errors' ? error : null;},
    querySelector: () => null, querySelectorAll: () => [], activeElement:null };
  const storage={fail:false,getItem(){return null;},setItem(){if(this.fail)throw Error('quota');},removeItem(){}};
  const context = vm.createContext({window:{addEventListener(){}}, document, localStorage:storage,
    history:{replaceState(){},pushState(){}}, location:{hash:'#/login'}, structuredClone, Intl, Date, console, setTimeout, clearTimeout, CSS:{escape:s=>s}});
  let source = fs.readFileSync(path.join(__dirname, '..', 'app.js'),'utf8');
  const end = /  render\(\);\s*\}\)\(\);\s*$/;
  assert.match(source,end,'test instrumentation must target only the startup render');
  source = source.replace(end, `
  const originalRender=render;
  render=()=>{};
  notify=(message,error=false)=>window.messages.push({message,error});
  openCustomModal=(title,body)=>{window.modalMarkup={title,body};};
  closeModal=()=>{state.modal=null;};
  formDataObject=async()=>window.nextFormValues;
  window.messages=[];
  window.testApi={state,lookup,allowedPages,visiblePage,canAccessRecord,detailActions,formConfig,renderForm,renderLogin,renderDetail,renderTable,TABLES,
    createProcurement,createPurchase,createPlan,submitShiftReport,createIncident,saveDirectory,saveAccount,saveFinance,saveBag,
    runAction,receiveFinished,requestMaterial,recordMaterialPurchase,submitRepairReport,availableBags,fifoBags,createShipment,dispatchShipment,
    verifyPickup,approveSale,proposeCustomer,customerResponse,openDetail,restoreRoute,openModal,submitForm,originalRender,normalizedLogin,findUser,maskPhone,parseLocalizedNumber,saveData,recordFinancePayment};
})();`);
  vm.runInContext(source, context, {filename:'app.js'});
  const a=context.window.testApi;
  a.role=(role)=>{const u=a.state.data.users.find(x=>x.role===role);a.state.role=role;a.state.userId=u.id;a.state.selected=null;a.state.page=a.allowedPages()[0];};
  a.submit=async(type,values,extra={})=>{a.state.modal={type,...extra};context.window.nextFormValues=values;error.hidden=true;error.textContent='';const submit={disabled:false};await a.submitForm({preventDefault(){},currentTarget:{querySelector(){return submit;},querySelectorAll(){return [];}}});return error;};
  a.root=root;a.messages=context.window.messages;a.modalMarkup=()=>context.window.modalMarkup;a.storage=storage;
  return a;
}

const tests=[];
const test=(name,run)=>tests.push({name,run});
const photo={name:'evidence.png',type:'image/png',dataUrl:'data:image/png;base64,AA=='};
const actions=(a,module,row)=>a.detailActions(module,row,module==='procurement'&&!!row.parent).map(x=>x.action);

test('Admin has accounts only and no operational record access',()=>{
  const a=harness();a.role('admin');assert.deepEqual([...a.allowedPages()],['accounts']);
  for(const [module,id] of [['procurement','TMM-26042'],['production','SX-261030-A'],['incidents','SC-261030-03'],['quality','QC-261029-B'],['shipments','XK-26033'],['suppliers','NCC-014'],['customers','KH-031'],['finance','TC-261030-05'],['inventory','NVL-01']])assert.equal(a.canAccessRecord(module,id),false,module);
});

test('Purchaser sees supplier contacts and only authorized procurement work',()=>{
  const a=harness();a.role('purchasing');assert.equal(a.canAccessRecord('suppliers','NCC-014'),true);assert.equal(a.canAccessRecord('customers','KH-031'),false);
  assert.equal(a.canAccessRecord('procurement','TMM-26041'),false,'pending Owner cap must not reach purchaser');
  assert.equal(a.TABLES.procurement.get().some(x=>x.id==='TMM-26041'),false);
  a.state.data.procurement[0].assigned=[];assert.equal(a.canAccessRecord('procurement','TMM-26042'),false);
});

test('Owner creates immediate work; Manager cap adjustment requires separate Owner approval',async()=>{
  const a=harness();a.role('owner');a.createProcurement({quantity:1000,cap:1400,assigned:['U-004']});assert.equal(a.lookup(...a.state.selected.split(':')).status,'Đang thu mua');
  a.role('manager');a.createProcurement({quantity:2000,cap:1500,assigned:['U-004']});const r=a.lookup(...a.state.selected.split(':'));assert.equal(r.status,'Chờ Owner duyệt giá trần');
  a.runAction('approve-cap',true);assert.equal(r.status,'Chờ Owner duyệt giá trần');
  a.role('owner');a.state.selected='procurement:'+r.id;const id=r.id;await a.submit('owner-cap',{cap:1450});assert.equal(r.id,id);assert.equal(r.cap,1450);assert.equal(r.status,'Chờ Owner duyệt giá trần');
  a.runAction('approve-cap',true);assert.equal(r.status,'Đang thu mua');
});

test('Child purchase requires assignment and approved active parent',()=>{
  const a=harness();a.role('purchasing');const v={parent:'TMM-26041',supplier:'NCC-014',weight:100,price:1300,photo};assert.throws(()=>a.createPurchase(v));
  v.parent='TMM-26042';a.createPurchase(v);const r=a.lookup(...a.state.selected.split(':'));assert.equal(r.status,'Chờ duyệt cân');assert.equal(r.supplier,'NCC-014');assert.ok(a.state.data.procurement.find(x=>x.id===v.parent).children.includes(r.id));
});

test('Warehouse opens approved receipt, confirms actual weight once, keeps history and image',()=>{
  const a=harness();const r=a.lookup('procurement','PM-26018');r.status='Chờ kho xác nhận nhập';r.receivedWeight=9500;const oldPhoto=r.photo;const oldHistory=[...r.history];a.role('warehouse');
  a.openDetail('procurement',r.id);a.originalRender();assert.equal(a.state.selected,'procurement:'+r.id,'route must survive render');assert.match(a.root.innerHTML,/PM-26018/);
  const inv=a.state.data.inventory.find(x=>x.category==='Nguyên vật liệu thô');const before=inv.quantity;
  a.runAction('receive-raw',true);assert.equal(r.status,'Đã nhập kho');assert.equal(inv.quantity,before+9500);assert.equal(r.photo,oldPhoto);assert.deepEqual([...r.history].slice(0,oldHistory.length),oldHistory);
  a.runAction('receive-raw',true);assert.equal(inv.quantity,before+9500,'duplicate confirmation must not add stock');
});

test('Owner and Manager can reach pending QC details and approve separately',()=>{
  for(const role of ['owner','manager']){const a=harness();a.role(role);const q=a.lookup('quality','QC-261029-B');q.status='Chờ duyệt';a.openDetail('quality',q.id);a.originalRender();assert.equal(a.state.selected,'quality:'+q.id);assert.ok(actions(a,'quality',q).includes('act:approve-qc'));assert.ok(a.detailActions('quality',q,false).some(x=>/Điều chỉnh/.test(x.label)));}
});

test('QC requires both evidence images for every bag before submit',()=>{
  const a=harness();a.role('qc');const q=a.lookup('quality','QC-261029-B');a.state.selected='quality:'+q.id;
  a.runAction('submit-qc',true);assert.equal(q.status,'Chờ kiểm tra');
  for(const b of q.bags)a.saveBag(q.id,b.no,{ash:0,impurities:0,sampleGrams:10,samplePhoto:photo,afterPhoto:photo,warehouse:b.no%2?'Kho A':'Kho B'});
  a.runAction('submit-qc',true);assert.equal(q.status,'Chờ duyệt');assert.ok(q.bags.every(b=>b.samplePhoto.dataUrl&&b.afterPhoto.dataUrl));
});

test('QC approval handoff adds classified bags to correct warehouses only once',()=>{
  const a=harness();const q=a.lookup('quality','QC-261029-B');q.status='Chờ duyệt';q.bags.forEach((b,i)=>Object.assign(b,{ash:0,impurities:0,sampleGrams:10,samplePhoto:photo,afterPhoto:photo,warehouse:i%2?'Kho A':'Kho B'}));a.role('manager');a.state.selected='quality:'+q.id;a.runAction('approve-qc',true);assert.equal(q.status,'Chờ kho xác nhận nhập');
  a.role('warehouse');a.state.selected='quality:'+q.id;const before=a.state.data.bagStocks.length;a.receiveFinished();assert.equal(a.state.data.bagStocks.length,before+8);assert.equal(a.state.data.bagStocks.filter(b=>b.qcId===q.id&&b.warehouse==='Kho A').length,4);assert.equal(q.status,'Đã nhập kho');
  try{a.receiveFinished();}catch{}assert.equal(a.state.data.bagStocks.length,before+8);
});

test('Maintenance receives recorded purchase and heavy machine restarts only after approval',()=>{
  const a=harness();const r=a.lookup('incidents','SC-261030-03');a.role('manager');a.state.selected='incidents:'+r.id;a.recordMaterialPurchase({materials:'Vòng bi 6205',purchaseCost:2800000});assert.equal(r.materialPurchaseRecorded,true);assert.equal(r.materialStatus,'Đã ghi nhận mua');
  a.role('maintenance');a.state.selected='incidents:'+r.id;assert.ok(actions(a,'incidents',r).includes('act:receive-materials'));a.runAction('receive-materials',true);assert.equal(r.materialsReceived,true);
  a.submitRepairReport({repairStatus:'Đang hoạt động',materialsUsed:'Vòng bi 6205',repairPhoto:photo});assert.equal(r.status,'Chờ duyệt sau sửa chữa');
  a.role('manager');a.state.selected='incidents:'+r.id;a.runAction('approve-repair',true);assert.equal(r.status,'Đang hoạt động');assert.equal(r.repairApprovalStatus,'Đã duyệt');
  a.role('maintenance');assert.ok(!actions(a,'incidents',r).includes('act:start-repair'),'approved repair cannot restart');
});

test('Owner inherits Manager contact and pickup actions',()=>{
  const a=harness();a.role('owner');const r=a.lookup('shipments','XK-26031');r.contactStatus='Chờ liên hệ';r.status='Chờ Manager liên hệ';assert.ok(actions(a,'shipments',r).includes('act:customer-response'));r.contactStatus='Khách đồng ý mua';r.receiver='';assert.ok(actions(a,'shipments',r).includes('act:pickup-info'));r.status='Trả Manager cập nhật';assert.ok(actions(a,'shipments',r).includes('edit:shipment'));
});

test('Pending purchase adjustment preserves code/evidence/history and still needs approval',async()=>{
  const a=harness();a.role('manager');const r=a.lookup('procurement','PM-26018');r.photo=photo;a.state.selected='procurement:'+r.id;
  const initialHistory=[...r.history];const error=await a.submit('purchase-adjust',{supplier:r.supplier,weight:9550,price:1385,photo,invoice:r.invoice},{edit:true});assert.equal(error.hidden,true,error.textContent);assert.equal(r.id,'PM-26018');assert.equal(r.status,'Chờ duyệt cân');assert.equal(r.weight,9550);assert.equal(r.photo.dataUrl,photo.dataUrl);assert.deepEqual([...r.history].slice(0,initialHistory.length),initialHistory);
  a.runAction('approve-purchase',true);assert.equal(r.status,'Chờ kho xác nhận nhập');
});

test('Pending QC adjustment keeps all bags and evidence until separate approval',async()=>{
  const a=harness();a.role('manager');const q=a.lookup('quality','QC-261029-B');q.status='Chờ duyệt';a.state.selected='quality:'+q.id;const values={};q.bags.forEach(b=>{Object.assign(b,{ash:0,impurities:0,sampleGrams:10,samplePhoto:photo,afterPhoto:photo,warehouse:'Kho A'});for(const field of ['ash','impurities','sampleGrams','samplePhoto','afterPhoto','warehouse'])values[field+'_'+b.no]=b[field];});values.warehouse_1='Kho B';
  const error=await a.submit('qc-adjust',values,{edit:true});assert.equal(error.hidden,true,error.textContent);assert.equal(q.id,'QC-261029-B');assert.equal(q.status,'Chờ duyệt');assert.equal(q.bags.length,8);assert.equal(q.bags[0].warehouse,'Kho B');assert.equal(q.bags[0].samplePhoto.dataUrl,photo.dataUrl);assert.ok(q.attachmentHistory.length);
});

test('Production consumes actual raw stock once and generates unique traceable bags',()=>{
  const a=harness();a.role('production');const p=a.lookup('production','SX-261030-A');a.state.selected='production:'+p.id;const raw=a.state.data.inventory.find(x=>x.category==='Nguyên vật liệu thô');const before=raw.quantity;a.submitShiftReport({materialUsed:1000,output:900,bags:3,photo});assert.equal(raw.quantity,before-1000);assert.equal(p.status,'Chờ QC');const q=a.state.data.qcLots.find(x=>x.plan===p.id);assert.equal(q.bags.length,3);assert.equal(new Set(q.bags.map(x=>x.code)).size,3);assert.ok(q.bags.every(x=>x.code.startsWith(p.lot)));
  assert.throws(()=>a.submitShiftReport({materialUsed:1000,output:900,bags:3,photo}));assert.equal(raw.quantity,before-1000);
});

test('Severe stopped machine cannot be scheduled; mild machine remains available',()=>{
  const a=harness();a.role('manager');const v={date:'2026-10-30',shift:'Ca sáng · 06:00–14:00',machine:'Máy ép viên 03',workers:['U-003'],target:1000};assert.throws(()=>a.createPlan(v));v.machine='Máy sấy 01';a.createPlan(v);assert.equal(a.lookup(...a.state.selected.split(':')).machine,'Máy sấy 01');
});

test('5/4/2/9 chronological batches select 12 bags; only real dispatch reduces stock',()=>{
  const a=harness();a.role('warehouse');a.state.data.bagStocks=[];a.state.data.plans=[];
  [5,4,2,9].forEach((count,i)=>{const lot='LOT-TEST-'+i;a.state.data.plans.push({id:'SX-TEST-'+i,lot,date:`${String(i+1).padStart(2,'0')}.10.2026`});for(let j=1;j<=count;j++)a.state.data.bagStocks.push({id:`${lot}-${String(j).padStart(3,'0')}`,lot,warehouse:'Kho A',status:'Trong kho'});});
  a.createShipment({warehouse:'Kho A',quantity:12});const r=a.lookup(...a.state.selected.split(':'));assert.equal(a.availableBags('Kho A').length,20);assert.deepEqual([...r.bagIds].map(id=>id.slice(0,-4)).reduce((out,lot)=>(out[lot]=(out[lot]||0)+1,out),{}),{'LOT-TEST-0':5,'LOT-TEST-1':4,'LOT-TEST-2':2,'LOT-TEST-3':1});
  r.ownerApproved=true;r.receiver='Nguyễn Văn A';r.plate='49C-123.45';r.status='Chờ nhận hàng';a.verifyPickup({actualReceiver:r.receiver,actualPlate:'WRONG',match:'match'});assert.equal(r.status,'Trả Manager cập nhật');assert.equal(a.availableBags('Kho A').length,20);
  r.status='Chờ nhận hàng';a.verifyPickup({actualReceiver:r.receiver,actualPlate:r.plate,match:'match'});assert.equal(r.status,'Đã đối chiếu khớp');a.dispatchShipment({quantity:12,photo});assert.equal(a.availableBags('Kho A').length,8);assert.equal(r.actualBagIds.length,12);assert.equal(r.status,'Đã xuất kho');
});

test('Owner directory create/edit/deactivate/reactivate keeps identity and history',()=>{
  for(const type of ['supplier','customer']){const a=harness();a.role('owner');const key=type==='supplier'?'suppliers':'customers';a.saveDirectory(type,{id:'TEST-'+type,name:'Hồ sơ thử',contact:'Nguyễn A',phone:'0900000000',address:'Địa chỉ'},false);const r=a.lookup(...a.state.selected.split(':'));const id=r.id;r.attachments=[photo];const before=r.history.length;
  a.saveDirectory(type,{id:'CHANGED',name:'Hồ sơ đã sửa',contact:'Nguyễn B',phone:'0900000001',address:'Mới'},true);assert.equal(r.id,id);assert.equal(r.name,'Hồ sơ đã sửa');assert.ok(r.history.length>before);assert.equal(r.attachments[0].dataUrl,photo.dataUrl);
  a.runAction('toggle-directory',true);assert.equal(r.status,'Ngừng hợp tác');assert.ok(a.state.data[key].includes(r));a.runAction('toggle-directory',true);assert.equal(r.status,'Đang hợp tác');
  a.role('manager');const count=a.state.data[key].length;try{a.saveDirectory(type,{id:'UNAUTHORIZED',name:'X'},false);}catch{}assert.equal(a.state.data[key].length,count);
  }
});

test('Recovery reveals three sequential stages, rejects wrong OTP, updates only after valid OTP',async()=>{
  const a=harness();a.state.role=null;a.state.userId=null;a.state.modal={type:'forgot',stage:'account'};let cfg=a.formConfig('forgot',{});assert.deepEqual([...cfg.fields].map(x=>x.name),['identifier']);
  await a.submit('forgot',{identifier:'owner'},{stage:'account'});assert.equal(a.state.modal.stage,'otp');const userId=a.state.modal.userId;cfg=a.formConfig('forgot',{});assert.deepEqual([...cfg.fields].map(x=>x.name),['otp']);assert.ok(!a.renderForm(cfg,{}).includes('123456'));
  let error=await a.submit('forgot',{otp:'654321'},{stage:'otp',userId});assert.equal(error.hidden,false);assert.equal(a.state.modal.stage,'otp');assert.equal(a.state.data.users.find(x=>x.id===userId).password,undefined);
  await a.submit('forgot',{otp:'123456'},{stage:'otp',userId});assert.equal(a.state.modal.stage,'password');cfg=a.formConfig('forgot',{});assert.deepEqual([...cfg.fields].map(x=>x.name),['next','confirm']);
  error=await a.submit('forgot',{next:'new-pass',confirm:'wrong'},{stage:'password',userId});assert.equal(error.hidden,false);
  await a.submit('forgot',{next:'new-pass',confirm:'new-pass'},{stage:'password',userId});assert.equal(a.state.data.users.find(x=>x.id===userId).password,'new-pass');assert.equal(a.state.modal,null);
});

test('Login is empty, username/phone only, numbers parse Vietnamese notation',()=>{
  const a=harness();const html=a.renderLogin();assert.match(html,/Tên đăng nhập hoặc số điện thoại/);assert.ok(!html.includes('batt123'));assert.ok(!html.includes('type="email"'));assert.ok(!html.includes('value="owner"'));assert.equal(a.findUser('0901 234 567').username,'owner');assert.equal(a.findUser('owner@batt.local'),undefined);assert.equal(a.parseLocalizedNumber('1.000.000'),1000000);assert.equal(a.parseLocalizedNumber('1.234,5'),1234.5);
});

test('New QC work is visible without invented assignee; other assigned work stays private',()=>{
  const a=harness();a.role('production');const p=a.lookup('production','SX-261030-A');a.state.selected='production:'+p.id;a.submitShiftReport({materialUsed:100,output:90,bags:1,photo});const q=a.state.data.qcLots.find(x=>x.plan===p.id);assert.equal(q.inspector,'');a.role('qc');a.state.selected='quality:'+q.id;assert.equal(a.canAccessRecord('quality',q.id),true);assert.ok(a.TABLES.quality.get().includes(q));a.saveBag(q.id,1,{ash:0,impurities:0,sampleGrams:10,samplePhoto:photo,afterPhoto:photo,warehouse:'Kho A'});a.runAction('submit-qc',true);assert.equal(q.inspector,'U-006');assert.equal(q.status,'Chờ duyệt');
  const other=a.lookup('quality','QC-261029-B');other.inspector='U-OTHER';assert.equal(a.canAccessRecord('quality',other.id),false);assert.ok(!a.TABLES.quality.get().includes(other));assert.throws(()=>a.saveBag(other.id,1,{ash:0}));
});

test('Successive financial payments retain record/history and reject overpay atomically',()=>{
  const a=harness();a.role('manager');a.state.selected='finance:TC-261029-02';const r=a.lookup(...a.state.selected.split(':')),partner=a.state.data.suppliers.find(x=>x.id===r.party);const originalId=r.id,beforePaid=r.paid,beforeDebt=partner.debt,beforeHistory=r.history?.length||0;const snapshot=JSON.stringify(a.state.data);assert.throws(()=>a.recordFinancePayment({paymentAmount:1000000000,date:'2026-10-30'}));assert.equal(JSON.stringify(a.state.data),snapshot);
  a.recordFinancePayment({paymentAmount:5000000,date:'2026-10-30',note:'Lần một'});assert.equal(r.id,originalId);assert.equal(r.paid,beforePaid+5000000);assert.equal(partner.debt,beforeDebt-5000000);assert.equal(r.status,'Chưa trả');a.recordFinancePayment({paymentAmount:r.amount-r.paid,date:'2026-10-30',note:'Lần hai'});assert.equal(r.status,'Đã trả');assert.equal(r.paymentHistory.length,2);assert.equal(r.history.length,beforeHistory+2);
});

test('Money table sorts actual numeric values in both directions',()=>{
  const a=harness();a.role('owner');a.state.data.finance=[{id:'MONEY-2',amount:2000,paid:0},{id:'MONEY-10',amount:10000,paid:0},{id:'MONEY-1',amount:1000,paid:0}];a.state.sortKey='amount';a.state.sortDir=1;let html=a.renderTable('finance',a.TABLES.finance);assert.ok(html.indexOf('MONEY-1<')<html.indexOf('MONEY-2<'));assert.ok(html.indexOf('MONEY-2<')<html.indexOf('MONEY-10<'));a.state.sortDir=-1;html=a.renderTable('finance',a.TABLES.finance);assert.ok(html.indexOf('MONEY-10<')<html.indexOf('MONEY-2<'));assert.ok(html.indexOf('MONEY-2<')<html.indexOf('MONEY-1<'));
});

test('Storage quota failure rolls mutations back to last persisted data',()=>{
  const a=harness();a.role('owner');assert.equal(a.saveData(),true);const before=JSON.stringify(a.state.data);a.state.data.suppliers[0].name='Unsaved mutation';a.state.data.inventory[0].quantity+=100;a.storage.fail=true;assert.equal(a.saveData(),false);assert.equal(JSON.stringify(a.state.data),before);assert.ok(a.messages.some(x=>x.error&&x.message.includes('Không lưu')));
});

(async()=>{let failed=0;for(const {name,run} of tests){try{await run();console.log('PASS '+name);}catch(error){failed++;console.error('FAIL '+name+'\n  '+error.stack);}}console.log(`\n${tests.length-failed}/${tests.length} workflow checks passed`);process.exitCode=failed?1:0;})();
