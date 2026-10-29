/* BATT PPMS frontend prototype. Authentication, roles, OTP and persistence are simulated. */
(() => {
  'use strict';

  const ROLE = {
    owner: 'Chủ doanh nghiệp', manager: 'Quản lý xưởng', production: 'Công nhân sản xuất',
    purchasing: 'Nhân viên thu mua', warehouse: 'Thủ kho', qc: 'Nhân viên QC',
    maintenance: 'Nhân viên bảo trì', admin: 'Quản trị viên'
  };
  const USERS = [
    {id:'U-001',name:'Nguyễn Minh An',username:'owner',email:'owner@batt.local',role:'owner',active:true,phone:'0901 234 567'},
    {id:'U-002',name:'Trần Quốc Huy',username:'manager',email:'manager@batt.local',role:'manager',active:true,phone:'0902 345 678'},
    {id:'U-003',name:'Lê Thanh Tùng',username:'production',email:'production@batt.local',role:'production',active:true,phone:'0903 456 789'},
    {id:'U-004',name:'Phạm Thị Mai',username:'purchasing',email:'purchasing@batt.local',role:'purchasing',active:true,phone:'0904 567 890'},
    {id:'U-005',name:'Võ Văn Bình',username:'warehouse',email:'warehouse@batt.local',role:'warehouse',active:true,phone:'0905 678 901'},
    {id:'U-006',name:'Đặng Mỹ Linh',username:'qc',email:'qc@batt.local',role:'qc',active:true,phone:'0906 789 012'},
    {id:'U-007',name:'Hoàng Đức Phúc',username:'maintenance',email:'maintenance@batt.local',role:'maintenance',active:true,phone:'0907 890 123'},
    {id:'U-008',name:'Bùi Gia Khánh',username:'admin',email:'admin@batt.local',role:'admin',active:true,phone:'0908 901 234'}
  ];

  const seed = {
    users: USERS,
    suppliers: [
      {id:'NCC-014',name:'Nông sản Tân Phú',contact:'Nguyễn Văn Lâm',phone:'0912 345 678',address:'Đức Trọng, Lâm Đồng',debt:18600000,paid:30000000,transactions:'3 phiếu mua',status:'Đang hợp tác'},
      {id:'NCC-021',name:'Nguồn liệu Tây Nguyên',contact:'Trần Thị Hòa',phone:'0933 210 456',address:'Ea H’leo, Đắk Lắk',debt:0,paid:52400000,transactions:'5 phiếu mua',status:'Đang hợp tác'},
      {id:'NCC-008',name:'Hợp tác xã Minh Sơn',contact:'Lê Quốc Việt',phone:'0908 611 209',address:'Bảo Lộc, Lâm Đồng',debt:7200000,paid:17800000,transactions:'2 phiếu mua',status:'Đang hợp tác'}
    ],
    customers: [
      {id:'KH-031',name:'Nhiên liệu xanh An Phát',contact:'Phạm Hoàng Long',phone:'0982 441 830',address:'Di Linh, Lâm Đồng',debt:14700000,received:38200000,transactions:'4 phiếu xuất',status:'Đang hợp tác'},
      {id:'KH-026',name:'Công ty Năng lượng Đại Lộc',contact:'Lê Ngọc Châu',phone:'0918 440 221',address:'Bình Chánh, TP. Hồ Chí Minh',debt:0,received:61800000,transactions:'6 phiếu xuất',status:'Đang hợp tác'},
      {id:'KH-019',name:'Kho nhiên liệu Hoàng Gia',contact:'Vũ Minh Tâm',phone:'0971 662 904',address:'Long Khánh, Đồng Nai',debt:9300000,received:22600000,transactions:'3 phiếu xuất',status:'Đang hợp tác'}
    ],
    procurement: [
      {id:'TMM-26042',material:'Nguyên vật liệu thô',quantity:18000,cap:1450,assigned:['U-004'],creator:'U-001',status:'Đang thu mua',children:['PM-26018'],history:['Owner duyệt giá trần · Nguyễn Minh An']},
      {id:'TMM-26041',material:'Nguyên vật liệu thô',quantity:24000,cap:1320,assigned:['U-004'],creator:'U-002',status:'Chờ Owner duyệt giá trần',children:[],history:['Quản lý gửi phiếu chờ Owner duyệt']},
      {id:'TMM-26038',material:'Nguyên vật liệu thô',quantity:12000,cap:1380,assigned:['U-004'],creator:'U-001',status:'Đã nhập kho',children:['PM-26012'],history:['Owner duyệt giá trần','Kho xác nhận nhập · 10.10.2026']}
    ],
    purchases: [
      {id:'PM-26018',parent:'TMM-26042',supplier:'NCC-014',weight:9600,price:1390,date:'30.10.2026',buyer:'U-004',status:'Chờ duyệt cân',photo:'Ảnh xe cân tại xưởng',invoice:'HĐ-TP-1048',history:['Phiếu cân gửi Owner/Manager duyệt']},
      {id:'PM-26012',parent:'TMM-26038',supplier:'NCC-008',weight:12000,price:1370,date:'10.10.2026',buyer:'U-004',status:'Đã nhập kho',photo:'Ảnh xe cân tại xưởng',invoice:'Không có',history:['Quản lý duyệt cân','Kho xác nhận nhập']}
    ],
    plans: [
      {id:'SX-261030-A',shift:'Ca sáng · 06:00–14:00',machine:'Máy ép viên 02',workers:['U-003'],material:'Nguyên vật liệu thô',target:7200,date:'30.10.2026',status:'Đang thực hiện',lot:'LOT-261030-A',history:['Quản lý phân công ca, máy và công nhân']},
      {id:'SX-261029-B',shift:'Ca chiều · 14:00–22:00',machine:'Máy ép viên 01',workers:['U-003'],material:'Nguyên vật liệu thô',target:6800,date:'29.10.2026',status:'Chờ QC',lot:'LOT-261029-B',report:{materialUsed:6900,output:6540,bags:8,photo:'Ảnh cuối ca · 4 tệp'},history:['Công nhân gửi báo cáo cuối ca']},
      {id:'SX-261028-A',shift:'Ca sáng · 06:00–14:00',machine:'Máy ép viên 02',workers:['U-003'],material:'Nguyên vật liệu thô',target:24000,date:'28.10.2026',status:'Đã nhập kho',lot:'LOT-261028-A',report:{materialUsed:25000,output:23600,bags:80,photo:'Ảnh cuối ca · 3 tệp'},history:['QC hoàn tất và được duyệt','Kho xác nhận nhập thành phẩm']}
    ],
    qcLots: [
      {id:'QC-261029-B',plan:'SX-261029-B',lot:'LOT-261029-B',bags:Array.from({length:8},(_,i)=>({no:i+1,warehouse:'',ash:'',impurities:'',sampleGrams:'',samplePhoto:'',afterPhoto:''})),status:'Chờ kiểm tra',inspector:'U-006',history:['Đợt sản xuất được chuyển sang QC']},
      {id:'QC-261028-A',plan:'SX-261028-A',lot:'LOT-261028-A',bags:Array.from({length:80},(_,i)=>({no:i+1,warehouse:i%2?'Kho A':'Kho B',ash:'',impurities:'',sampleGrams:'',samplePhoto:'',afterPhoto:''})),status:'Đã nhập kho',inspector:'U-006',history:['QC gửi báo cáo','Manager duyệt QC','Kho xác nhận nhập']}
    ],
    incidents: [
      {id:'SC-261030-03',machine:'Máy ép viên 03',severity:'Nặng',reporter:'U-003',date:'30.10.2026 · 08:42',description:'Rung bất thường ở cụm truyền động, phát hiện tiếng va đập theo nhịp.',status:'Đang sửa chữa',assignee:'U-007',materialsNeeded:true,materials:'Vòng bi 6205 × 2',materialStatus:'Đã duyệt mua',repairStatus:'Chưa gửi báo cáo sửa chữa',history:['Công nhân báo sự cố mức Nặng · máy đã dừng','Quản lý phân công Hoàng Đức Phúc','Owner duyệt yêu cầu mua vật tư']},
      {id:'SC-261029-01',machine:'Máy sấy 01',severity:'Trung bình',reporter:'U-003',date:'29.10.2026 · 16:10',description:'Cảm biến nhiệt phản hồi chậm, máy vẫn duy trì nhiệt độ cài đặt.',status:'Đang hoạt động',assignee:'U-007',materialsNeeded:false,repairStatus:'Chưa cần sửa',history:['Công nhân báo sự cố mức Trung bình']},
      {id:'SC-261028-02',machine:'Máy ép viên 01',severity:'Khẩn cấp',reporter:'U-003',date:'28.10.2026 · 10:26',description:'Áp suất dầu giảm nhanh, máy dừng để kiểm tra.',status:'Chờ duyệt sau sửa chữa',assignee:'U-007',materialsNeeded:false,materials:'Dầu thủy lực 18 lít',repairStatus:'Chờ Owner/Manager duyệt báo cáo',repairApprovalStatus:'Chờ duyệt',postRepairState:'Đang hoạt động',repairPhoto:'Ảnh sau sửa chữa · 2 tệp',history:['Công nhân báo mức Khẩn cấp · máy đã dừng','Bảo trì báo cáo sửa chữa hoàn tất']}
    ],
    shipments: [
      {id:'XK-26033',warehouse:'Kho B',lot:'LOT-261028-A',quantity:12,unit:'bao',bagIds:['LOT-261028-A-015','LOT-261028-A-017','LOT-261028-A-019','LOT-261028-A-021','LOT-261028-A-023','LOT-261028-A-025','LOT-261028-A-027','LOT-261028-A-029','LOT-261028-A-031','LOT-261028-A-033','LOT-261028-A-035','LOT-261028-A-037'],creator:'U-005',customer:'',price:0,ownerApproved:false,manager:'U-002',contactStatus:'',receiver:'',plate:'',status:'Chờ Owner xem xét',photo:'',history:['Kho lập phiếu đề xuất xuất · chờ Owner/Manager xem xét']},
      {id:'XK-26031',warehouse:'Kho A',lot:'LOT-261028-A',quantity:8,unit:'bao',bagIds:['LOT-261028-A-020','LOT-261028-A-022','LOT-261028-A-024','LOT-261028-A-026','LOT-261028-A-028','LOT-261028-A-030','LOT-261028-A-032','LOT-261028-A-034'],creator:'U-005',customer:'KH-031',price:3250,ownerApproved:true,manager:'U-002',contactStatus:'Khách đồng ý mua',receiver:'Nguyễn Văn Lâm',plate:'49C-218.46',status:'Chờ xác nhận xuất',photo:'',history:['Kho lập phiếu đề xuất xuất','Owner duyệt khách hàng và giá bán','Quản lý ghi người và xe dự kiến']},
      {id:'XK-26028',warehouse:'Kho B',lot:'LOT-261028-A',quantity:7,unit:'bao',bagIds:['LOT-261028-A-001','LOT-261028-A-003','LOT-261028-A-005','LOT-261028-A-007','LOT-261028-A-009','LOT-261028-A-011','LOT-261028-A-013'],creator:'U-005',customer:'KH-026',price:3180,ownerApproved:true,manager:'U-002',contactStatus:'Khách đồng ý mua',receiver:'Lê Văn Trọng',plate:'51D-902.13',status:'Chờ nhận hàng',photo:'',history:['Owner duyệt khách hàng và giá bán']},
      {id:'XK-26025',warehouse:'Kho A',lot:'LOT-261028-A',quantity:9,actualQuantity:9,unit:'bao',bagIds:['LOT-261028-A-002','LOT-261028-A-004','LOT-261028-A-006','LOT-261028-A-008','LOT-261028-A-010','LOT-261028-A-012','LOT-261028-A-014','LOT-261028-A-016','LOT-261028-A-018'],actualBagIds:['LOT-261028-A-002','LOT-261028-A-004','LOT-261028-A-006','LOT-261028-A-008','LOT-261028-A-010','LOT-261028-A-012','LOT-261028-A-014','LOT-261028-A-016','LOT-261028-A-018'],creator:'U-005',customer:'KH-019',price:3200,ownerApproved:true,manager:'U-002',contactStatus:'Khách đồng ý mua',receiver:'Vũ Văn Minh',plate:'60H-441.22',status:'Đã xuất kho',photo:'Ảnh bàn giao · 3 tệp',history:['Kho đối chiếu đúng người và biển số','Kho xác nhận xuất thực tế · tồn kho đã cập nhật']}
    ],
    inventory: [
      {id:'NVL-01',name:'Nguyên vật liệu thô',category:'Nguyên vật liệu thô',warehouse:'Kho nguyên vật liệu thô',quantity:39200,unit:'kg',updated:'30.10.2026'},
      {id:'TP-A-01',name:'Viên nén thành phẩm · LOT-261028-A',category:'Viên nén thành phẩm',warehouse:'Kho A',quantity:15400,unit:'kg',updated:'30.10.2026',lot:'LOT-261028-A'},
      {id:'TP-B-01',name:'Viên nén thành phẩm · LOT-261028-A',category:'Viên nén thành phẩm',warehouse:'Kho B',quantity:8200,unit:'kg',updated:'30.10.2026',lot:'LOT-261028-A'},
      {id:'TP-A-02',name:'Viên nén thành phẩm · LOT-261025-A',category:'Viên nén thành phẩm',warehouse:'Kho A',quantity:11600,unit:'kg',updated:'29.10.2026',lot:'LOT-261025-A'}
    ],
    finance: [
      {id:'TC-261030-05',type:'Chi phí sửa chữa',party:'',reference:'SC-261030-03',amount:2800000,paid:0,status:'Chưa trả',date:'30.10.2026',note:'Vòng bi 6205 × 2 · giá mua sau duyệt'},
      {id:'TC-261029-02',type:'Thanh toán nhà cung cấp',party:'NCC-014',reference:'PM-26018',amount:30000000,paid:11400000,status:'Chưa trả',date:'29.10.2026',note:'Chuyển khoản đợt 1'},
      {id:'TC-261028-01',type:'Thu tiền khách hàng',party:'KH-031',reference:'XK-26025',amount:24000000,paid:24000000,status:'Đã thu',date:'28.10.2026',note:'Thu theo phiếu xuất'}
    ]
  };

  const NAV = {
    owner: [ ['TỔNG QUAN',[['overview','Tổng quan','grid']]], ['VẬN HÀNH',[['procurement','Thu mua NVL thô','inbox'],['production','Sản xuất & QC','layers'],['incidents','Sự cố & bảo trì','wrench'],['shipments','Đề xuất xuất hàng','truck'],['raw-inventory','Kho nguyên vật liệu thô','boxes'],['finished-inventory','Kho viên nén thành phẩm','layers']]], ['DỮ LIỆU',[['suppliers','Nhà cung cấp','building'],['customers','Khách hàng','users'],['finance','Công nợ & tài chính','coins'],['reports','Báo cáo vận hành','chart']]] ],
    manager: [ ['TỔNG QUAN',[['overview','Tổng quan','grid']]], ['VẬN HÀNH',[['procurement','Thu mua NVL thô','inbox'],['production','Sản xuất & QC','layers'],['incidents','Sự cố & bảo trì','wrench'],['shipments','Đề xuất xuất hàng','truck'],['raw-inventory','Kho nguyên vật liệu thô','boxes'],['finished-inventory','Kho viên nén thành phẩm','layers']]], ['DỮ LIỆU',[['suppliers','Nhà cung cấp','building'],['customers','Khách hàng','users'],['finance','Công nợ & tài chính','coins'],['reports','Báo cáo vận hành','chart']]] ],
    purchasing: [['CÔNG VIỆC CỦA TÔI',[['procurement','Thu mua được giao','inbox'],['suppliers','Nhà cung cấp','building']]]],
    production: [['CÔNG VIỆC CỦA TÔI',[['production','Kế hoạch & báo cáo ca','layers'],['incidents','Báo sự cố máy','wrench']]]],
    warehouse: [['KHO & GIAO NHẬN',[['raw-inventory','Kho nguyên vật liệu thô','boxes'],['finished-inventory','Kho viên nén thành phẩm','layers'],['shipments','Phiếu xuất hàng','truck']]]],
    qc: [['KIỂM TRA CHẤT LƯỢNG',[['quality','Các đợt chờ kiểm tra','check']]]],
    maintenance: [['BẢO TRÌ',[['incidents','Sự cố được phân công','wrench']]]],
    admin: [['QUẢN TRỊ TÀI KHOẢN',[['accounts','Tài khoản & quyền','users']]]]
  };
  const TITLES = {overview:'Tổng quan vận hành',procurement:'Thu mua nguyên vật liệu thô',production:'Sản xuất & QC',quality:'Kiểm tra chất lượng',incidents:'Sự cố & bảo trì',shipments:'Đề xuất xuất hàng',inventory:'Kho', 'raw-inventory':'Kho nguyên vật liệu thô','finished-inventory':'Kho viên nén thành phẩm',suppliers:'Nhà cung cấp',customers:'Khách hàng',finance:'Công nợ & tài chính',reports:'Báo cáo vận hành',accounts:'Tài khoản & quyền',profile:'Hồ sơ cá nhân'};
  const DESCRIPTIONS = {overview:'Theo dõi công việc trong ca hôm nay.',procurement:'Phiếu thu mua và xác nhận nhập kho.',production:'Kế hoạch ca và báo cáo sản xuất.',quality:'Kiểm tra từng bao và phân vào Kho A hoặc Kho B.',incidents:'Sự cố máy và công việc bảo trì.',shipments:'Đề xuất xuất hàng và giao nhận.',inventory:'Tồn kho theo khu vực.',suppliers:'Thông tin liên hệ và lịch sử giao dịch.',customers:'Thông tin liên hệ và lịch sử giao dịch.',finance:'Thu tiền, thanh toán, công nợ và chi phí.',reports:'Báo cáo vận hành.',accounts:'Tài khoản nội bộ.'};
  const STATUS_KIND = {'Chờ Owner duyệt giá trần':'amber','Chờ duyệt cân':'amber','Chờ kho xác nhận nhập':'blue','Đang thu mua':'blue','Đã nhập kho':'green','Chờ QC':'amber','Chờ duyệt QC':'amber','Đang thực hiện':'blue','Chờ kiểm tra':'amber','Chờ duyệt':'amber','Chờ duyệt sau sửa chữa':'red','Chờ duyệt báo cáo sửa chữa':'amber','Đã duyệt báo cáo sửa chữa':'green','Đã dừng máy':'red','Đang sửa chữa':'blue','Đang hoạt động':'green','Khẩn cấp':'red','Nặng':'red','Trung bình':'amber','Nhẹ':'green','Chờ xem xét':'amber','Chờ Manager liên hệ':'blue','Chờ ghi người và xe nhận hàng':'blue','Chờ xác nhận xuất':'amber','Chờ nhận hàng':'blue','Đã đối chiếu khớp':'green','Trả Manager cập nhật':'red','Đã xuất kho':'green','Đã ghi nhận mua':'green','Đã thu':'green','Chưa thu':'amber','Đã trả':'green','Chưa trả':'amber','Đang hợp tác':'green','Ngừng hợp tác':'neutral','Hoạt động':'green','Đã khóa':'red'};
  const ICONS = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    inbox:'<path d="M4 4h16v16H4z"/><path d="M4 13h4l2 3h4l2-3h4"/>',
    layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    wrench:'<path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 13l-3-3 3.7-3.7Z"/>',
    truck:'<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7.5" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
    boxes:'<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    building:'<path d="M4 21V5l8-2v18M12 9h8v12M7 7h2m-2 4h2m-2 4h2m-2 4h2m8-5h2m-2 4h2"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c.4-3.3 2.5-5 6-5s5.6 1.7 6 5M16 5.5a3 3 0 0 1 0 5.8M17 15c2.4.5 3.7 2.1 4 5"/>',
    coins:'<circle cx="8" cy="8" r="5"/><path d="M8 5v6M6 6.5h3a1.5 1.5 0 0 1 0 3H6m7-5a5 5 0 1 1-1 9.9M16 14l-1 6M19 15l-1 6"/>',
    chart:'<path d="M4 19V5M4 19h17M7 15l4-5 3 2 5-7"/>',
    check:'<path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="9"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    bell:'<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    plus:'<path d="M12 5v14M5 12h14"/>' ,
    filter:'<path d="M4 6h16M7 12h10m-7 6h4"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6m-6 4h6"/>',
    eye:'<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
    eyeoff:'<path d="m3 3 18 18M10.6 6.2A11.2 11.2 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.1 3.6M6.2 6.8C3.5 8.4 2 12 2 12s3.6 6 10 6c1.1 0 2.1-.2 3-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money = (v) => new Intl.NumberFormat('vi-VN',{maximumFractionDigits:20}).format(Number(v || 0)) + ' VNĐ';
  const number = (v) => new Intl.NumberFormat('vi-VN',{maximumFractionDigits:20}).format(Number(v || 0));
  const parseLocalizedNumber = (value) => {const text=String(value??'').trim().replace(/\s/g,'').replace(/\./g,'').replace(',', '.');return text===''?NaN:Number(text);};
  function formatNumberEntry(input){const raw=input.value.replace(/\./g,'');if(!/^\d*(,\d*)?$/.test(raw))return;const logical=input.value.slice(0,input.selectionStart).replace(/\./g,'').length;const [whole,decimal]=raw.split(',');input.value=whole.replace(/\B(?=(\d{3})+(?!\d))/g,'.')+(decimal!==undefined?','+decimal:'');let count=0,position=0;while(position<input.value.length&&count<logical){if(input.value[position]!=='.')count++;position++;}input.setSelectionRange(position,position);}
  const currentDate=new Date();
  const today=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(currentDate).replace(/\//g,'.');
  const todayIso=today.split('.').reverse().join('-');
  const STORAGE = 'batt-ppms-prototype-v1';
  const state = {data:loadData(),role:null,userId:null,page:'overview',selected:null,query:'',filter:'',filters:{},sortKey:'',sortDir:1,pageNo:1,pageSize:10,openMobile:false,modal:null,previousFocus:null};
  let persistedData=structuredClone(state.data);
  function loadData(){
    try { const saved=JSON.parse(localStorage.getItem(STORAGE)); if(saved&&saved.data) return migrateData(saved.data); } catch {}
    return migrateData(structuredClone(seed));
  }
  function migrateData(data){
    data.users||=[];data.users.forEach(u=>{u.username=u.username||String(u.email||'').split('@')[0]||u.id;});
    data.suppliers||=[];data.suppliers.forEach(x=>{if(x.status==='Đang giao dịch')x.status='Đang hợp tác';});
    data.customers||=[];data.customers.forEach(x=>{if(x.status==='Đang giao dịch')x.status='Đang hợp tác';});
    data.inventory||=[];data.inventory.forEach(x=>{if(x.category==='Nguyên vật liệu')x.category='Nguyên vật liệu thô';if(x.category==='Thành phẩm')x.category='Viên nén thành phẩm';if(x.category==='Nguyên vật liệu thô'){x.name='Nguyên vật liệu thô';x.warehouse='Kho nguyên vật liệu thô';}});
    const rawRows=data.inventory.filter(x=>x.category==='Nguyên vật liệu thô');if(rawRows.length>1){const primary=rawRows[0];primary.quantity=rawRows.reduce((sum,x)=>sum+Number(x.quantity||0),0);primary.updated=rawRows.map(x=>x.updated).sort().at(-1)||today;data.inventory=data.inventory.filter(x=>x.category!=='Nguyên vật liệu thô'||x===primary);}
    data.procurement||=[];data.procurement.forEach(p=>{p.material='Nguyên vật liệu thô';p.history||=[];});
    data.plans||=[];data.plans.forEach(p=>{p.material='Nguyên vật liệu thô';p.history||=[];});
    data.qcLots||=[];data.qcLots.forEach(l=>{l.history||=[];(l.bags||[]).forEach(b=>{delete b.result;b.ash??='';b.impurities??='';b.sampleGrams??='';b.samplePhoto??='';b.afterPhoto??=b.photo||'';b.warehouse||='';});});
    data.purchases||=[];data.purchases.forEach(x=>{x.history||=[];});
    data.incidents||=[];data.incidents.forEach(x=>{x.history||=[];});
    data.shipments||=[];data.shipments.forEach(x=>{x.unit||='kg';x.history||=[];});
    if(!Array.isArray(data.bagStocks)){const shipped=new Set(data.shipments.flatMap(x=>x.status==='Đã xuất kho'?(x.bagIds||[]):[]));data.bagStocks=data.qcLots.filter(l=>l.status==='Đã nhập kho').flatMap(l=>(l.bags||[]).filter(b=>b.warehouse&&!shipped.has(`${l.lot}-${String(b.no).padStart(3,'0')}`)).map(b=>({id:`${l.lot}-${String(b.no).padStart(3,'0')}`,lot:l.lot,warehouse:b.warehouse,status:'Trong kho',qcId:l.id})));}
    data.finance||=[];data.finance.forEach(f=>{f.status=f.type==='Thu tiền khách hàng'?(Number(f.paid)>=Number(f.amount)?'Đã thu':'Chưa thu'):(Number(f.paid)>=Number(f.amount)?'Đã trả':'Chưa trả');});return data;
  }
  function normalizedLogin(value){return String(value||'').replace(/[\s()-]/g,'').toLocaleLowerCase('vi');}
  function findUser(identifier){const key=normalizedLogin(identifier);return state.data.users.find(u=>normalizedLogin(u.username)===key||normalizedLogin(u.phone)===key);}
  function maskPhone(value){const digits=String(value||'').replace(/\D/g,'');return digits.length>4?`${digits.slice(0,2)}••• •${digits.slice(-2)}`:'số điện thoại đã đăng ký';}
  function localStamp(){return new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'short',timeStyle:'short'}).format(new Date());}
  function appendHistory(record,action){if(!record)return;record.history||=[];record.history.push(`${localStamp()} · ${currentUser().name} · ${action}`);}
  function saveData(){ try { localStorage.setItem(STORAGE, JSON.stringify({data:state.data}));persistedData=structuredClone(state.data);return true; } catch { state.data=structuredClone(persistedData);notify('Không lưu được dữ liệu. Bộ nhớ trình duyệt có thể đã đầy; hãy giảm dung lượng ảnh rồi thử lại.',true);return false; } }
  function currentUser(){return state.data.users.find(u=>u.id===state.userId)||state.data.users[0];}
  function getRole(){return state.role;}
  function businessLead(){return ['owner','manager'].includes(getRole());}
  function machineOperatingState(record){return ['Nặng','Khẩn cấp'].includes(record.severity)?(record.status==='Đang hoạt động'?'Đang hoạt động':'Đã dừng máy'):(record.repairApprovalStatus==='Đã duyệt'&&record.postRepairState==='Đã dừng máy'?'Đã dừng máy':'Đang hoạt động');}
  function canSeeCustomers(){return ['owner','manager'].includes(getRole());}
  function canSeeSupplier(){return ['owner','manager','purchasing'].includes(getRole());}
  function allowedPages(){return (NAV[getRole()]||[]).flatMap(g=>g[1].map(i=>i[0]));}
  function visiblePage(page){return page==='profile'||allowedPages().includes(page);}
  function visibleRoute(page,selected){return visiblePage(page)||!!(selected&&canAccessRecord(...selected.split(':'))&&({procurement:'procurement',production:'production',quality:'quality',customers:'customers'})[selected.split(':')[0]]===page);}
  function canAccessRecord(module,id){
    const role=getRole(),r=lookup(module,id);
    if(module==='procurement'){
      if(role==='purchasing')return !!r&&((state.data.procurement.includes(r)&&r.assigned.includes(state.userId)&&r.status!=='Chờ Owner duyệt giá trần')||(state.data.purchases.includes(r)&&r.buyer===state.userId));
      if(role==='warehouse')return !!r&&state.data.purchases.includes(r)&&['Chờ kho xác nhận nhập','Đã nhập kho'].includes(r.status);
      return ['owner','manager'].includes(role)&&!!r;
    }
    if(module==='production'){
      if(role==='production')return !!r&&r.workers?.includes(state.userId);
      if(role==='warehouse')return !!r&&['Chờ kho xác nhận nhập','Đã nhập kho'].includes(r.status);
      return ['owner','manager'].includes(role)&&!!r;
    }
    if(module==='incidents'){
      if(role==='production')return !!r&&r.reporter===state.userId;
      if(role==='maintenance')return !!r&&r.assignee===state.userId;
    }
    if(module==='quality'){
      if(role==='qc')return !!r&&(!r.inspector||r.inspector===state.userId);
      if(['owner','manager'].includes(role))return !!r;
      if(role==='warehouse')return !!r&&['Chờ kho xác nhận nhập','Đã nhập kho'].includes(r.status);
    }
    if(module==='customers'&&role==='warehouse')return !!r&&state.data.shipments.some(x=>x.customer===id&&x.status!=='Đã xuất kho'&&x.creator===state.userId);
    if(module==='shipments'&&role==='warehouse')return !!r&&r.creator===state.userId;
    if(module==='suppliers'&&role==='purchasing')return !!r;
    if(module==='finance')return ['owner','manager'].includes(role)&&!!r;
    if(module==='accounts')return role==='admin'&&!!r;
    if(module==='inventory')return ['owner','manager','warehouse'].includes(role)&&!!r;
    if(['owner','manager'].includes(role)&&['suppliers','customers'].includes(module))return !!r;
    return allowedPages().includes(module)&&!!r;
  }
  function setRole(role,userId){state.role=role;state.userId=userId;state.page=(NAV[role]||[]).flatMap(g=>g[1])[0]?.[0]||'accounts';state.selected=null;state.query='';state.filter='';state.filters={};state.pageNo=1;state.openMobile=false;pushRoute();render();}
  function pushRoute(replace=false){const route=state.role?`#/${state.page}${state.selected?`/record/${state.selected.replace(':','/')}`:''}`:'#/login';history[replace?'replaceState':'pushState']({role:state.role,userId:state.userId},'',route);}
  function restoreRoute(){if(!state.role){state.selected=null;render();return;}const parts=decodeURIComponent(location.hash.replace(/^#\/?/, '')).split('/'),page=parts[0],selected=parts[1]==='record'&&parts[2]&&parts[3]?`${parts[2]}:${parts[3]}`:null;if(!visibleRoute(page,selected)){state.page=allowedPages()[0]||'accounts';state.selected=null;}else{if(state.page!==page){state.query='';state.filters={};state.sortKey='';state.pageNo=1;}state.page=page;state.selected=selected&&canAccessRecord(...selected.split(':'))?selected:null;}closeModal();render();}
  function navLabel(page){for(const groups of Object.values(NAV)) for(const group of groups) for(const item of group[1]) if(item[0]===page)return item[1];return TITLES[page]||page;}
  function notify(message,error=false){const region=document.getElementById('toast-region');if(!region)return;const el=document.createElement('div');el.className='toast'+(error?' toast-error':'');el.innerHTML=`<span class="toast-mark"></span><div>${esc(message)}</div>`;region.replaceChildren(el);setTimeout(()=>el.remove(),4200);}
  const pill=(value)=>`<span class="status status-${STATUS_KIND[value]||'neutral'}">${esc(value||'Chưa xác định')}</span>`;
  const button=(label,action,kind='button',extra='')=>`<button type="button" class="button ${kind}" data-action="${esc(action)}" ${extra}>${label}</button>`;

  function render(){
    const root=document.getElementById('app');
    if(state.role){const user=state.data.users.find(u=>u.id===state.userId);if(!user?.active){state.role=null;state.userId=null;state.selected=null;}else state.role=user.role;}
    if(!state.role){root.innerHTML=renderLogin();bind();return;}
    if(!visibleRoute(state.page,state.selected)){state.page=allowedPages()[0]||'accounts';state.selected=null;}
     root.innerHTML=`<div class="app-shell">${renderSidebar()}<button class="drawer-scrim ${state.openMobile?'is-visible':''}" aria-label="Đóng điều hướng" data-action="close-menu"></button><div class="main-column"><header class="topbar"><button class="icon-button mobile-menu-button" aria-label="Mở điều hướng" data-action="toggle-menu">${icon('menu')}</button><div class="topbar-title">BATT PPMS <span aria-hidden="true">/</span> ${esc(navLabel(state.page))}</div><div class="top-actions"><button class="button button-small hide-mobile" data-action="profile">${icon('users')} Hồ sơ</button></div></header><main class="main-content" id="main-content" tabindex="-1">${state.selected?renderDetail():renderPage()}</main></div></div>`;
    bind();
  }
  function renderSidebar(){
    const user=currentUser();
    const groups= NAV[getRole()]||[];
    const nav=groups.map(([label,items])=>`<section class="nav-section"><div class="nav-label">${esc(label)}</div><div class="nav-list">${items.map(([key,text,ic])=>`<button class="nav-link" data-page="${key}" aria-current="${state.page===key?'page':'false'}">${icon(ic)}<span>${esc(text)}</span>${navCount(key)?`<span class="nav-count">${navCount(key)}</span>`:''}</button>`).join('')}</div></section>`).join('');
    return `<aside class="sidebar ${state.openMobile?'is-open':''}"><div class="brand"><div class="brand-mark">BATT</div><div><div class="brand-name">BATT PPMS</div><div class="brand-sub">Vận hành nhà máy viên nén</div></div></div>${nav}<div class="sidebar-bottom"><div class="user-card"><div class="avatar">${esc(initials(user.name))}</div><div class="user-meta"><div class="user-name">${esc(user.name)}</div><div class="user-role">${esc(ROLE[getRole()])}</div></div><button class="icon-button" title="Tài khoản" aria-label="Tài khoản" data-action="user-menu">${icon('arrow')}</button></div></div></aside>`;
  }
  function navCount(key){
    if(key==='procurement')return state.data.procurement.filter(x=>x.assigned.includes(state.userId)||businessLead()).length||'';
    if(key==='quality')return state.data.qcLots.filter(x=>x.status==='Chờ kiểm tra').length||'';
    if(key==='incidents')return state.data.incidents.filter(x=>getRole()==='maintenance'?x.assignee===state.userId:['production'].includes(getRole())?x.reporter===state.userId:true).length||'';
    if(key==='shipments')return state.data.shipments.filter(x=>x.status!=='Đã xuất kho').length||'';
    return '';
  }
  function initials(name){return name.split(/\s+/).slice(-2).map(x=>x[0]).join('').toUpperCase();}

  function renderLogin(){
    return `<main class="login-page"><section class="login-panel" aria-labelledby="login-title"><header class="brand"><div class="brand-mark">BATT</div><div><div class="brand-name">BATT PPMS</div><div class="brand-sub">Quản lý sản xuất viên nén</div></div></header><div class="login-box"><h1 id="login-title">Đăng nhập</h1><form id="login-form"><div class="form-field"><label for="login-identifier">Tên đăng nhập hoặc số điện thoại</label><input id="login-identifier" name="identifier" type="text" autocomplete="username" required></div><div class="form-field"><label for="login-password">Mật khẩu</label><div class="password-control"><input id="login-password" name="password" type="password" autocomplete="current-password" required><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Hiện mật khẩu" aria-pressed="false">${icon('eye')}</button></div></div><div class="login-error" id="login-error" role="alert"></div><button class="button button-primary" type="submit">Đăng nhập ${icon('arrow')}</button></form><button class="link-button forgot-link" data-action="forgot">Quên mật khẩu?</button></div></section></main>`;
  }
  function initialsOf(u){return initials(u.name);}

  function renderPage(){
    if(state.page==='profile')return renderProfile();
    if(state.page==='overview')return renderOverview();
    if(state.page==='reports')return renderReports();
    const cfg=TABLES[state.page];
    if(!cfg)return renderOverview();
    return renderInbound(state.page)+(state.page==='finished-inventory'?renderRecordedFinishedStock():'')+renderTable(state.page,cfg);
  }
  function renderInbound(page){
    if(getRole()!=='warehouse'||!['raw-inventory','finished-inventory'].includes(page))return '';
    const raw=page==='raw-inventory',module=raw?'procurement':'quality',rows=(raw?state.data.purchases:state.data.qcLots).filter(r=>['Chờ kho xác nhận nhập','Đã nhập kho'].includes(r.status)).slice().sort((a,b)=>(a.status==='Đã nhập kho')-(b.status==='Đã nhập kho'));
    if(!rows.length)return '';
    return `<section class="panel inbound-panel"><div class="panel-heading"><h2>Phiếu nhập kho</h2></div><div class="panel-body queue-list">${rows.map(r=>`<div class="queue-item"><div class="queue-main">${code(r.id)}<div class="queue-meta">${raw?number(r.receivedWeight??r.weight)+' kg':number(r.bags.length)+' bao'}</div></div><div class="queue-end">${pill(r.status)}<button type="button" class="button" data-detail="${module}:${esc(r.id)}">${r.status==='Chờ kho xác nhận nhập'?'Xem và xác nhận nhập':'Xem lịch sử nhập'}</button></div></div>`).join('')}</div></section>`;
  }
  function renderRecordedFinishedStock(){
    if(!['owner','manager','warehouse'].includes(getRole()))return '';
    const rows=state.data.inventory.filter(r=>r.category==='Viên nén thành phẩm'&&Number(r.quantity)>0&&!state.data.qcLots.some(q=>q.lot===r.lot)&&!state.data.bagStocks.some(b=>b.lot===r.lot));
    return rows.length?`<section class="panel inbound-panel"><div class="panel-heading"><h2>Tồn theo khối lượng đã ghi nhận</h2></div><div class="table-wrap"><table><thead><tr><th>Mã lô</th><th>Kho</th><th>Khối lượng</th><th>Cập nhật</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${code(r.lot)}</td><td>${esc(r.warehouse)}</td><td>${number(r.quantity)} ${esc(r.unit)}</td><td>${esc(r.updated)}</td></tr>`).join('')}</tbody></table></div></section>`:'';
  }
  function heading(title,desc,actions=''){return `<div class="page-heading"><div><h1>${esc(title)}</h1>${desc?`<p>${esc(desc)}</p>`:''}</div>${actions?`<div class="heading-actions">${actions}</div>`:''}</div>`;}
  function detailActionLabel(key){return ({procurement:'Xem chi tiết phiếu',production:'Xem kế hoạch',quality:'Xem báo cáo QC',incidents:'Xem báo cáo sự cố',shipments:'Xem thông tin giao nhận','raw-inventory':'Xem tồn kho NVL','finished-inventory':'Xem bao trong kho',suppliers:'Xem lịch sử giao dịch',customers:'Xem lịch sử giao dịch',finance:'Xem giao dịch',accounts:'Xem tài khoản'})[key]||'Xem chi tiết';}
  function renderOverview(){
    const role=getRole();
    if(role==='admin')return renderTable('accounts',TABLES.accounts);
    const lead=businessLead();
    const metrics=lead?[
      ['Đang chờ duyệt',number(state.data.procurement.filter(x=>x.status.includes('Chờ')).length+state.data.purchases.filter(x=>x.status.includes('Chờ')).length+state.data.qcLots.filter(x=>x.status.includes('Chờ')).length),'inbox','Các bước cần Owner hoặc Manager'],
      ['Bao thành phẩm tồn',number(state.data.bagStocks.filter(x=>x.status==='Trong kho').length)+' bao','boxes','Theo Kho A và Kho B'],
      ['Còn phải thu',money(state.data.customers.reduce((a,x)=>a+x.debt,0)),'coins','Theo hồ sơ khách hàng'],
      ['Còn phải trả',money(state.data.suppliers.reduce((a,x)=>a+x.debt,0)),'coins','Theo hồ sơ nhà cung cấp']
    ]:role==='purchasing'?[['Phiếu tổng được giao',number(state.data.procurement.filter(x=>x.assigned.includes(state.userId)).length),'inbox','Chỉ phiếu đã phân công'],['Đợt mua đã tạo',number(state.data.purchases.filter(x=>x.buyer===state.userId).length),'truck','Phiếu cân thuộc các đợt được giao']]:role==='production'?[['Ca được phân công',number(state.data.plans.filter(x=>x.workers.includes(state.userId)).length),'layers','Kế hoạch sản xuất của bạn'],['Báo cáo ca chờ QC',number(state.data.plans.filter(x=>x.status==='Chờ QC').length),'check','Đã gửi cuối ca']]:role==='warehouse'?[['Phiếu cần xử lý',number(state.data.shipments.filter(x=>x.status!=='Đã xuất kho').length),'truck','Đề xuất, đối chiếu và xuất hàng'],['Bao thành phẩm tồn',number(state.data.bagStocks.filter(x=>x.status==='Trong kho').length)+' bao','boxes','Theo Kho A và Kho B']]:role==='qc'?[['Đợt chờ kiểm tra',number(state.data.qcLots.filter(x=>x.status==='Chờ kiểm tra').length),'check','Kiểm tra từng bao'],['Bao trong đợt mới',number(state.data.qcLots.find(x=>x.status==='Chờ kiểm tra')?.bags.length||0),'layers','Ghi số liệu, ảnh và kho']]:[['Việc được giao',number(state.data.incidents.filter(x=>x.assignee===state.userId).length),'wrench','Sự cố máy được phân công']];
    const tasks=roleTasks();
    const recent=recentActivity();
    const todayLabel=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
    return `${heading(lead?'Tổng quan vận hành':'Chào '+currentUser().name,lead?`Tình hình bàn giao tại xưởng · ${todayLabel}`:`Công việc được giao theo vai trò ${ROLE[role]}.`)}
      <div class="metric-grid">${metrics.map(([label,val,ic,note])=>`<article class="metric"><div class="metric-top"><span>${esc(label)}</span><span class="metric-icon">${icon(ic)}</span></div><div class="metric-value">${esc(val)}</div><div class="metric-note">${esc(note)}</div></article>`).join('')}</div>
      <div class="overview-grid"><section class="panel"><div class="panel-heading"><div><h2>${lead?'Bàn giao cần chú ý':'Công việc của bạn'}</h2><p>${tasks.length} mục trong phạm vi vai trò hiện tại</p></div><button class="link-button" data-page="${lead?'procurement':(allowedPages()[1]||allowedPages()[0])}">Mở danh sách →</button></div><div class="panel-body queue-list">${tasks.length?tasks.slice(0,6).map(t=>`<div class="queue-item"><div class="queue-main"><div class="queue-title">${esc(t.title)}</div><div class="queue-meta"><span class="lot-code">${esc(t.code)}</span><span>${esc(t.sub)}</span></div></div><div class="queue-end">${pill(t.status)}<button class="link-button" data-detail="${esc(t.module)}:${esc(t.id)}">Xem chi tiết</button></div></div>`).join(''):`<div class="empty-state"><div>${icon('check')}<strong>Không có công việc cần xử lý</strong><span>Các phiếu được giao đang ở trạng thái cập nhật.</span></div></div>`}</div></section>
      <section class="panel"><div class="panel-heading"><div><h2>Hoạt động gần đây</h2><p>Theo dữ liệu trong phạm vi của bạn</p></div></div><div class="panel-body activity-list">${recent.map(x=>`<div class="activity"><span class="activity-mark">${icon(x.icon)}</span><div><div class="activity-text">${esc(x.text)}</div><div class="activity-time">${esc(x.time)}</div></div></div>`).join('')}</div></section></div>`;
  }
  function roleTasks(){
    const r=getRole(),out=[];
    if(['owner','manager'].includes(r)){
      state.data.procurement.filter(x=>x.status.includes('Chờ')).forEach(x=>out.push({module:'procurement',id:x.id,code:x.id,title:`${x.material} · ${number(x.quantity)} kg`,sub:'Phiếu thu mua tổng',status:x.status}));
      state.data.purchases.filter(x=>x.status==='Chờ duyệt cân').forEach(x=>out.push({module:'procurement',id:x.id,code:x.parent,title:'Phiếu cân cần duyệt',sub:`${number(x.weight)} kg · ${number(x.price)} VNĐ/kg`,status:x.status}));
      state.data.qcLots.filter(x=>x.status==='Chờ duyệt').forEach(x=>out.push({module:'quality',id:x.id,code:x.lot,title:'Báo cáo QC cần duyệt',sub:`${x.bags.length} bao · ${x.id}`,status:x.status}));
      state.data.incidents.filter(x=>x.status==='Chờ duyệt sau sửa chữa').forEach(x=>out.push({module:'incidents',id:x.id,code:x.id,title:`${x.machine} · ${x.severity}`,sub:'Báo cáo sửa chữa chờ duyệt',status:x.status}));
      state.data.shipments.filter(x=>!x.ownerApproved).forEach(x=>out.push({module:'shipments',id:x.id,code:x.lot,title:`${number(x.quantity)} kg · phiếu xuất`,sub:'Cần Owner duyệt khách hàng và giá',status:'Chờ Owner xem xét'}));
    } else if(r==='purchasing'){
      state.data.procurement.filter(x=>x.assigned.includes(state.userId)&&!x.status.includes('Chờ Owner')).forEach(x=>out.push({module:'procurement',id:x.id,code:x.id,title:x.material,sub:`Còn ${number(Math.max(0,x.quantity-(x.children||[]).reduce((a,id)=>a+(state.data.purchases.find(p=>p.id===id)?.weight||0),0)))} kg trong phiếu tổng`,status:x.status}));
    } else if(r==='production'){
      state.data.plans.filter(x=>x.workers.includes(state.userId)).forEach(x=>out.push({module:'production',id:x.id,code:x.lot,title:x.machine,sub:x.shift,status:x.status}));
      state.data.incidents.filter(x=>x.reporter===state.userId).forEach(x=>out.push({module:'incidents',id:x.id,code:x.id,title:x.machine,sub:`Mức độ ${x.severity}`,status:x.status}));
    } else if(r==='qc'){
      state.data.qcLots.filter(x=>x.status==='Chờ kiểm tra').forEach(x=>out.push({module:'quality',id:x.id,code:x.lot,title:'Kiểm tra danh sách bao',sub:`${x.bags.length} bao · ${x.id}`,status:x.status}));
    } else if(r==='maintenance'){
      state.data.incidents.filter(x=>x.assignee===state.userId).forEach(x=>out.push({module:'incidents',id:x.id,code:x.id,title:x.machine,sub:`Mức ${x.severity} · ${x.description}`,status:x.status}));
    } else if(r==='warehouse'){
      state.data.purchases.filter(x=>x.status==='Chờ kho xác nhận nhập').forEach(x=>out.push({module:'procurement',id:x.id,code:x.parent,title:'Xác nhận nhập nguyên liệu',sub:`${number(x.weight)} kg`,status:x.status}));
      state.data.plans.filter(x=>x.status==='Chờ kho xác nhận nhập').forEach(x=>out.push({module:'production',id:x.id,code:x.lot,title:'Xác nhận nhập thành phẩm',sub:`${number(x.report?.output||0)} kg`,status:x.status}));
      state.data.shipments.filter(x=>x.status!=='Đã xuất kho').forEach(x=>out.push({module:'shipments',id:x.id,code:x.lot,title:`Phiếu xuất ${x.id}`,sub:`${number(x.quantity)} kg · ${x.warehouse}`,status:x.status}));
    }
    return out;
  }
  function recentActivity(){
    const role=getRole();
    const all=[];
    state.data.procurement.forEach(x=>all.push({text:`${x.id} · ${x.status}`,time:'Phiếu thu mua tổng',icon:'inbox'}));
    state.data.plans.forEach(x=>all.push({text:`${x.lot} · ${x.status}`,time:`${x.machine} · ${x.shift.split('·')[0]}`,icon:'layers'}));
    state.data.incidents.forEach(x=>all.push({text:`${x.machine} · ${x.severity}`,time:x.status,icon:'wrench'}));
    state.data.shipments.forEach(x=>all.push({text:`${x.id} · ${x.status}`,time:x.lot,icon:'truck'}));
    if(role==='owner'||role==='manager')return all.slice(0,6);
    const ids=new Set(roleTasks().map(x=>x.id)); return all.filter(x=>[...ids].some(id=>x.text.includes(id))).slice(0,5);
  }

  const TABLES={
    procurement:{get:()=>getRole()==='purchasing'?state.data.procurement.filter(x=>x.assigned.includes(state.userId)&&x.status!=='Chờ Owner duyệt giá trần'):state.data.procurement,search:['id','status','assigneeNames'],filters:['status','assigneeNames','date'],columns:[['id','Mã phiếu'],['quantity','Khối lượng cần'],['cap','Giá trần'],['assigneeNames','Nhân viên được giao'],['childTotal','Đã cân'],['status','Trạng thái']]},
    production:{get:()=>getRole()==='production'?state.data.plans.filter(x=>x.workers.includes(state.userId)):state.data.plans,search:['id','lot','machine','shift','workerNames'],filters:['status','machine','workerNames','date'],columns:[['lot','Mã lô'],['shift','Ca'],['machine','Máy'],['workerNames','Công nhân'],['target','Sản lượng kế hoạch'],['status','Trạng thái']]},
    quality:{get:()=>getRole()==='qc'?state.data.qcLots.filter(x=>!x.inspector||x.inspector===state.userId):state.data.qcLots,search:['id','lot','status'],filters:['status','inspectorName'],columns:[['lot','Mã lô'],['plan','Kế hoạch'],['bagCount','Số bao'],['inspectorName','QC phụ trách'],['status','Trạng thái']]},
    incidents:{get:()=>['maintenance','production'].includes(getRole())?state.data.incidents.filter(x=>getRole()==='maintenance'?x.assignee===state.userId:x.reporter===state.userId):state.data.incidents,search:['id','machine','severity','description','assigneeName'],filters:['status','severity','assigneeName'],columns:[['id','Mã sự cố'],['machine','Máy'],['severity','Mức độ'],['operatingState','Vận hành máy'],['repairStatus','Sửa chữa'],['assigneeName','Bảo trì phụ trách'],['date','Thời điểm']]},
    shipments:{get:()=>state.data.shipments.filter(x=>['owner','manager','warehouse'].includes(getRole())&&(getRole()!=='warehouse'||x.creator===state.userId)),search:['id','lot','status','plate','receiver','customerName'],filters:['status','warehouse','customerName'],columns:[['id','Mã phiếu'],['lot','Mã lô'],['customerName','Khách hàng'],['quantity','Số lượng'],['warehouse','Kho'],['status','Trạng thái']]},
    'raw-inventory':{get:()=>state.data.inventory.filter(x=>x.category==='Nguyên vật liệu thô'),search:['id','name','warehouse'],filters:['warehouse'],columns:[['id','Mã tồn'],['name','Nguyên vật liệu thô'],['quantity','Tồn hiện tại'],['unit','Đơn vị'],['updated','Cập nhật']]},
    'finished-inventory':{get:()=>finishedStockRows(),search:['id','name','warehouse','lot','bagCodes'],filters:['warehouse','lot'],columns:[['lot','Mã lô'],['warehouse','Kho'],['bagCount','Số bao còn tồn'],['updated','Cập nhật']]},
    suppliers:{get:()=>getRole()==='purchasing'?state.data.suppliers:['owner','manager'].includes(getRole())?state.data.suppliers:[],search:['id','name','contact','phone'],filters:['status'],columns:[['id','Mã NCC'],['name','Nhà cung cấp'],['contact','Người liên hệ'],['phone','Điện thoại'],['debt','Còn phải trả'],['status','Trạng thái']]},
    customers:{get:()=>['owner','manager'].includes(getRole())?state.data.customers:state.data.shipments.filter(x=>getRole()==='warehouse'&&x.creator===state.userId&&x.status!=='Đã xuất kho').map(x=>state.data.customers.find(c=>c.id===x.customer)).filter(Boolean).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i),search:['id','name','contact','phone'],filters:['status'],columns:[['id','Mã KH'],['name','Khách hàng'],['contact','Người liên hệ'],['phone','Điện thoại'],['debt','Còn phải thu'],['status','Trạng thái']]},
    finance:{get:()=>['owner','manager'].includes(getRole())?state.data.finance:[],search:['id','type','reference','note'],filters:['type','status','date'],columns:[['id','Mã giao dịch'],['type','Loại'],['partyName','Đối tượng'],['reference','Mã nghiệp vụ'],['amount','Giá trị'],['paid','Đã thu / trả'],['status','Trạng thái']]},
    accounts:{get:()=>getRole()==='admin'?state.data.users:[],search:['id','name','username','phone'],filters:['roleLabel','accountStatus'],columns:[['name','Người dùng'],['username','Tên đăng nhập'],['roleLabel','Vai trò'],['phone','Điện thoại'],['accountStatus','Tình trạng']]}
  };
  function enrich(key,row){
    const v={...row};
    if(key==='procurement'){
      v.assigneeNames=(row.assigned||[]).map(id=>state.data.users.find(u=>u.id===id)?.name||id).join(', ');
      v.childTotal=(row.children||[]).reduce((a,id)=>a+(state.data.purchases.find(p=>p.id===id)?.weight||0),0);
    }
    if(key==='production'){v.workerNames=(row.workers||[]).map(id=>state.data.users.find(u=>u.id===id)?.name||id).join(', ');}
    if(key==='quality'){v.bagCount=row.bags?.length||0;v.inspectorName=state.data.users.find(u=>u.id===row.inspector)?.name||'—';}
    if(key==='incidents'){v.assigneeName=state.data.users.find(u=>u.id===row.assignee)?.name||'Chưa phân công';v.operatingState=machineOperatingState(row);}
    if(key==='shipments')v.customerName=state.data.customers.find(c=>c.id===(row.pendingCustomer??row.customer))?.name||row.customerProposal?.name||'Chưa đề xuất';
    if(key==='finished-inventory')v.bagCount=row.bagCodes?.length||row.quantity||0;
    if(key==='finance'){v.partyName=state.data.suppliers.find(x=>x.id===row.party)?.name||state.data.customers.find(x=>x.id===row.party)?.name||row.party;}
    if(key==='accounts'){v.roleLabel=ROLE[row.role];v.accountStatus=row.active?'Hoạt động':'Đã khóa';}
    return v;
  }
  function renderTable(key,cfg){
    const all=cfg.get();
    let rows=all.map(x=>enrich(key,x));
    const q=state.query.trim().toLocaleLowerCase('vi');
    if(q)rows=rows.filter(r=>(cfg.search||[]).some(k=>String(r[k]||'').toLocaleLowerCase('vi').includes(q)));
    for(const [field,val] of Object.entries(state.filters||{})){if(val)rows=rows.filter(r=>String(r[field]||'')===val);}
    if(state.sortKey)rows.sort((a,b)=>{const field=state.sortKey,aa=a[field]??'',bb=b[field]??'';const comparable=v=>field==='date'||field==='updated'?String(v).replace(/^(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'):v;return (typeof aa==='number'&&typeof bb==='number'?aa-bb:String(comparable(aa)).localeCompare(String(comparable(bb)),'vi',{numeric:true,sensitivity:'base'}))*state.sortDir;});
    const total=rows.length,pages=Math.max(1,Math.ceil(total/state.pageSize));if(state.pageNo>pages)state.pageNo=pages;
    const start=(state.pageNo-1)*state.pageSize;rows=rows.slice(start,start+state.pageSize);
    const filters=filterOptions(cfg.get(),cfg.filters||[],key);
    const actions=createActionFor(key);
    const cols=cfg.columns.filter(([field])=>!(key==='suppliers'&&getRole()==='purchasing'&&field==='debt'));
    const actionsHtml=actions?button(`${icon('plus')}${esc(actions.label)}`,'create:'+key,'button button-primary'):'';
    const filterNames={status:'Trạng thái',assigneeNames:'Nhân viên thu mua',workerNames:'Công nhân',inspectorName:'Nhân viên QC',assigneeName:'Nhân viên bảo trì',machine:'Máy',date:'Ngày',updated:'Cập nhật',severity:'Mức độ',warehouse:'Kho',customerName:'Khách hàng',lot:'Mã lô',type:'Loại giao dịch',roleLabel:'Vai trò',accountStatus:'Tài khoản'};
    const filterSelect=`<div class="filter-fields">${(cfg.filters||[]).map(field=>{const options=filters.filter(x=>x[2]===field);return options.length?`<label>${esc(filterNames[field]||field)}<select class="toolbar-select" aria-label="Lọc ${esc(filterNames[field]||field)}" data-filter-field="${esc(field)}"><option value="">Tất cả</option>${options.map(([v,label])=>`<option value="${esc(v)}" ${state.filters?.[field]===String(v)?'selected':''}>${esc(label)}</option>`).join('')}</select></label>`:'';}).join('')}</div>`;
    const hasFilters=Object.values(state.filters||{}).some(Boolean);
    const empty=all.length===0?'Chưa có dữ liệu phù hợp với vai trò này.':'Không tìm thấy bản ghi phù hợp với điều kiện tìm kiếm.';
    return `${heading(TITLES[key],DESCRIPTIONS[key]||'',actionsHtml)}
      <section class="panel"><div class="table-toolbar"><label class="field-inline">${icon('search')}<input id="list-search" placeholder="Tìm kiếm trong danh sách…" aria-label="Tìm kiếm ${esc(TITLES[key])}" value="${esc(state.query)}"></label>${filterSelect}<span class="toolbar-spacer"></span>${hasFilters||state.query?button('Xóa bộ lọc','clear-filters','button button-small'):''}</div>
      ${total?`<div class="table-wrap"><table><thead><tr>${cols.map(([field,label])=>`<th aria-sort="${state.sortKey===field?(state.sortDir===1?"ascending":"descending"):"none"}"><button data-sort="${field}" aria-label="Sắp xếp theo ${esc(label)}">${esc(label)}${state.sortKey===field?(state.sortDir===1?' ↑':' ↓'):''}</button></th>`).join('')}<th>Chi tiết</th></tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(([field])=>`<td>${cellValue(key,field,r)}</td>`).join('')}<td class="row-action"><button class="link-button" data-detail="${key}:${esc(r.id)}">${detailActionLabel(key)}</button></td></tr>`).join('')}</tbody></table></div><div class="pagination"><span class="pagination-info">Hiển thị ${total?start+1:0}–${Math.min(start+state.pageSize,total)} trong ${total} kết quả</span><label for="page-size">Số dòng</label><select id="page-size" class="toolbar-select"><option ${state.pageSize===10?'selected':''}>10</option><option ${state.pageSize===20?'selected':''}>20</option><option ${state.pageSize===50?'selected':''}>50</option></select><button class="button" data-action="prev-page" ${state.pageNo<=1?'disabled':''} aria-label="Trang trước">←</button><span>Trang ${state.pageNo} / ${pages}</span><button class="button" data-action="next-page" ${state.pageNo>=pages?'disabled':''} aria-label="Trang sau">→</button></div>`:`<div class="empty-state"><div>${icon('search')}<strong>${all.length?'Không có kết quả':'Chưa có bản ghi'}</strong><span>${esc(empty)}</span>${state.query||hasFilters?`<div style="margin-top:12px">${button('Xóa bộ lọc','clear-filters','button button-small')}</div>`:''}</div></div>`}</section>`;
  }
  function cellValue(key,field,r){
    if(field==='id'||field==='lot')return `<span class="lot-code">${esc(r[field])}</span>`;
    if(field==='status'||field==='accountStatus'||field==='operatingState')return pill(r[field]);
    if(field==='severity')return pill(r[field]);
    if(field==='price'||field==='cap')return `<span class="number">${money(r[field])}</span>`;
    if(field==='quantity'&&key==='procurement')return `<span class="number">${number(r[field])} kg</span>`;
    if(field==='quantity'&&key==='shipments')return `<span class="number">${number(r[field])} ${esc(r.unit||'kg')}</span>`;
    if(field==='target'||field==='childTotal')return `<span class="number">${number(r[field])} kg</span>`;
    if(field==='debt'||field==='paid'||field==='amount')return `<span class="number">${money(r[field])}</span>`;
    if(field==='quantity'&&key==='raw-inventory')return `<span class="number">${number(r[field])} ${esc(r.unit)}</span>`;
    if(field==='bagCount')return `${esc(r[field])} bao`;
    if(field==='name'&&['suppliers','customers'].includes(key))return `<div class="table-primary"><strong>${esc(r[field])}</strong><span class="table-secondary">${esc(r.id)}</span></div>`;
    if(field==='name'&&key==='accounts')return `<div class="table-primary"><strong>${esc(r[field])}</strong><span class="table-secondary">${esc(r.id)}</span></div>`;
    if(field==='lot')return `<span class="lot-code">${esc(r[field])}</span>`;
    return `<span>${esc(r[field]??'—')}</span>`;
  }
  function filterOptions(rows,fields,key){
    const out=[];
    for(const field of fields){const vals=[...new Set(rows.map(r=>enrich(key,r)[field]).filter(Boolean))];for(const v of vals)out.push([v,v,field]);}
    return out;
  }
  function createActionFor(key){
    const r=getRole();
    const yes={procurement:['owner','manager'].includes(r),production:['owner','manager'].includes(r),incidents:r==='production',shipments:['warehouse'].includes(r),suppliers:r==='owner',customers:r==='owner',finance:['owner','manager'].includes(r),accounts:r==='admin'};
    if(key==='quality'||key==='raw-inventory'||key==='finished-inventory'||key==='reports')return null;
    if(key==='procurement'&&r==='purchasing')return null;
    if(key==='production'&&r==='production')return null;
    if(key==='incidents'&&r==='maintenance')return null;
    if(key==='shipments'&&r!=='warehouse')return null;
    if(key==='finance'&&r==='manager')return {label:'Ghi giao dịch'};
    if(yes[key])return {label:key==='procurement'?'Tạo phiếu tổng':key==='production'?'Tạo kế hoạch':key==='incidents'?'Báo sự cố':key==='shipments'?'Tạo đề xuất xuất hàng':key==='accounts'?'Tạo tài khoản':key==='suppliers'?'Thêm nhà cung cấp':key==='customers'?'Thêm khách hàng':'Ghi giao dịch'};
    return null;
  }
  function renderReports(){
    if(!businessLead())return '<div class="notice notice-danger">'+icon('info')+'<span>Bạn không có quyền xem báo cáo vận hành.</span></div>';
    const supplies=state.data.procurement.reduce((a,x)=>a+x.quantity,0),outputs=state.data.plans.reduce((a,x)=>a+(x.report?.output||0),0),finance=state.data.finance;
    const rev=finance.filter(x=>x.type==='Thu tiền khách hàng').reduce((a,x)=>a+x.paid,0),expense=finance.filter(x=>x.type!=='Thu tiền khách hàng').reduce((a,x)=>a+x.paid,0);
    return heading('Báo cáo vận hành','Sản lượng, công nợ và các khoản thu chi đã ghi nhận.')+
      '<div class="metric-grid"><article class="metric"><div class="metric-top">Khối lượng kế hoạch mua</div><div class="metric-value">'+number(supplies)+' kg</div><div class="metric-note">Theo phiếu tổng</div></article><article class="metric"><div class="metric-top">Sản lượng ghi nhận</div><div class="metric-value">'+number(outputs)+' kg</div><div class="metric-note">Theo báo cáo ca</div></article><article class="metric"><div class="metric-top">Còn phải thu</div><div class="metric-value">'+money(state.data.customers.reduce((a,x)=>a+x.debt,0))+'</div><div class="metric-note">Theo hồ sơ khách hàng</div></article><article class="metric"><div class="metric-top">Còn phải trả</div><div class="metric-value">'+money(state.data.suppliers.reduce((a,x)=>a+x.debt,0))+'</div><div class="metric-note">Theo hồ sơ nhà cung cấp</div></article></div>';
  }
  function renderProfile(){
    const u=currentUser();
    return heading('Hồ sơ cá nhân','Thông tin tài khoản đăng nhập hiện tại.',button('Đổi mật khẩu','change-password','button'))+
      '<section class="detail-card"><h2>Thông tin liên hệ</h2><dl class="detail-fields"><div class="detail-field"><dt>Họ và tên</dt><dd>'+esc(u.name)+'</dd></div><div class="detail-field"><dt>Tên đăng nhập</dt><dd>'+esc(u.username)+'</dd></div><div class="detail-field"><dt>Vai trò</dt><dd>'+esc(ROLE[u.role])+'</dd></div><div class="detail-field"><dt>Điện thoại</dt><dd>'+esc(u.phone||'Chưa cập nhật')+'</dd></div></dl><div class="form-actions">'+button('Cập nhật hồ sơ','edit:profile','button button-primary')+'</div></section>';
  }
  function lookup(module,id){
    const maps={procurement:[...state.data.procurement,...state.data.purchases],production:state.data.plans,quality:state.data.qcLots,incidents:state.data.incidents,shipments:state.data.shipments,inventory:[...state.data.inventory,...finishedStockRows()],suppliers:state.data.suppliers,customers:state.data.customers,finance:state.data.finance,accounts:state.data.users};
    return (maps[module]||[]).find(x=>x.id===id);
  }
  function finishedStockRows(){
    const groups=new Map();
    for(const bag of state.data.bagStocks||[]){if(bag.status!=='Trong kho')continue;const key=`${bag.warehouse}|${bag.lot}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(bag);}
    return [...groups.entries()].map(([key,bags])=>{const [warehouse,lot]=key.split('|'),q=state.data.qcLots.find(x=>x.lot===lot),plan=state.data.plans.find(x=>x.id===q?.plan);return {id:`KTP-${warehouse==='Kho A'?'A':'B'}-${lot}`,name:'Viên nén thành phẩm',category:'Viên nén thành phẩm',warehouse,lot,quantity:bags.length,unit:'bao',bagCodes:bags.map(x=>x.id).sort((a,b)=>a.localeCompare(b,'vi',{numeric:true})),updated:plan?.date||today};}).sort((a,b)=>a.lot.localeCompare(b.lot,'vi',{numeric:true})||a.warehouse.localeCompare(b.warehouse,'vi',{numeric:true}));
  }
  function renderDetail(){
    const [module,id]=state.selected.split(':');
    if(!canAccessRecord(module,id)){state.selected=null;return renderPage();}
    const record=lookup(module,id);if(!record){state.selected=null;return renderPage();}
    const isChild=module==='procurement'&&!state.data.procurement.some(x=>x.id===id);
    const title=detailTitle(module,record,isChild),actions=detailActions(module,record,isChild),fields=detailFields(module,record,isChild),history=record.history||[],related=relatedRecords(module,record);
    if(record.creator&&!fields.some(([label])=>label==='Người tạo'))fields.push(['Người tạo',esc(state.data.users.find(u=>u.id===record.creator)?.name||record.creator)]);
    if(record.createdAt)fields.push(['Thời điểm tạo',esc(record.createdAt)]);
    if(record.purchasedMaterials)fields.push(['Vật tư thực tế đã mua',esc(record.purchasedMaterials)]);
    if(module==='incidents'&&record.postRepairState)fields.push(['Tình trạng máy sau sửa chữa',pill(record.postRepairState)]);
    if(module==='shipments'&&record.returnReason)fields.push(['Lý do trả thông tin giao nhận',esc(record.returnReason)]);
    if(module==='shipments'&&record.actualReceiver)fields.push(['Người thực tế đến nhận',esc(record.actualReceiver)],['Biển số xe thực tế',code(record.actualPlate)]);
    if(module==='production'&&record.report){const lot=state.data.qcLots.find(q=>q.plan===record.id);if(lot)fields.push(['Mã từng bao',lot.bags.map(b=>code(b.code||`${lot.lot}-${String(b.no).padStart(3,'0')}`)).join(' ')]);}
    if(['suppliers','customers'].includes(module))for(const key of ['photo','document','attachment'])if(record[key])fields.push(['Tệp đính kèm',renderAttachment(record[key])]);
    const fieldHtml=fields.map(([label,value])=>'<div class="detail-field"><dt>'+esc(label)+'</dt><dd>'+value+'</dd></div>').join('');
    const bagHtml=module==='quality'?renderBagChecks(record):'';
    const accountHtml='';
    const recordStatus=module==='accounts'?(record.active?'Hoạt động':'Đã khóa'):record.status;
    const relatedTitle=(module==='suppliers'||module==='customers')?'Lịch sử giao dịch':module==='procurement'?'Phiếu mua hàng con':module==='production'?'Báo cáo QC':'';
    const relatedHtml=related?'<section class="detail-card"><h2>'+esc(relatedTitle||'Thông tin liên quan')+'</h2>'+related+'</section>':'';
    const historyHtml=history.length?'<section class="detail-card"><h2>Lịch sử thao tác</h2><div class="timeline">'+history.slice().reverse().map(h=>'<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-text">'+esc(h)+'</div></div>').join('')+'</div></section>':'';
    const archiveHtml=(record.attachmentHistory||[]).length?`<section class="detail-card"><h2>Lịch sử ảnh và tài liệu</h2>${record.attachmentHistory.slice().reverse().map(entry=>`<div class="archive-entry"><p>${esc(entry.at)} · ${esc(entry.actor)}</p><div class="archive-files">${entry.files.map(file=>renderAttachment(file)).join('')}</div></div>`).join('')}</section>`:'';
    const paymentsHtml=(record.paymentHistory||[]).length?`<section class="detail-card"><h2>Lịch sử thu / trả</h2>${record.paymentHistory.slice().reverse().map(entry=>`<div class="queue-item"><div>${esc(entry.date)} · ${esc(entry.actor)}<p>${esc(entry.note)}</p></div><strong>${money(entry.amount)}</strong></div>`).join('')}</section>`:'';
    const actionHtml=actions.map(a=>button(a.label,a.action,a.kind||('button'+(a.danger?' button-danger':'')),a.disabled?'disabled':'')).join('');
    return heading(title,'')+
      '<div class="detail-layout '+(actions.length?'':'detail-layout-single')+'"><div class="detail-main"><section class="detail-card"><div class="detail-title"><h2>'+esc(title)+'</h2>'+(recordStatus?pill(recordStatus):'')+'</div>'+
      (record.description?'<p class="detail-summary">'+esc(record.description)+'</p>':'')+'<dl class="detail-fields">'+fieldHtml+'</dl></section>'+bagHtml+accountHtml+relatedHtml+paymentsHtml+historyHtml+archiveHtml+
      '</div>'+(actions.length?'<aside class="detail-aside"><section class="action-panel"><h2>Thao tác</h2><div class="action-stack">'+actionHtml+'</div></section></aside>':'')+'</div>';
  }
  function detailTitle(module,r,isChild){
    if(isChild)return 'Phiếu mua '+r.id;
    if(module==='procurement')return 'Phiếu tổng '+r.id;
    if(module==='production')return 'Kế hoạch '+r.id;
    if(module==='quality')return 'Đợt QC '+r.id;
    if(module==='incidents')return 'Sự cố '+r.id;
    if(module==='shipments')return 'Phiếu xuất '+r.id;
    if(['inventory','suppliers','customers','accounts'].includes(module))return `${r.id} · ${r.name}`;
    return (TITLES[module]||'Chi tiết')+' '+r.id;
  }
  function detailFields(module,r,isChild){
    if(isChild){const s=state.data.suppliers.find(x=>x.id===r.supplier);return [['Mã phiếu mua',code(r.id)],['Phiếu tổng',code(r.parent)],['Nhà cung cấp',esc(s?.name||'—')],['Khối lượng cân',`${number(r.weight)} kg`],['Khối lượng thực nhận',`${number(r.receivedWeight??r.weight)} kg`],['Giá mua thực tế',`${money(r.price)} / kg`],['Thời điểm cân',esc(r.date)],['Nhân viên thu mua',esc(state.data.users.find(u=>u.id===r.buyer)?.name||'—')],['Ảnh xe cân tại xưởng',renderAttachment(r.photo)],['Hóa đơn',renderAttachment(r.invoice)],['Trạng thái',pill(r.status)]];}
    if(module==='suppliers'&&getRole()==='purchasing')return [['Mã nhà cung cấp',code(r.id)],['Người liên hệ',esc(r.contact)],['Điện thoại',esc(r.phone)],['Địa chỉ',esc(r.address)]];
    if(module==='customers'&&getRole()==='warehouse')return [['Mã khách hàng',code(r.id)],['Tên khách hàng',esc(r.name)],['Người liên hệ',esc(r.contact)],['Điện thoại',esc(r.phone)]];
    switch(module){
      case 'procurement': return [['Khối lượng cần mua',`${number(r.quantity)} kg`],['Giá trần',`${money(r.cap)} / kg`],['Đã cân cộng dồn',`${number(r.children.reduce((a,id)=>a+(state.data.purchases.find(p=>p.id===id)?.weight||0),0))} kg`],['Nhân viên được phân công',esc((r.assigned||[]).map(id=>state.data.users.find(u=>u.id===id)?.name||'').join(', '))],['Người tạo',esc(state.data.users.find(u=>u.id===r.creator)?.name||'—')]];
      case 'production':return [['Ca sản xuất',esc(r.shift)],['Máy',esc(r.machine)],['Công nhân được giao',esc(r.workers.map(id=>state.data.users.find(u=>u.id===id)?.name||id).join(', '))],['Sản lượng kế hoạch',`${number(r.target)} kg`],['Ngày',esc(r.date)],['Mã lô truy xuất',code(r.lot)],...(r.report?[['Nguyên vật liệu thô đã dùng',`${number(r.report.materialUsed)} kg`],['Viên nén thành phẩm',`${number(r.report.output)} kg`],['Số bao',`${r.report.bags} bao`],['Ảnh minh chứng',renderAttachment(r.report.photo)]]:[])];
      case 'quality':return [['Mã lô',code(r.lot)],['Kế hoạch sản xuất',code(r.plan)],['Số bao trong danh sách',`${r.bags.length} bao`],['QC phụ trách',esc(state.data.users.find(u=>u.id===r.inspector)?.name||'—')]];
      case 'incidents':return [['Máy',esc(r.machine)],['Mức độ sự cố',pill(r.severity)],['Tình trạng vận hành máy',pill(machineOperatingState(r))],['Người báo cáo',esc(state.data.users.find(u=>u.id===r.reporter)?.name||'—')],['Thời điểm',esc(r.date)],['Ảnh hiện trạng',renderAttachment(r.photo)],['Bảo trì được phân công',esc(state.data.users.find(u=>u.id===r.assignee)?.name||'Chưa phân công')],['Vật tư cần mua',esc(r.materials||'—')],...(r.materialQuantity!==undefined?[['Số lượng yêu cầu',number(r.materialQuantity)]]:[]),['Trạng thái yêu cầu vật tư',esc(r.materialStatus||'Chưa tạo yêu cầu')],...(r.purchaseCost!==undefined?[['Giá mua vật tư',money(r.purchaseCost)]]:[]),['Vật tư đã dùng',esc(r.materialsUsed||'—')],['Trạng thái sửa chữa',esc(r.repairStatus||'Chưa bắt đầu')],...(r.repairPhoto?[['Ảnh sau sửa chữa',renderAttachment(r.repairPhoto)]]:[])];
      case 'shipments':{const c=state.data.customers.find(x=>x.id===(r.pendingCustomer??r.customer));return [['Kho xuất',esc(r.warehouse)],['Mã lô',esc((r.lotIds||[r.lot]).filter(Boolean).join(', ')||'—')],['Số lượng dự kiến',`${number(r.quantity)} ${esc(r.unit||'kg')}`],...(r.unit==='bao'?[['Bao dự kiến xuất',(r.bagIds||[]).map(code).join(' ')]]:[]),...(r.actualQuantity!==undefined?[['Số lượng đã xuất',`${number(r.actualQuantity)} ${esc(r.unit||'kg')}`]]:[]),...(r.actualBagIds?[['Mã bao đã xuất',r.actualBagIds.map(code).join(' ')]]:[]),['Khách hàng',esc(c?.name||r.customerProposal?.name||'Chưa chọn')],['Giá bán dự kiến',(r.pendingPrice??r.price)?`${money(r.pendingPrice??r.price)} / ${r.unit==='bao'?'bao':'kg'}`:'—'],['Khách hàng xác nhận',esc(r.contactStatus||'Chưa liên hệ')],['Người dự kiến đến nhận',esc(r.receiver||'Chưa ghi')],['Biển số xe dự kiến',code(r.plate||'Chưa ghi')],['Ảnh xuất hàng thực tế',renderAttachment(r.photo)]];}
      case 'inventory':return r.category==='Viên nén thành phẩm'?[['Sản phẩm',esc(r.name)],['Mã lô',code(r.lot)],['Vị trí kho',esc(r.warehouse)],['Số bao còn tồn',`${number(r.bagCodes?.length||r.quantity)} bao`],['Mã bao',(r.bagCodes||[]).map(code).join(' ')||'—'],['Cập nhật',esc(r.updated)]]:[['Tên mặt hàng',esc(r.name)],['Loại',esc(r.category)],['Vị trí kho',esc(r.warehouse)],['Số lượng hiện tại',`${number(r.quantity)} ${esc(r.unit)}`],['Cập nhật',esc(r.updated)],...(r.lot?[['Mã lô',code(r.lot)]]:[])];
      case 'suppliers':case 'customers':return [['Mã hồ sơ',code(r.id)],['Người liên hệ',esc(r.contact)],['Điện thoại',esc(r.phone)],['Địa chỉ',esc(r.address)],['Đã thanh toán / thu',money(module==='suppliers'?r.paid:r.received)],['Còn phải trả / thu',money(r.debt)],['Tình trạng hợp tác',pill(r.status)]];
      case 'finance':return [['Loại giao dịch',esc(r.type)],['Đối tượng',esc(state.data.suppliers.find(x=>x.id===r.party)?.name||state.data.customers.find(x=>x.id===r.party)?.name||'Chi phí vận hành')],['Mã nghiệp vụ liên quan',code(r.reference)],['Giá trị giao dịch',money(r.amount)],['Đã thu / trả',money(r.paid)],['Còn lại',money(Math.max(0,r.amount-r.paid))],['Trạng thái',pill(r.status)],['Ngày',esc(r.date)],['Nội dung khoản thu/chi',esc(r.note)] ];
      case 'accounts':return [['\u0054\u00ean \u0111\u0103ng nh\u1eadp',esc(r.username||'—')],['Vai trò',esc(ROLE[r.role])],['Điện thoại',esc(r.phone||'—')],['Tình trạng tài khoản',pill(r.active?'Hoạt động':'Đã khóa')]];
      default:return Object.entries(r).filter(([k,v])=>!['history','bags','workers','assigned','children'].includes(k)&&typeof v!=='object').slice(0,12).map(([k,v])=>[k,esc(v)]);
    }
  }
  function code(v){return `<span class="lot-code">${esc(v||'Chưa có')}</span>`;}
  function relatedRecords(module,r){
    if(module==='procurement'&&state.data.procurement.some(x=>x.id===r.id)){
      const children=state.data.purchases.filter(x=>r.children.includes(x.id)&&canAccessRecord('procurement',x.id));return `<p class="field-hint">${number(children.reduce((sum,x)=>sum+Number(x.weight||0),0))} kg đã cân qua ${children.length} lần giao dịch.</p>${children.length?`<div class="queue-list">${children.map(x=>`<div class="queue-item"><div class="queue-main"><strong>${code(x.id)}</strong><div class="queue-meta">${number(x.weight)} kg · ${money(x.price)} / kg</div></div><div class="queue-end">${pill(x.status)}<button class="link-button" data-detail="procurement:${x.id}">Xem chi tiết phiếu mua</button></div></div>`).join('')}</div>`:`<div class="muted-box">Chưa có phiếu mua con.</div>`}`;
    }
    if(module==='production'){const q=state.data.qcLots.find(x=>x.plan===r.id);return q&&canAccessRecord('quality',q.id)?`<div class="queue-item"><div class="queue-main">${code(q.id)}<div class="queue-meta">${q.bags.length} bao</div></div><div class="queue-end">${pill(q.status)}<button class="link-button" data-detail="quality:${q.id}">Xem báo cáo QC</button></div></div>`:'';}
    if((module==='suppliers'||module==='customers')&&['owner','manager'].includes(getRole())){
      const tx=state.data.finance.filter(x=>x.party===r.id), purchases=module==='suppliers'?state.data.purchases.filter(x=>x.supplier===r.id):[], sales=module==='customers'?state.data.shipments.filter(x=>x.customer===r.id):[];return `<div class="queue-list">${[...purchases.map(x=>`<div class="queue-item"><div class="queue-main"><strong>${code(x.id)}</strong><div class="queue-meta">Phiếu cân · ${esc(x.date)} · ${number(x.weight)} kg</div></div><div class="queue-end">${pill(x.status)}<button class="link-button" data-detail="procurement:${esc(x.id)}">Xem chi tiết phiếu mua</button></div></div>`),...sales.map(x=>`<div class="queue-item"><div class="queue-main"><strong>${code(x.id)}</strong><div class="queue-meta">Xuất hàng · ${number(x.quantity)} ${esc(x.unit||'kg')}</div></div><div class="queue-end">${pill(x.status)}<button class="link-button" data-detail="shipments:${esc(x.id)}">Xem lịch sử xuất hàng</button></div></div>`),...tx.map(x=>`<div class="queue-item"><div class="queue-main"><strong>${esc(x.type)}</strong><div class="queue-meta"><span>${esc(x.date)}</span><span>${code(x.reference)}</span></div></div><div class="queue-end"><span class="number">${money(x.amount)}</span>${pill(x.status)}<button class="link-button" data-detail="finance:${esc(x.id)}">Xem giao dịch</button></div></div>`)].join('')||`<div class="muted-box">Chưa có lịch sử giao dịch.</div>`}</div>`;
    }
    return '';
  }
  function renderBagChecks(lot){
    const editable=getRole()==='qc'&&lot.status==='Chờ kiểm tra';
    return `<section class="detail-card"><h2>Danh sách bao · ${lot.bags.length} bao</h2><div class="table-wrap"><table><thead><tr><th>Mã bao</th><th>Độ tro</th><th>Độ tạp chất</th><th>Mẫu (gram)</th><th>Kho</th><th>Ảnh mẫu</th><th>Ảnh sau kiểm tra</th><th></th></tr></thead><tbody>${lot.bags.map(b=>`<tr><td>${code(b.code||`${lot.lot}-${String(b.no).padStart(3,'0')}`)}</td><td>${esc(b.ash??'—')}</td><td>${esc(b.impurities??'—')}</td><td>${esc(b.sampleGrams??'—')}</td><td>${esc(b.warehouse||'Chưa phân kho')}</td><td>${renderAttachment(b.samplePhoto)}</td><td>${renderAttachment(b.afterPhoto||b.photo)}</td><td>${editable?`<button class="link-button" data-action="inspect-bag" data-id="${lot.id}" data-bag="${b.no}">Ghi kiểm tra</button>`:''}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function detailActions(module,r,isChild){
    const role=getRole(),A=[];
    if(module==='procurement'&&isChild){
      if(businessLead()&&r.status==='Chờ duyệt cân'){A.push({label:'Điều chỉnh',action:'edit:purchase-adjust'});A.push({label:'Duyệt phiếu cân',action:'act:approve-purchase'});}
      if(role==='warehouse'&&r.status==='Chờ kho xác nhận nhập'){A.push({label:'Cập nhật hàng thực nhận',action:'edit:raw-receipt'});if(Number.isFinite(Number(r.receivedWeight)))A.push({label:'Xác nhận nhập NVL',action:'act:receive-raw'});}
    } else if(module==='procurement'){
      if(role==='owner'&&r.status==='Chờ Owner duyệt giá trần'){A.push({label:'Điều chỉnh giá trần',action:'act:adjust-cap'});A.push({label:'Duyệt giá trần',action:'act:approve-cap'});}
      if(role==='purchasing'&&r.assigned.includes(state.userId)&&r.status==='Đang thu mua')A.push({label:'Tạo phiếu mua con',action:'create:purchase'});
    } else if(module==='production'){
      if(role==='production'&&r.workers.includes(state.userId)&&r.status==='Đang thực hiện')A.push({label:'Lập báo cáo cuối ca',action:'create:shift-report'});
      if(role==='warehouse'&&r.status==='Chờ kho xác nhận nhập')A.push({label:'Xác nhận nhập thành phẩm',action:'act:receive-finished'});
      if(role==='qc'&&r.status==='Chờ QC') {const lot=state.data.qcLots.find(q=>q.plan===r.id);if(lot)A.push({label:'Mở danh sách bao QC',action:`open:${'quality:'+lot.id}`});}
    } else if(module==='quality'){
      if(businessLead()&&r.status==='Chờ duyệt'){A.push({label:'Điều chỉnh',action:'edit:qc-adjust'});A.push({label:'Duyệt báo cáo QC',action:'act:approve-qc'});}
      if(role==='qc'&&r.status==='Chờ kiểm tra')A.push({label:'Gửi báo cáo QC',action:'act:submit-qc'});
      if(role==='warehouse'&&r.status==='Chờ kho xác nhận nhập')A.push({label:'Xác nhận nhập thành phẩm',action:'act:receive-finished'});
    } else if(module==='incidents'){
      if(['owner','manager'].includes(role)&&!r.assignee)A.push({label:'Tiếp nhận & phân công',action:'act:assign-maintenance'});
      if(businessLead()&&r.materialStatus==='Chờ duyệt'){A.push({label:'Điều chỉnh yêu cầu vật tư',action:'edit:material-adjust'});A.push({label:'Duyệt yêu cầu mua vật tư',action:'act:approve-material'});}
      if(role==='maintenance'&&r.assignee===state.userId&&!r.materialStatus)A.push({label:'Yêu cầu mua vật tư',action:'act:request-material'});
      if(['owner','manager'].includes(role)&&r.materialStatus==='Đã duyệt mua'&&!r.materialPurchaseRecorded)A.push({label:'Ghi nhận vật tư đã mua',action:'act:record-material'});
      if(role==='maintenance'&&r.assignee===state.userId&&r.materialStatus==='Đã ghi nhận mua'&&r.materialPurchaseRecorded&&!r.materialsReceived)A.push({label:'Xác nhận tiếp nhận vật tư',action:'act:receive-materials'});
      if(role==='maintenance'&&r.assignee===state.userId&&(!r.materialsNeeded||r.materialsReceived)&&r.repairStatus!=='Đang sửa chữa'&&!['Chờ duyệt','Đã duyệt'].includes(r.repairApprovalStatus))A.push({label:'Bắt đầu sửa chữa',action:'act:start-repair'});
      if(role==='maintenance'&&r.assignee===state.userId&&(!r.materialsNeeded||r.materialsReceived)&&r.repairStatus==='Đang sửa chữa'&&r.repairApprovalStatus!=='Chờ duyệt')A.push({label:'Gửi báo cáo sửa chữa',action:'act:repair-report'});
      if(businessLead()&&(r.repairApprovalStatus==='Chờ duyệt'||r.status==='Chờ duyệt sau sửa chữa')){A.push({label:'Điều chỉnh báo cáo sửa chữa',action:'edit:repair-adjust'});A.push({label:'Duyệt báo cáo sửa chữa',action:'act:approve-repair'});}
    } else if(module==='shipments'){
      if(role==='owner'&&!r.ownerApproved){A.push({label:'Điều chỉnh đề xuất',action:'act:adjust-sale'});if((r.pendingCustomer||r.customer)&&Number(r.pendingPrice??r.price)>0)A.push({label:'Duyệt đề xuất',action:'act:approve-sale'});}
      if(businessLead()&&!r.ownerApproved)A.push({label:'Đề xuất khách hàng',action:'act:propose-customer'});
      if(businessLead()&&r.ownerApproved&&r.contactStatus==='Chờ liên hệ')A.push({label:'Ghi nhận khách hàng phản hồi',action:'act:customer-response'});
      if(businessLead()&&r.ownerApproved&&r.contactStatus==='Khách đồng ý mua'&&!r.receiver)A.push({label:'Ghi người và xe nhận hàng',action:'act:pickup-info'});
      if(role==='warehouse'&&r.status==='Chờ xác nhận xuất')A.push({label:'Đối chiếu người & biển số',action:'act:verify-pickup'});
      if(role==='warehouse'&&r.status==='Chờ nhận hàng')A.push({label:'Kiểm tra người đến nhận',action:'act:verify-pickup'});
      if(r.status==='Trả Manager cập nhật'&&businessLead())A.push({label:'Cập nhật phiếu nhận hàng',action:'edit:shipment'});
      if(role==='warehouse'&&r.status==='Đã đối chiếu khớp')A.push({label:'Xác nhận xuất thực tế',action:'act:dispatch'});
    } else if(module==='accounts'&&role==='admin'){
      A.push({label:'Chỉnh sửa tài khoản & quyền',action:'edit:account'});
      A.push({label:r.active?'Khóa tài khoản':'Mở khóa tài khoản',action:'act:toggle-account',danger:r.active});
    } else if(module==='suppliers'||module==='customers'){
      if(role==='owner'){A.push({label:'Chỉnh sửa hồ sơ',action:`edit:${module==='suppliers'?'supplier':'customer'}`});if(r.status==='Ngừng hợp tác'||!hasOpenDirectoryWork(module,r))A.push({label:r.status==='Ngừng hợp tác'?'Kích hoạt hợp tác':'Ngừng hợp tác',action:'act:toggle-directory'});}
    } else if(module==='finance'&&businessLead()){
      if(Number(r.paid)<Number(r.amount))A.push({label:r.type==='Thu tiền khách hàng'?'Ghi nhận thu tiền':'Ghi nhận thanh toán',action:'edit:finance-payment'});
      A.push({label:'Ghi khoản thu / chi',action:'create:finance'});
    }
    return A;
  }
  function hasOpenDirectoryWork(module,row){
    if(Number(row.debt||0)>0)return true;
    const finance=state.data.finance.some(x=>x.party===row.id&&Number(x.amount)>Number(x.paid));
    if(finance)return true;
    return module==='suppliers'?state.data.purchases.some(x=>x.supplier===row.id&&x.status!=='Đã nhập kho'):state.data.shipments.some(x=>x.customer===row.id&&x.status!=='Đã xuất kho');
  }

  function bind(){
    const app=document.getElementById('app');
    app.onclick=(e)=>{
      if(e.target.closest('#modal-wrap'))return;
      const photo=e.target.closest('[data-view-image]');if(photo){showImage(photo);return;}
      const page=e.target.closest('[data-page]');if(page){navigate(page.dataset.page);return;}
      const detail=e.target.closest('[data-detail]');if(detail){openDetail(...detail.dataset.detail.split(':'));return;}
      const sort=e.target.closest('[data-sort]');if(sort){const key=sort.dataset.sort;if(state.sortKey===key)state.sortDir*=-1;else{state.sortKey=key;state.sortDir=1;}state.pageNo=1;render();return;}
      const action=e.target.closest('[data-action]');if(action){handleAction(action);return;}
    };
    app.oninput=(e)=>{if(e.target.matches("[data-number-field]"))formatNumberEntry(e.target);if(e.target.closest('#modal-form[data-type="shipment-proposal"]'))renderFifoPreview();if(e.target.id==='list-search'){state.query=e.target.value;state.pageNo=1;const active=document.activeElement?.id;render();const again=document.getElementById(active);if(again){again.focus();again.setSelectionRange(state.query.length,state.query.length);}}};
    app.onfocusin=null;
    app.onfocusout=(e)=>{if(e.target.matches('[data-number-field]')){const n=parseLocalizedNumber(e.target.value);if(Number.isFinite(n)&&e.target.value.trim()!=='')e.target.value=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:20}).format(n);}};
    app.onchange=(e)=>{if(e.target.type==='file')previewSelectedFile(e.target);if(e.target.dataset.filterField){state.filters[e.target.dataset.filterField]=e.target.value;state.pageNo=1;render();}if(e.target.id==='page-size'){state.pageSize=Number(e.target.value);state.pageNo=1;render();}if(e.target.closest('#modal-form[data-type="shipment-proposal"]'))renderFifoPreview();};
    const login=document.getElementById('login-form');if(login)login.onsubmit=(e)=>{e.preventDefault();const d=new FormData(login),u=findUser(d.get('identifier'));if(!u||!u.active||d.get('password')!==(u.password||'batt123')){document.getElementById('login-error').textContent=u&&!u.active?'Tài khoản đang bị khóa. Hãy liên hệ quản trị viên.':'Tên đăng nhập, số điện thoại hoặc mật khẩu chưa đúng.';return;}setRole(u.role,u.id);};
    const form=document.getElementById('modal-form');if(form){form.onsubmit=submitForm;form.dataset.type=state.modal?.type||'';if(form.dataset.type==='shipment-proposal'){form.querySelector('.form-grid')?.insertAdjacentHTML('afterend','<section class="fifo-preview" id="fifo-preview" aria-live="polite"></section>');renderFifoPreview();}}
    document.onkeydown=(e)=>{if(e.key==='Escape'){if(state.modal){closeModal();}else if(state.openMobile){state.openMobile=false;render();}return;}if(e.key==='Tab'&&state.modal){const box=document.querySelector('#modal-wrap .modal');const items=[...box.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
  }
  function navigate(page){if(!visiblePage(page)){notify('Vai trò hiện tại không được phép mở màn hình này.',true);return;}state.page=page;state.selected=null;state.query='';state.filter='';state.filters={};state.sortKey='';state.sortDir=1;state.pageNo=1;state.openMobile=false;pushRoute();render();}
  function openDetail(module,id){
    const recordModule=module==='raw-inventory'||module==='finished-inventory'?'inventory':module;
    if(!canAccessRecord(recordModule,id)){notify('Không có quyền xem phiếu này.',true);return;}
    const record=lookup(recordModule,id);if(!record){notify('Không tìm thấy bản ghi.',true);return;}
    if(module==='customers'&&!canSeeCustomers()&&getRole()!=='warehouse'){notify('Không có quyền xem danh sách khách hàng.',true);return;}
    if(module==='suppliers'&&!canSeeSupplier()){notify('Không có quyền xem nhà cung cấp.',true);return;}
    if(module==='finance'&&!businessLead()){notify('Không có quyền xem dữ liệu tài chính.',true);return;}
    state.selected=`${recordModule}:${id}`;state.page=recordModule==='inventory'?(record.category==='Nguyên vật liệu thô'?'raw-inventory':'finished-inventory'):module==='purchase'?'procurement':module;pushRoute();render();document.getElementById('main-content')?.focus({preventScroll:true});
  }
  function handleAction(el){
    const a=el.dataset.action||'';
    if(a==='toggle-menu'){state.openMobile=true;render();return;}
    if(a==='close-menu'){state.openMobile=false;render();return;}
    if(a==='prev-page'){state.pageNo=Math.max(1,state.pageNo-1);render();return;}
    if(a==='next-page'){state.pageNo++;render();return;}
    if(a==='clear-filters'){state.query='';state.filter='';state.filters={};state.pageNo=1;render();return;}
    if(a==='profile'){state.page='profile';state.selected=null;pushRoute();render();return;}
    if(a==='change-password'){openModal('password');return;}
    if(a==='logout'){state.role=null;state.userId=null;state.selected=null;pushRoute();render();return;}
    if(a==='user-menu'){openUserMenu();return;}
    if(a==='toggle-password'){const input=document.getElementById('login-password');if(input){const show=input.type==='password';input.type=show?'text':'password';el.setAttribute('aria-pressed',String(show));el.setAttribute('aria-label',show?'Ẩn mật khẩu':'Hiện mật khẩu');el.innerHTML=icon(show?'eyeoff':'eye');}return;}
    if(a==='forgot'){openModal('forgot');return;}
    if(a.startsWith('create:')){const type=({suppliers:'supplier',customers:'customer',accounts:'account',incidents:'incident',shipments:'shipment-proposal'})[a.slice(7)]||a.slice(7);openModal(type);return;}
    if(a.startsWith('edit:')){openModal(a.slice(5)==='shipment'?'shipment-edit':a.slice(5),{edit:true});return;}
    if(a.startsWith('open:')){const [m,id]=a.slice(5).split(':');openDetail(m,id);return;}
    if(a==='inspect-bag'){openModal('bag',{id:el.dataset.id,bag:Number(el.dataset.bag)});return;}
    if(a.startsWith('act:')){runAction(a.slice(4));return;}
  }
  function openUserMenu(){
    openCustomModal('Tài khoản',`<div class="form-actions">${button('Hồ sơ cá nhân','profile','button')+button('Đổi mật khẩu','change-password','button')}${button('Đăng xuất','logout','button button-danger')}</div>`);
  }
  function openModal(type,extra={}){
    if(!canUseForm(type,extra)){notify('Bạn không có quyền thực hiện thao tác ở trạng thái này.',true);return;}
    state.modal={type,...(type==='forgot'?{stage:'account'}:{}),...extra};
    const cfg=formConfig(type,extra);if(!cfg){state.modal=null;notify('Biểu mẫu này chưa khả dụng.',true);return;}
    const body=renderForm(cfg,extra);
    openCustomModal(cfg.title,body,true);
  }
  function openCustomModal(title,body,isForm=false){
    const hadModal=!!document.getElementById('modal-wrap');
    if(!hadModal)state.previousFocus=document.activeElement;
    document.getElementById('modal-wrap')?.remove();
    const root=document.getElementById('app');
    const wrap=document.createElement('div');wrap.className='modal-backdrop';wrap.id='modal-wrap';wrap.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-head"><h2 id="modal-title">${esc(title)}</h2><button class="icon-button modal-close" aria-label="Đóng" data-action="close-modal">${icon('close')}</button></header><div class="modal-body">${isForm?`<form id="modal-form" novalidate>${body}</form>`:body}</div></section>`;
    root.append(wrap);wrap.querySelectorAll('.form-field').forEach((field,i)=>{const label=field.querySelector('label');const input=field.querySelector('input,select,textarea');if(label&&input){if(!input.id)input.id='modal-field-'+i;label.htmlFor=input.id;}});wrap.addEventListener('click',e=>{if(e.target===wrap)closeModal();});wrap.querySelector('button, input, select, textarea')?.focus();
    wrap.onclick=(e)=>{e.stopPropagation();const photo=e.target.closest('[data-view-image]');if(photo){showImage(photo);return;}const action=e.target.closest('[data-action]');if(!action)return;const a=action.dataset.action;if(a==='close-modal'){closeModal();return;}if(a==='logout'){closeModal();state.role=null;state.userId=null;state.selected=null;pushRoute();render();return;}if(a==='profile'){closeModal();state.page='profile';state.selected=null;pushRoute();render();return;}if(a==='change-password'){openModal('password');return;}if(a==='resend-otp'){action.disabled=true;action.textContent='Đã gửi lại mã';notify('Đã gửi lại mã xác thực.');setTimeout(()=>{if(action.isConnected){action.disabled=false;action.textContent='Gửi lại mã';}},30000);return;}if(a==='confirm-yes'){closeModal();runAction(action.dataset.confirm,true);return;}if(a==='confirm-no'){closeModal();return;}};
    const form=document.getElementById('modal-form');if(form){form.onsubmit=submitForm;form.dataset.type=state.modal?.type||'';if(form.dataset.type==='shipment-proposal'){form.querySelector('.form-grid')?.insertAdjacentHTML('afterend','<section class="fifo-preview" id="fifo-preview" aria-live="polite"></section>');renderFifoPreview();}if(['forgot','password'].includes(form.dataset.type)){wrap.querySelector('.modal').classList.add('auth-modal');}form.querySelector('input:not([type="hidden"]),select,textarea')?.focus();}
    state.modal=state.modal||{};
  }
  function closeModal(){document.getElementById('modal-wrap')?.remove();state.modal=null;state.previousFocus?.focus?.();}
  function showImage(control){
    const viewer=document.createElement('dialog');viewer.className='attachment-viewer';viewer.setAttribute('aria-label',control.dataset.imageLabel||'Ảnh minh chứng');viewer.innerHTML=`<form method="dialog"><button class="button" aria-label="Đóng ảnh">Đóng ảnh</button></form><img src="${esc(control.dataset.viewImage)}" alt="${esc(control.dataset.imageLabel||'Ảnh minh chứng')}">`;document.body.append(viewer);viewer.addEventListener('keydown',e=>e.stopPropagation());viewer.addEventListener('close',()=>{viewer.remove();control.focus();});viewer.showModal();
  }

  function formConfig(type,extra){
    const workerOptions=state.data.users.filter(u=>u.role==='production'&&u.active).map(u=>[u.id,u.name]);
    const purchaserOptions=state.data.users.filter(u=>u.role==='purchasing'&&u.active).map(u=>[u.id,u.name]);
    const maintenanceOptions=state.data.users.filter(u=>u.role==='maintenance'&&u.active).map(u=>[u.id,u.name]);
    const allSupplierOptions=state.data.suppliers.map(x=>[x.id,x.name]);
    const allCustomerOptions=state.data.customers.map(x=>[x.id,x.name]);
    const supplierOptions=state.data.suppliers.filter(x=>x.status!=='Ngừng hợp tác').map(x=>[x.id,x.name]);
    const customerOptions=state.data.customers.filter(x=>x.status!=='Ngừng hợp tác').map(x=>[x.id,x.name]);
    const planOptions=state.data.plans.map(x=>[x.id,`${x.id} · ${x.machine}`]);
    const requestOptions=(label,fields)=>({title:label,fields});
    const configs={
      procurement:{title:'Tạo phiếu thu mua tổng',fields:[{name:'quantity',label:'Khối lượng cần mua',required:true,type:'number',unit:'kg',min:1},{name:'cap',label:'Giá trần',required:true,type:'number',unit:'VNĐ / kg',min:1},{name:'assigned',label:'Nhân viên thu mua được phân công',required:true,type:'checks',options:purchaserOptions,full:true}]},
      purchase:{title:'Tạo phiếu mua hàng con',values:{parent:state.selected?.startsWith('procurement:')?state.selected.split(':')[1]:''},fields:[{name:'parent',label:'Phiếu tổng được giao',required:true,type:'select',options:state.data.procurement.filter(x=>x.assigned.includes(state.userId)&&x.status==='Đang thu mua').map(x=>[x.id,x.id])},{name:'supplier',label:'Nhà cung cấp',required:true,type:'select',options:supplierOptions},{name:'weight',label:'Khối lượng cân tại xưởng',required:true,type:'number',unit:'kg',min:1},{name:'price',label:'Giá mua thực tế',required:true,type:'number',unit:'VNĐ / kg',min:1},{name:'photo',label:'Ảnh xe cân tại xưởng',required:true,type:'file'},{name:'invoice',label:'Hóa đơn (nếu có)',type:'file'}]},
      'raw-receipt':{title:'Cập nhật hàng thực nhận',values:(()=>{const r=lookup('procurement',state.selected?.split(':')[1]);return r?{receivedWeight:r.receivedWeight??r.weight}:{};})(),fields:[{name:'receivedWeight',label:'Khối lượng thực nhận',required:true,type:'number',unit:'kg',min:0}]},
      production:{title:'Tạo kế hoạch sản xuất',fields:[{name:'date',label:'Ngày sản xuất',required:true,type:'date',value:todayIso},{name:'shift',label:'Ca',required:true,type:'select',options:[['Ca sáng · 06:00–14:00','Ca sáng · 06:00–14:00'],['Ca chiều · 14:00–22:00','Ca chiều · 14:00–22:00'],['Ca đêm · 22:00–06:00','Ca đêm · 22:00–06:00']]},{name:'machine',label:'Máy',required:true,type:'text'},{name:'workers',label:'Công nhân được phân công',required:true,type:'checks',options:workerOptions,full:true},{name:'target',label:'Sản lượng kế hoạch',required:true,type:'number',unit:'kg',min:1}]},
      'shift-report':{title:'Báo cáo cuối ca',fields:[{name:'materialUsed',label:'Nguyên vật liệu thô đã dùng',required:true,type:'number',unit:'kg',min:1},{name:'output',label:'Viên nén thành phẩm',required:true,type:'number',unit:'kg',min:1},{name:'bags',label:'Số bao trong đợt',required:true,type:'number',unit:'bao',min:1},{name:'photo',label:'Ảnh minh chứng cuối ca',required:true,type:'file'}]},
      incident:{title:'Báo cáo sự cố máy',fields:[{name:'machine',label:'Máy đang vận hành',required:true,type:'text'},{name:'severity',label:'Mức độ sự cố',required:true,type:'select',options:[['Nhẹ','Nhẹ'],['Trung bình','Trung bình'],['Nặng','Nặng'],['Khẩn cấp','Khẩn cấp']]},{name:'description',label:'Mô tả dấu hiệu sự cố',required:true,type:'textarea',full:true},{name:'photo',label:'Ảnh hiện trạng',required:true,type:'file'}]},
      supplier:{title:extra.edit?'Chỉnh sửa nhà cung cấp':'Thêm nhà cung cấp',fields:[{name:'id',label:'Mã nhà cung cấp',required:true,type:'text'},{name:'name',label:'Tên nhà cung cấp',required:true,type:'text'},{name:'contact',label:'Người liên hệ',required:true,type:'text'},{name:'phone',label:'Điện thoại',required:true,type:'tel'},{name:'address',label:'Địa chỉ',type:'text',full:true}]},
      customer:{title:extra.edit?'Chỉnh sửa khách hàng':'Thêm khách hàng',fields:[{name:'id',label:'Mã khách hàng',required:true,type:'text'},{name:'name',label:'Tên khách hàng',required:true,type:'text'},{name:'contact',label:'Người liên hệ',required:true,type:'text'},{name:'phone',label:'Điện thoại',required:true,type:'tel'},{name:'address',label:'Địa chỉ',type:'text',full:true}]},
      account:{title:extra.edit?'Chỉnh sửa tài khoản':'Tạo tài khoản nội bộ',fields:[{name:'id',label:'Mã tài khoản',required:true,type:'text'},{name:'name',label:'Họ và tên',required:true,type:'text'},{name:'username',label:'Tên đăng nhập',required:true,type:'text'},{name:'phone',label:'Điện thoại',required:true,type:'tel'},...(!extra.edit?[{name:'password',label:'Mật khẩu khởi tạo',required:true,type:'password'}]:[]),{name:'role',label:'Vai trò',required:true,type:'select',options:Object.entries(ROLE).map(([k,v])=>[k,v])},{name:'active',label:'Tình trạng',required:true,type:'select',options:[['true','Hoạt động'],['false','Đã khóa']]}]},
      finance:{title:'Ghi giao dịch tài chính',fields:[{name:'type',label:'Loại giao dịch',required:true,type:'select',options:[['Thu tiền khách hàng','Thu tiền khách hàng'],['Thanh toán nhà cung cấp','Thanh toán nhà cung cấp'],['Chi phí vận hành','Chi phí vận hành']]},{name:'party',label:'Đối tượng liên quan (nếu có)',type:'select',options:[['','Không áp dụng'],...allCustomerOptions,...allSupplierOptions]},{name:'reference',label:'Nghiệp vụ liên quan (nếu có)',type:'text'},{name:'amount',label:'Giá trị khoản thu/chi',required:true,type:'number',unit:'VNĐ',min:1},{name:'paid',label:'Số đã thu / trả',required:true,type:'number',unit:'VNĐ',min:0},{name:'date',label:'Ngày ghi nhận',required:true,type:'date',value:todayIso},{name:'note',label:'Nội dung khoản thu/chi',type:'textarea',full:true}]},
      'material-request':{title:'Yêu cầu mua vật tư sửa chữa',fields:[{name:'materials',label:'Tên vật tư',required:true,type:'text'},{name:'materialQuantity',label:'Số lượng',required:true,type:'number',min:1}]},
      'material-purchase':{title:'Ghi nhận vật tư đã mua',fields:[{name:'materials',label:'Mặt hàng đã mua',required:true,type:'text'},{name:'purchaseCost',label:'Giá mua thực tế',required:true,type:'number',unit:'VNĐ',min:1}]},
      'repair-report':{title:'Báo cáo sửa chữa',fields:[{name:'repairStatus',label:'Tình trạng máy sau sửa chữa',required:true,type:'select',options:[['Đang hoạt động','Đang hoạt động'],['Đã dừng máy','Đã dừng máy']]},{name:'materialsUsed',label:'Vật tư đã sử dụng',required:true,type:'text'},{name:'repairPhoto',label:'Ảnh minh chứng sửa chữa',required:true,type:'file'}]},
      'owner-cap':{title:'Điều chỉnh giá trần',values:(()=>{const r=lookup('procurement',state.selected?.split(':')[1]);return r?{cap:r.cap}:{}})(),fields:[{name:'cap',label:'Giá trần mới',required:true,type:'number',unit:'VNĐ / kg',min:1}]},
      'assign-maintenance':{title:'Tiếp nhận và phân công bảo trì',fields:[{name:'assignee',label:'Nhân viên bảo trì',required:true,type:'select',options:maintenanceOptions}]},
      'owner-sale-adjust':{title:'Điều chỉnh đề xuất xuất hàng',values:(()=>{const r=lookup('shipments',state.selected?.split(':')[1]);return r?{customer:r.pendingCustomer??r.customer,price:r.pendingPrice??r.price}:{}})(),fields:[{name:'customer',label:'Khách hàng',required:true,type:'select',options:[...customerOptions,...(state.data.shipments.find(x=>x.id===state.selected?.split(':')[1])?.customerProposal?[['__proposal__','Khách hàng được đề xuất: '+state.data.shipments.find(x=>x.id===state.selected.split(':')[1]).customerProposal.name]]:[])]},{name:'price',label:'Giá bán dự kiến',required:true,type:'number',unit:`VNĐ / ${state.data.shipments.find(x=>x.id===state.selected?.split(':')[1])?.unit==='bao'?'bao':'kg'}`,min:1}]},
      'propose-customer':{title:'Đề xuất khách hàng để Owner duyệt',fields:[{name:'customer',label:'Khách hàng hiện có',type:'select',options:[['','Đề xuất khách hàng mới'],...customerOptions]},{name:'newCustomerName',label:'Tên khách hàng mới (nếu cần)',type:'text'},{name:'newCustomerContact',label:'Người liên hệ mới (nếu cần)',type:'text'},{name:'newCustomerPhone',label:'Điện thoại mới (nếu cần)',type:'tel'}]},
      'customer-response':{title:'Ghi nhận phản hồi khách hàng',fields:[{name:'response',label:'Kết quả liên hệ',required:true,type:'select',options:[['accept','Khách đồng ý mua'],['decline','Khách không đồng ý mua']]}]},
      'pickup-info':{title:'Thông tin người và xe dự kiến nhận hàng',fields:[{name:'receiver',label:'Người dự kiến đến nhận',required:true,type:'text'},{name:'plate',label:'Biển số xe dự kiến',required:true,type:'text'}]},
      'shipment-proposal':{title:'Đề xuất xuất viên nén thành phẩm',fields:[{name:'warehouse',label:'Kho xuất',required:true,type:'select',options:[['Kho A','Kho A'],['Kho B','Kho B']]},{name:'quantity',label:'Số bao đề xuất',required:true,type:'number',unit:'bao',min:1,integer:true}]},
      'verify-pickup':{title:'Đối chiếu người và biển số xe',fields:[{name:'actualReceiver',label:'Người thực tế đến nhận',required:true,type:'text'},{name:'actualPlate',label:'Biển số xe thực tế',required:true,type:'text'},{name:'match',label:'Kết quả đối chiếu',required:true,type:'select',options:[['match','Thông tin khớp'],['mismatch','Không khớp · dừng xuất và trả Manager cập nhật']]}]},
      'dispatch-photo':{title:'Xác nhận xuất hàng thực tế',values:{quantity:extra.quantity},fields:[{name:'photo',label:'Ảnh minh chứng bàn giao',required:true,type:'file'},{name:'quantity',label:'Số lượng thực tế đã xuất',required:true,type:'number',unit:state.data.shipments.find(x=>x.id===state.selected?.split(':')[1])?.unit||'kg',min:1,integer:state.data.shipments.find(x=>x.id===state.selected?.split(':')[1])?.unit==='bao'}]},
      'bag':{title:`Kiểm tra bao số ${extra.bag}`,values:(()=>{const l=lookup('quality',extra.id),b=l?.bags.find(x=>x.no===extra.bag)||{};return {ash:b.ash,impurities:b.impurities,sampleGrams:b.sampleGrams,samplePhoto:b.samplePhoto,afterPhoto:b.afterPhoto,warehouse:b.warehouse}})(),fields:[{name:'ash',label:'Độ tro',required:true,type:'number'},{name:'impurities',label:'Độ tạp chất',required:true,type:'number'},{name:'sampleGrams',label:'Lượng mẫu lấy',required:true,type:'number',unit:'gram'},{name:'samplePhoto',label:'Ảnh lượng mẫu đã lấy',required:true,type:'file'},{name:'afterPhoto',label:'Ảnh sau khi kiểm tra',required:true,type:'file'},{name:'warehouse',label:'Phân vào kho',required:true,type:'select',options:[['Kho A','Kho A'],['Kho B','Kho B']]}]},
      'shipment-edit':{title:'Cập nhật thông tin nhận hàng',values:(()=>{const r=lookup('shipments',state.selected?.split(':')[1]);return r?{receiver:r.receiver,plate:r.plate}:{}})(),fields:[{name:'receiver',label:'Người dự kiến đến nhận',required:true,type:'text'},{name:'plate',label:'Biển số xe dự kiến',required:true,type:'text'}]},
      'forgot':state.modal?.stage==='otp'?{title:'Nhập mã xác thực',fields:[{name:'otp',label:'Mã xác thực gồm 6 chữ số',required:true,type:'text',inputmode:'numeric',pattern:'[0-9]{6}',maxlength:6}]}:state.modal?.stage==='password'?{title:'Tạo mật khẩu mới',fields:[{name:'next',label:'Mật khẩu mới',required:true,type:'password'},{name:'confirm',label:'Xác nhận mật khẩu mới',required:true,type:'password'}]}:{title:'Khôi phục mật khẩu',fields:[{name:'identifier',label:'Tên đăng nhập hoặc số điện thoại',required:true,type:'text',autocomplete:'username'}]},
      'password':{title:'Đổi mật khẩu',fields:[{name:'current',label:'Mật khẩu hiện tại',required:true,type:'password'},{name:'next',label:'Mật khẩu mới',required:true,type:'password'},{name:'confirm',label:'Nhập lại mật khẩu mới',required:true,type:'password'}]}
    };
    configs.profile={title:'Cập nhật hồ sơ cá nhân',values:{...currentUser()},fields:[{name:'name',label:'Họ và tên',required:true,type:'text'},{name:'phone',label:'Điện thoại',type:'tel'}]};
    const machineNames=[...new Set([...state.data.plans.map(p=>p.machine),...state.data.incidents.map(i=>i.machine)])];
    configs.production.fields=configs.production.fields.map(f=>f.name==='machine'?{...f,type:'select',options:machineNames.filter(name=>!state.data.incidents.some(i=>i.machine===name&&['Nặng','Khẩn cấp'].includes(i.severity)&&i.status!=='Đang hoạt động')).map(name=>[name,name])}:f);
    configs.incident.fields=configs.incident.fields.map(f=>f.name==='machine'?{...f,type:'select',options:[...new Set(state.data.plans.filter(p=>p.workers.includes(state.userId)).map(p=>p.machine))].map(name=>[name,name])}:f);
    configs['shift-report'].fields=configs['shift-report'].fields.map(f=>f.name==='bags'?{...f,integer:true}:f);
    configs['verify-pickup'].fields.push({name:'reason',label:'Lý do trả lại khi thông tin không khớp',type:'textarea',full:true});
    const selected=state.selected?lookup(...state.selected.split(':')):null;
    configs.purchase.values={parent:state.selected?.split(':')[0]==='procurement'?state.selected.split(':')[1]:''};
    if(selected)configs['material-purchase'].values={materials:selected.purchasedMaterials||selected.materials||''};
    if(type==='finance-payment'&&selected)configs[type]={title:selected.type==='Thu tiền khách hàng'?'Ghi nhận thu tiền':'Ghi nhận thanh toán',values:{paymentAmount:Math.max(0,Number(selected.amount)-Number(selected.paid)),date:todayIso},fields:[{name:'paymentAmount',label:'Số tiền lần này',required:true,type:'number',unit:'VNĐ',min:1},{name:'date',label:'Ngày ghi nhận',required:true,type:'date'},{name:'note',label:'Nội dung',type:'textarea',full:true}]};
    if(type==='purchase-adjust'&&selected)configs[type]={title:'Điều chỉnh phiếu mua '+selected.id,values:{...selected},fields:configs.purchase.fields.filter(f=>f.name!=='parent').map(f=>f.name==='supplier'?{...f,options:allSupplierOptions}:f)};
    if(type==='material-adjust'&&selected)configs[type]={...configs['material-request'],title:'Điều chỉnh yêu cầu vật tư',values:{...selected}};
    if(type==='repair-adjust'&&selected)configs[type]={...configs['repair-report'],title:'Điều chỉnh báo cáo sửa chữa',values:{...selected,repairStatus:selected.postRepairState}};
    if(type==='material-purchase'&&selected)configs[type]={...configs[type],values:{materials:selected.purchasedMaterials||selected.materials,purchaseCost:selected.purchaseCost}};
    if(type==='qc-adjust'&&selected){const values={},fields=[];for(const b of selected.bags){const suffix='_'+b.no;for(const f of configs.bag.fields){const key=f.name+suffix;values[key]=b[f.name];fields.push({...f,name:key,label:`Bao ${b.no} · ${f.label}`});}}configs[type]={title:'Điều chỉnh báo cáo '+selected.id,values,fields};}
    let config=configs[type];
    if(extra.edit&&['supplier','customer','account'].includes(type)){const record=lookup(type==='supplier'?'suppliers':type==='customer'?'customers':'accounts',state.selected?.split(':')[1]);if(record){config={...config,values:{...record,active:String(record.active)}};}}
    if(type==='incident'&&state.selected){const rec=lookup('incidents',state.selected.split(':')[1]);if(rec)config={...config,values:rec};}
    return config;
  }
  async function attachmentFromFile(file){
    if(!file)return null;
    const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Không đọc được tệp đã chọn.'));reader.readAsDataURL(file);});
    if(file.type.startsWith('image/')&&window.createImageBitmap){
      const image=await createImageBitmap(file),scale=Math.min(1,1600/Math.max(image.width,image.height));
      if(scale<1){const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);image.close();return {name:file.name,type:'image/jpeg',dataUrl:canvas.toDataURL('image/jpeg',.82)};}
      image.close();
    }
    return {name:file.name,type:file.type||'application/octet-stream',dataUrl};
  }
  function renderAttachment(value,label='Tệp đính kèm'){
    const file=typeof value==='string'?{name:value}:value;if(!file?.name)return '<span class="field-hint">Chưa đính kèm</span>';
    if(file.dataUrl&&String(file.type||'').startsWith('image/'))return `<button type="button" class="attachment-link" data-view-image="${esc(file.dataUrl)}" data-image-label="${esc(file.name)}" aria-label="Xem ảnh: ${esc(label)}"><img class="attachment-image" src="${esc(file.dataUrl)}" alt="${esc(label)}" loading="lazy"><span>${esc(file.name)}</span></button>`;
    if(file.dataUrl)return `<a class="attachment-file" href="${esc(file.dataUrl)}" download="${esc(file.name)}">${icon('file')}<span>${esc(file.name)}</span></a>`;
    return `<span class="attachment-legacy" title="Nội dung tệp cũ không còn trong dữ liệu trình duyệt">${icon('file')} ${esc(file.name)}</span>`;
  }
  async function previewSelectedFile(input){
    const box=input.closest('.form-field')?.querySelector('.upload-preview');if(!box)return;
    if(!input.files?.[0])return;
    delete input.dataset.loaded;
    const selected=input.files[0];input._attachmentPromise=attachmentFromFile(selected);
    try{const file=await input._attachmentPromise;if(input.files[0]!==selected)return;box.innerHTML=renderAttachment(file,input.closest('.form-field').querySelector('label')?.textContent||'Ảnh minh chứng');input.dataset.loaded=JSON.stringify(file);}catch(error){notify(error.message,true);}
  }
  function renderForm(cfg,extra){
    const values=cfg.values||{};
    const fields=cfg.fields.map(f=>{
      const val=values[f.name]??f.value??'';
      let control='';
      if(f.type==='select')control=`<select name="${f.name}" ${f.required?'required':''}><option value="">Chọn…</option>${(f.options||[]).map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(val)?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
      else if(f.type==='checks')control=`<div class="field-checks">${(f.options||[]).map(([v,l])=>`<label class="check-row"><input type="checkbox" name="${f.name}" value="${esc(v)}" ${(val||[]).includes?.(v)?'checked':''}>${esc(l)}</label>`).join('')}</div>`;
      else if(f.type==='textarea')control=`<textarea name="${f.name}" ${f.required?'required':''}>${esc(val)}</textarea>`;
      else if(f.type==='file')control=`<input type="file" name="${f.name}" data-existing="${esc(JSON.stringify(val||''))}" ${f.required&&!val?'required':''} accept="${f.name==='invoice'?'image/*,.pdf':'image/*'}"><div class="upload-preview">${val?renderAttachment(val,f.label):'<span class="field-hint">Chưa chọn tệp</span>'}</div>`;
      else control=`<input name="${f.name}" type="${f.type==='number'?'text':(f.type||'text')}" value="${esc(f.type==='number'&&val!==''?new Intl.NumberFormat('vi-VN',{maximumFractionDigits:20}).format(Number(val)):val)}" ${f.type==='number'?`data-number-field inputmode="decimal" ${f.integer?'data-integer="true"':''}`:''} ${f.required?'required':''} ${f.min!==undefined?`data-min="${f.min}"`:''} ${f.maxlength?`maxlength="${f.maxlength}"`:''} ${f.pattern?`pattern="${esc(f.pattern)}"`:''} ${f.type!=='number'&&f.inputmode?`inputmode="${f.inputmode}"`:''} ${f.autocomplete?`autocomplete="${f.autocomplete}"`:''}>`;
      if(extra.edit&&f.name==='id')control=control.replace('<input ','<input readonly aria-readonly="true" ');
      return `<div class="form-field ${f.full?'full':''}"><label>${esc(f.label)}${f.required?' <span class="required">*</span>':''}</label>${control}${f.unit?`<span class="field-hint">${esc(f.unit)}</span>`:''}${f.hint?`<span class="field-hint">${esc(f.hint)}</span>`:''}</div>`;
    }).join('');
    const forgot=state.modal?.type==='forgot',stage=state.modal?.stage||'account';
    const resend=forgot&&stage==='otp'?`<div class="resend-row"><span>Chưa nhận được mã?</span><button type="button" class="link-button" data-action="resend-otp">Gửi lại mã</button></div>`:'';
    const submitLabel=forgot?({account:'Tiếp tục',otp:'Xác nhận mã',password:'Đặt lại mật khẩu'}[stage]):extra.edit||/adjust|owner-cap|raw-receipt|pickup-info|profile|bag|password/.test(state.modal?.type||'')?'Lưu thay đổi':['supplier','customer','account'].includes(state.modal?.type)?'Tạo hồ sơ':'Gửi phiếu';
    return `<div id="form-errors" class="form-errors" role="alert" hidden></div>${forgot&&stage==='otp'?`<p class="otp-intro">Mã xác thực đã được gửi đến <strong>${maskPhone(state.data.users.find(u=>u.id===state.modal.userId)?.phone||'')}</strong>.</p>`:''}<div class="form-grid">${fields}</div>${resend}<div class="form-actions"><button class="button" type="button" data-action="close-modal">Hủy</button><button class="button button-primary" type="submit">${submitLabel}</button></div>`;
  }

  async function formDataObject(form){
    const fd=new FormData(form),out={};
    for(const [key,val] of fd.entries()){
      if(val instanceof File)continue;
      const parsed=typeof val==='string'&&form.querySelector(`[name="${CSS.escape(key)}"][data-number-field]`)?parseLocalizedNumber(val):val;
      if(key in out){if(!Array.isArray(out[key]))out[key]=[out[key]];out[key].push(parsed);}else out[key]=parsed;
    }
    for(const input of form.querySelectorAll('input[type="file"]')){
      if(input.files?.[0]){if(input.name!=='invoice'&&!input.files[0].type.startsWith('image/'))throw new Error('Chọn tệp ảnh cho ảnh minh chứng.');out[input.name]=input._attachmentPromise?await input._attachmentPromise:input.dataset.loaded?JSON.parse(input.dataset.loaded):await attachmentFromFile(input.files[0]);}
      else if(input.dataset.existing)try{out[input.name]=JSON.parse(input.dataset.existing);}catch{out[input.name]=input.dataset.existing;}
    }
    return out;
  }
  function canUseForm(type,extra={}){
    if(type==='forgot')return !state.role;
    if(!state.role||!currentUser()?.active)return false;
    if(['password','profile'].includes(type))return true;
    if(['procurement','production','finance'].includes(type))return businessLead();
    if(['supplier','customer'].includes(type))return getRole()==='owner';
    if(type==='account')return getRole()==='admin';
    if(type==='incident')return getRole()==='production';
    if(type==='shipment-proposal')return getRole()==='warehouse';
    if(type==='bag'){const lot=lookup('quality',extra.id);return getRole()==='qc'&&!!lot&&(!lot.inspector||lot.inspector===state.userId)&&lot.status==='Chờ kiểm tra';}
    if(!state.selected)return false;
    const [module,id]=state.selected.split(':'),record=lookup(module,id);if(!record||!canAccessRecord(module,id))return false;
    if(type==='finance-payment')return module==='finance'&&businessLead()&&Number(record.paid)<Number(record.amount);
    const actions={'purchase':'create:purchase','shift-report':'create:shift-report','raw-receipt':'edit:raw-receipt','owner-cap':'act:adjust-cap','owner-sale-adjust':'act:adjust-sale','assign-maintenance':'act:assign-maintenance','propose-customer':'act:propose-customer','customer-response':'act:customer-response','pickup-info':'act:pickup-info','verify-pickup':'act:verify-pickup','dispatch-photo':'act:dispatch','material-request':'act:request-material','material-purchase':'act:record-material','repair-report':'act:repair-report','shipment-edit':'edit:shipment','purchase-adjust':'edit:purchase-adjust','qc-adjust':'edit:qc-adjust','material-adjust':'edit:material-adjust','repair-adjust':'edit:repair-adjust'};
    return detailActions(module,record,module==='procurement'&&state.data.purchases.includes(record)).some(a=>a.action===actions[type]);
  }
  async function submitForm(e){
    if(!canUseForm(state.modal?.type,state.modal)){e.preventDefault();notify('Bạn không được thực hiện thao tác này ở trạng thái hiện tại.',true);return;}
    e.preventDefault();const form=e.currentTarget,submit=form.querySelector('[type="submit"]');submit.disabled=true;let values;try{values=await formDataObject(form);}catch(error){submit.disabled=false;notify(error.message||'Không đọc được tệp.',true);return;}submit.disabled=false;const errors=[];
    form.querySelectorAll('[required]').forEach(el=>{if(el.type==='file'){let existing='';try{existing=JSON.parse(el.dataset.existing||'""');}catch{existing=el.dataset.existing||'';}if(!el.files?.length&&!(typeof existing==='string'?existing:existing?.name))errors.push(`Chọn tệp cho trường bắt buộc: ${el.closest('.form-field')?.querySelector('label')?.textContent.replace('*','').trim()||'Ảnh minh chứng'}.`);}else if(!el.value.trim())errors.push('Vui lòng điền đầy đủ các trường bắt buộc.');});
    form.querySelectorAll('.form-field').forEach(field=>{if(field.querySelector('.required')&&field.querySelector('.field-checks')&&!field.querySelector('.field-checks input:checked'))errors.push(`${field.querySelector('label')?.textContent.replace('*','').trim()||'Trường bắt buộc'}: hãy chọn ít nhất một mục.`);});
    form.querySelectorAll('select').forEach(el=>{if(el.value&&!Array.from(el.options).some(option=>option.value===el.value&&!option.disabled))errors.push('Lựa chọn không hợp lệ. Hãy chọn một mục trong danh sách.');});
      form.querySelectorAll('[data-number-field]').forEach(el=>{const n=parseLocalizedNumber(el.value),min=Number(el.dataset.min||0);if(el.value!==''&&(!Number.isFinite(n)||n<min))errors.push(`${el.closest('.form-field')?.querySelector('label')?.textContent.replace('*','').trim()||'Giá trị'} chưa hợp lệ.`);if(el.dataset.integer==='true'&&Number.isFinite(n)&&!Number.isInteger(n))errors.push(`${el.closest('.form-field')?.querySelector('label')?.textContent.replace('*','').trim()||'Giá trị'} phải là số nguyên.`);});
    if(state.modal?.type==='forgot'&&state.modal.stage==='otp'&&!/^\d{6}$/.test(values.otp||''))errors.push('Nhập mã xác thực gồm đúng 6 chữ số.');
    if(state.modal?.type==='forgot'&&state.modal.stage==='password'&&values.next!==values.confirm)errors.push('Mật khẩu mới và xác nhận chưa khớp.');
    if(state.modal?.type==='password'&&values.next!==values.confirm)errors.push('Mật khẩu mới nhập lại chưa khớp.');
    if(state.modal?.type==='password'&&values.current!==(currentUser().password||'batt123'))errors.push('Mật khẩu hiện tại chưa đúng.');
    if(state.modal?.type==='propose-customer'&&!values.customer&&!String(values.newCustomerName||'').trim())errors.push('Chọn khách hàng hiện có hoặc nhập tên khách hàng mới.');
    if(state.modal?.type==='verify-pickup'){const shipment=lookup('shipments',state.selected?.split(':')[1]);const matches=values.match==='match'&&String(values.actualPlate).replace(/\s/g,'').toUpperCase()===String(shipment?.plate).replace(/\s/g,'').toUpperCase()&&String(values.actualReceiver).trim().toLocaleLowerCase('vi')===String(shipment?.receiver).trim().toLocaleLowerCase('vi');if(!matches&&!String(values.reason||'').trim())errors.push('Nhập lý do dừng xuất và trả thông tin giao nhận để cập nhật.');}
    const err=document.getElementById('form-errors');if(errors.length){err.hidden=false;err.textContent=[...new Set(errors)].join(' ');return;}
    const type=state.modal?.type||'';const isEdit=!!state.modal?.edit;
    if(type==='forgot'&&state.modal.stage==='account'){const u=findUser(values.identifier);if(!u){err.hidden=false;err.textContent='Không tìm thấy tài khoản theo tên đăng nhập hoặc số điện thoại này.';return;}state.modal.userId=u.id;openModal('forgot',{stage:'otp',userId:u.id});return;}
    if(type==='forgot'&&state.modal.stage==='otp'){if(values.otp!=='123456'){err.hidden=false;err.textContent='Mã xác thực chưa đúng. Kiểm tra mã hoặc gửi lại mã mới.';return;}openModal('forgot',{stage:'password',userId:state.modal.userId});return;}
    if(type==='forgot'&&state.modal.stage==='password'){const u=state.data.users.find(x=>x.id===state.modal.userId);if(!u){err.hidden=false;err.textContent='Không tìm thấy tài khoản. Hãy bắt đầu lại.';return;}u.password=values.next;if(!saveData())return;closeModal();notify('Mật khẩu đã được cập nhật.');return;}
    if(type==='password'){currentUser().password=values.next;appendHistory(currentUser(),'Đổi mật khẩu');if(!saveData())return;closeModal();notify('Mật khẩu đã được cập nhật.');return;}
    try {
    if(type==='purchase-adjust')updateSelected('procurement',r=>{r.attachmentHistory||=[];r.attachmentHistory.push({at:localStamp(),actor:currentUser().name,files:[r.photo,r.invoice].filter(Boolean)});Object.assign(r,{supplier:values.supplier,weight:Number(values.weight),price:Number(values.price),photo:values.photo,invoice:values.invoice||r.invoice});appendHistory(r,'Điều chỉnh phiếu cân; tiếp tục chờ duyệt');});
    else if(type==='material-adjust')updateSelected('incidents',r=>{r.materials=values.materials;r.materialQuantity=Number(values.materialQuantity);appendHistory(r,'Điều chỉnh yêu cầu vật tư; tiếp tục chờ duyệt');});
    else if(type==='repair-adjust')updateSelected('incidents',r=>{r.attachmentHistory||=[];r.attachmentHistory.push({at:localStamp(),actor:currentUser().name,files:[r.repairPhoto].filter(Boolean)});r.postRepairState=values.repairStatus;r.materialsUsed=values.materialsUsed;r.repairPhoto=values.repairPhoto;appendHistory(r,'Điều chỉnh báo cáo sửa chữa; tiếp tục chờ duyệt');});
    else if(type==='qc-adjust')updateSelected('quality',r=>{for(const b of r.bags){r.attachmentHistory||=[];r.attachmentHistory.push({at:localStamp(),actor:currentUser().name,files:[b.samplePhoto,b.afterPhoto].filter(Boolean)});for(const field of ['ash','impurities','sampleGrams','warehouse','samplePhoto','afterPhoto'])b[field]=values[field+'_'+b.no];}appendHistory(r,'Điều chỉnh thông số, ảnh và phân kho các bao; tiếp tục chờ duyệt');});
    else if(type==='procurement')createProcurement(values);
    else if(type==='purchase')createPurchase(values);
      else if(type==='raw-receipt'){if(getRole()!=='warehouse')throw new Error('Chỉ Thủ kho được cập nhật hàng thực nhận.');updateSelected('procurement',r=>{if(r.status!=='Chờ kho xác nhận nhập')throw new Error('Phiếu không còn chờ nhập kho.');r.receivedWeight=Number(values.receivedWeight);appendHistory(r,'Thủ kho cập nhật thông tin hàng thực nhận');});}
    else if(type==='production')createPlan(values);
    else if(type==='shipment-proposal')createShipment(values);
    else if(type==='shift-report')submitShiftReport(values);
    else if(type==='incident')createIncident(values);
    else if(type==='supplier'||type==='customer')saveDirectory(type,values,isEdit);
    else if(type==='account')saveAccount(values,isEdit);
    else if(type==='profile')Object.assign(currentUser(),{name:values.name,phone:values.phone});
    else if(type==='finance')saveFinance(values);
    else if(type==='finance-payment')recordFinancePayment(values);
    else if(type==='bag')saveBag(state.modal.id,state.modal.bag,values);
    else if(type==='owner-cap')updateSelected('procurement',r=>{r.cap=Number(values.cap);appendHistory(r,'Owner điều chỉnh giá trần');});
    else if(type==='owner-sale-adjust')updateSelected('shipments',r=>{r.pendingCustomer=values.customer;r.pendingPrice=Number(values.price);appendHistory(r,'Owner điều chỉnh khách hàng và giá dự kiến');});
    else if(type==='assign-maintenance')updateSelected('incidents',r=>{r.assignee=values.assignee;appendHistory(r,'Quản lý phân công nhân viên bảo trì');});
    else if(type==='propose-customer')proposeCustomer(values);
    else if(type==='customer-response')customerResponse(values);
    else if(type==='pickup-info')updateSelected('shipments',r=>{r.receiver=values.receiver;r.plate=values.plate;r.status='Chờ nhận hàng';r.contactStatus='Khách đồng ý mua';appendHistory(r,'Quản lý ghi người và biển số dự kiến');});
    else if(type==='verify-pickup'){verifyPickup(values);updateSelected('shipments',r=>{r.actualReceiver=values.actualReceiver;r.actualPlate=values.actualPlate;if(r.status==='Trả Manager cập nhật'){r.returnReason=values.reason;appendHistory(r,'Lý do trả thông tin giao nhận: '+values.reason);}});}
    else if(type==='dispatch-photo')dispatchShipment(values);
    else if(type==='material-request')requestMaterial(values);
    else if(type==='material-purchase')recordMaterialPurchase(values);
    else if(type==='repair-report')submitRepairReport(values);
    else if(type==='shipment-edit')updateSelected('shipments',r=>{r.receiver=values.receiver;r.plate=values.plate;r.status='Chờ nhận hàng';appendHistory(r,'Quản lý cập nhật thông tin người và xe nhận');});
    if(!['forgot','password'].includes(type)){if(!saveData())return;closeModal();const nextRoute=`#/${state.page}${state.selected?`/record/${state.selected.replace(':','/')}`:''}`;if(location.hash!==nextRoute)pushRoute();render();notify('Đã ghi nhận thao tác và cập nhật trạng thái.');}
    } catch(error) {err.hidden=false;err.textContent=error.message||'Không thể lưu thông tin. Kiểm tra dữ liệu rồi thử lại.';}
  }
  function updateSelected(module,fn){const id=state.selected?.split(':')[1];const r=lookup(module,id);if(r)fn(r);}
  function nextId(prefix,items){const n=items.reduce((max,x)=>{const m=x.id.match(/(\d+)$/);return m?Math.max(max,Number(m[1])):max;},0)+1;return `${prefix}-${String(n).padStart(5,'0')}`;}
  function availableBags(warehouse){
    const dateValue=(bag)=>{const p=state.data.plans.find(x=>x.lot===bag.lot)?.date||'';const m=p.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);return m?`${m[3]}-${m[2]}-${m[1]}`:p;};
    return (state.data.bagStocks||[]).filter(b=>b.status==='Trong kho'&&(!warehouse||b.warehouse===warehouse)).slice().sort((a,b)=>dateValue(a).localeCompare(dateValue(b))||a.lot.localeCompare(b.lot,'vi',{numeric:true})||a.id.localeCompare(b.id,'vi',{numeric:true}));
  }
  function fifoBags(warehouse,quantity){return availableBags(warehouse).slice(0,Math.max(0,Number(quantity)||0));}
  function renderFifoPreview(){
    const box=document.getElementById('fifo-preview'),form=document.getElementById('modal-form');if(!box||!form)return;
    const warehouse=form.elements.warehouse?.value||'',quantity=parseLocalizedNumber(form.elements.quantity?.value||'0'),available=availableBags(warehouse),selected=fifoBags(warehouse,quantity);
    if(!warehouse){box.innerHTML='<h3>Bao hiện có</h3><p>Chọn Kho A hoặc Kho B để xem mã bao sẽ được chọn.</p>';return;}
    const selectedIds=new Set(selected.map(x=>x.id));
    box.innerHTML=`<h3>Danh sách bao · ${number(available.length)} bao đang có</h3>${available.length?`<div class="bag-selection-list" role="list" aria-label="Mã bao trong ${esc(warehouse)}">${available.map(x=>`<div class="bag-selection-item ${selectedIds.has(x.id)?'is-selected':''}" role="listitem"><span>${code(x.id)}</span><strong>${selectedIds.has(x.id)?'Dự kiến xuất':'Còn trong kho'}</strong></div>`).join('')}</div>`:`<p>Kho này chưa có bao.</p>`}${quantity>available.length?`<p class="field-hint">Số lượng đề xuất vượt tồn khả dụng.</p>`:''}`;
  }
  function createShipment(v){
    if(getRole()!=='warehouse')throw new Error('Chỉ Thủ kho được lập đề xuất xuất hàng.');
    const qty=Number(v.quantity),bags=fifoBags(v.warehouse,qty);if(bags.length!==qty)throw new Error('Số bao khả dụng trong kho chưa đủ cho đề xuất này.');
    const id=nextId('XK',state.data.shipments),lotList=[...new Set(bags.map(x=>x.lot))];
    const r={id,warehouse:v.warehouse,lot:lotList[0]||'',lotIds:lotList,quantity:qty,unit:'bao',bagIds:bags.map(x=>x.id),creator:state.userId,date:today,createdAt:localStamp(),customer:'',price:0,ownerApproved:false,manager:'',contactStatus:'',receiver:'',plate:'',status:'Chờ xem xét',photo:'',history:[]};
    state.data.shipments.unshift(r);appendHistory(r,'Thủ kho gửi đề xuất xuất hàng chờ xem xét');state.selected=`shipments:${id}`;
  }
  function createProcurement(v){
    const r={id:nextId('TMM',state.data.procurement),material:'Nguyên vật liệu thô',quantity:Number(v.quantity),cap:Number(v.cap),assigned:Array.isArray(v.assigned)?v.assigned:[v.assigned],creator:state.userId,date:today,createdAt:localStamp(),status:getRole()==='manager'?'Chờ Owner duyệt giá trần':'Đang thu mua',children:[],history:[]};state.data.procurement.unshift(r);appendHistory(r,getRole()==='manager'?'Manager gửi phiếu chờ Owner duyệt giá trần':'Owner quyết định giá trần và giao việc');state.selected=`procurement:${r.id}`;
  }
  function createPurchase(v){
    const parent=state.data.procurement.find(x=>x.id===v.parent);if(!parent||getRole()!=='purchasing'||!parent.assigned.includes(state.userId)||parent.status!=='Đang thu mua')throw new Error('Bạn chưa được phân công hoặc phiếu chưa được phép thu mua.');
    if(!state.data.suppliers.some(s=>s.id===v.supplier&&s.status!=='Ngừng hợp tác'))throw new Error('Chọn nhà cung cấp đang hợp tác.');
    const r={id:nextId('PM',state.data.purchases),parent:parent.id,supplier:v.supplier,weight:Number(v.weight),price:Number(v.price),date:today,buyer:state.userId,creator:state.userId,createdAt:localStamp(),status:'Chờ duyệt cân',photo:v.photo,invoice:v.invoice||'',history:[]};state.data.purchases.unshift(r);appendHistory(r,'Nhân viên thu mua gửi phiếu cân chờ duyệt');parent.children.push(r.id);appendHistory(parent,`Nhân viên thu mua tạo phiếu cân ${r.id}`);state.selected=`procurement:${r.id}`;
  }
  function createPlan(v){
    if(!businessLead())throw new Error('Chỉ Owner hoặc Manager được lập kế hoạch.');
    if(state.data.incidents.some(x=>x.machine===v.machine&&['Nặng','Khẩn cấp'].includes(x.severity)&&x.status!=='Đang hoạt động'))throw new Error('Máy đang dừng hoặc chờ duyệt sửa chữa. Chọn máy đang hoạt động.');
    const id=nextId('SX',state.data.plans),lot=`LOT-${today.split('.').reverse().join('')}-${String(state.data.plans.length+1).padStart(2,'0')}`;
    const plan={id,shift:v.shift,machine:v.machine,workers:Array.isArray(v.workers)?v.workers:[v.workers],material:'Nguyên vật liệu thô',target:Number(v.target),date:v.date?formatDate(v.date):today,creator:state.userId,createdAt:localStamp(),status:'Đang thực hiện',lot,history:[]};state.data.plans.unshift(plan);appendHistory(plan,'Owner/Manager phân công ca, máy và công nhân');state.selected=`production:${id}`;
  }
  function submitShiftReport(v){
    const plan=lookup('production',state.selected.split(':')[1]);if(getRole()!=='production'||!plan||!plan.workers.includes(state.userId)||plan.status!=='Đang thực hiện')throw new Error('Bạn không được gửi báo cáo cho ca này.');
    if(!Number.isInteger(Number(v.bags))||Number(v.bags)<1)throw new Error('Số bao phải là số nguyên dương.');
    const raw=state.data.inventory.find(x=>x.category==='Nguyên vật liệu thô');if(!raw||Number(v.materialUsed)>Number(raw.quantity))throw new Error('Lượng nguyên vật liệu thô đã dùng vượt tồn kho hiện tại.');
    raw.quantity-=Number(v.materialUsed);raw.updated=today;
    plan.report={materialUsed:Number(v.materialUsed),output:Number(v.output),bags:Number(v.bags),photo:v.photo};plan.status='Chờ QC';appendHistory(plan,'Công nhân gửi báo cáo cuối ca');
    const q={id:`QC-${plan.id.slice(3)}`,plan:plan.id,lot:plan.lot,bags:Array.from({length:Number(v.bags)},(_,i)=>({no:i+1,code:`${plan.lot}-${String(i+1).padStart(3,'0')}`,ash:'',impurities:'',sampleGrams:'',samplePhoto:'',afterPhoto:'',warehouse:''})),status:'Chờ kiểm tra',inspector:'',history:[]};state.data.qcLots.unshift(q);appendHistory(q,'Đợt QC được tạo từ báo cáo cuối ca');
  }
  function createIncident(v){
    if(getRole()!=='production'||!state.data.plans.some(p=>p.workers.includes(state.userId)&&p.machine===v.machine))throw new Error('Chỉ báo cáo sự cố máy được phân công vận hành.');
    const id=nextId('SC',state.data.incidents),st=['Nặng','Khẩn cấp'].includes(v.severity)?'Đã dừng máy':'Đang hoạt động';
    const row={id,machine:v.machine,severity:v.severity,reporter:state.userId,creator:state.userId,createdAt:localStamp(),date:localStamp(),description:v.description,status:st,assignee:'',materialsNeeded:false,photo:v.photo,repairStatus:'Chưa tiếp nhận',history:[]};state.data.incidents.unshift(row);appendHistory(row,`Công nhân báo sự cố mức ${v.severity}`);state.selected=`incidents:${id}`;
  }
  function saveDirectory(type,v,edit){
    if(getRole()!=='owner')throw new Error('Chỉ Chủ doanh nghiệp được cập nhật hồ sơ đối tác.');
    for(const field of ['id','name','contact','phone'])if(!String(v[field]||'').trim())throw new Error('Điền mã hồ sơ, tên, người liên hệ và điện thoại.');
    v=Object.fromEntries(Object.entries(v).map(([key,value])=>[key,typeof value==='string'?value.trim():value]));
    const key=type==='supplier'?'suppliers':'customers';let r=edit?lookup(key,state.selected.split(':')[1]):null;
    if(r){const {id,...editable}=v;Object.assign(r,editable);appendHistory(r,'Owner cập nhật hồ sơ');}else{if(state.data[key].some(x=>x.id===v.id))throw new Error('Mã hồ sơ đã tồn tại.');r={...v,status:'Đang hợp tác',debt:0,paid:0,received:0,transactions:'Chưa có giao dịch',history:[]};state.data[key].unshift(r);appendHistory(r,'Owner tạo hồ sơ');}
    state.selected=`${key}:${r.id}`;
  }
  function saveAccount(v,edit){
    if(getRole()!=='admin')throw new Error('Chỉ Quản trị viên được cập nhật tài khoản.');
    let r=edit?lookup('accounts',state.selected.split(':')[1]):null;
    if(!ROLE[v.role])throw new Error('Chọn vai trò hợp lệ.');
    if(state.data.users.some(x=>x!==r&&(normalizedLogin(x.username)===normalizedLogin(v.username)||normalizedLogin(x.phone)===normalizedLogin(v.phone)||x.id===v.id)))throw new Error('Tên đăng nhập, số điện thoại hoặc mã tài khoản đã tồn tại.');
    const vals={...v,active:v.active==='true'};
    if(r){const {id,...editable}=vals;Object.assign(r,editable);appendHistory(r,'Admin cập nhật tài khoản');}else{if(state.data.users.some(x=>x.username===v.username||normalizedLogin(x.phone)===normalizedLogin(v.phone)||x.id===v.id))throw new Error('Tên đăng nhập, số điện thoại hoặc mã tài khoản đã tồn tại.');r={...vals,history:[]};state.data.users.push(r);appendHistory(r,'Admin tạo tài khoản');}
    state.selected=`accounts:${r.id}`;
  }
  function saveFinance(v){
    if(!businessLead())throw new Error('Bạn không có quyền ghi giao dịch tài chính.');const type=v.type,amount=Number(v.amount),paid=Number(v.paid);
    if(!Number.isFinite(amount)||amount<=0||!Number.isFinite(paid)||paid<0||paid>amount)throw new Error('Số đã thu / trả phải từ 0 đến giá trị khoản thu / chi.');
    if(type==='Thu tiền khách hàng'&&v.party&&!state.data.customers.some(c=>c.id===v.party))throw new Error('Chọn khách hàng cho khoản thu.');
    if(type==='Thanh toán nhà cung cấp'&&v.party&&!state.data.suppliers.some(s=>s.id===v.party))throw new Error('Chọn nhà cung cấp cho khoản thanh toán.');
    const status=type==='Thu tiền khách hàng'?(paid>=amount?'Đã thu':'Chưa thu'):(paid>=amount?'Đã trả':'Chưa trả');
    const id=nextId('TC',state.data.finance);const r={id,type,party:v.party||'',reference:v.reference||'',amount,paid,status,date:v.date?formatDate(v.date):today,note:v.note||'',history:[]};state.data.finance.unshift(r);appendHistory(r,'Owner/Manager ghi nhận giao dịch tài chính');
    const partner=state.data.customers.find(x=>x.id===v.party)||state.data.suppliers.find(x=>x.id===v.party);
    if(partner){if(type==='Thu tiền khách hàng'){partner.debt=Math.max(0,partner.debt-paid);partner.received=(partner.received||0)+paid;}else if(type==='Thanh toán nhà cung cấp'){partner.debt=Math.max(0,partner.debt-paid);partner.paid=(partner.paid||0)+paid;}}
    state.selected=`finance:${id}`;
  }
  function saveBag(id,no,v){const lot=lookup('quality',id);if(!lot||getRole()!=='qc'||(lot.inspector&&lot.inspector!==state.userId)||lot.status!=='Chờ kiểm tra')throw new Error('Đợt QC không thuộc công việc được phép kiểm tra.');const b=lot.bags.find(x=>x.no===no);if(!b)throw new Error('Không tìm thấy bao.');lot.attachmentHistory||=[];if(b.samplePhoto||b.afterPhoto)lot.attachmentHistory.push({at:localStamp(),actor:currentUser().name,files:[b.samplePhoto,b.afterPhoto].filter(Boolean)});Object.assign(b,{ash:Number(v.ash),impurities:Number(v.impurities),sampleGrams:Number(v.sampleGrams),warehouse:v.warehouse,samplePhoto:v.samplePhoto,afterPhoto:v.afterPhoto});appendHistory(lot,`QC ghi thông số, ảnh và phân bao ${no} vào ${v.warehouse}`);}
  function recordFinancePayment(v){
    if(!canUseForm('finance-payment'))throw new Error('Bạn không được ghi nhận thu hoặc trả cho giao dịch này.');
    const record=lookup('finance',state.selected.split(':')[1]),amount=Number(v.paymentAmount),remaining=Number(record.amount)-Number(record.paid||0),isReceipt=record.type==='Thu tiền khách hàng';
    if(!Number.isFinite(amount)||amount<=0||amount>remaining)throw new Error('Số tiền lần này phải lớn hơn 0 và không vượt số tiền còn lại.');
    const partners=isReceipt?state.data.customers:record.type==='Thanh toán nhà cung cấp'?state.data.suppliers:null;
    const partner=record.party&&partners?partners.find(p=>p.id===record.party):null;
    if(record.party&&(!partners||!partner))throw new Error('Đối tượng không phù hợp với loại giao dịch. Kiểm tra hồ sơ khách hàng hoặc nhà cung cấp.');
    if(!v.date||Number.isNaN(new Date(v.date+'T00:00:00').getTime()))throw new Error('Ngày ghi nhận chưa hợp lệ.');
    const date=formatDate(v.date);record.paymentHistory||=[];record.paymentHistory.push({amount,date,note:String(v.note||'').trim(),actor:currentUser().name,at:localStamp()});record.paid=Number(record.paid||0)+amount;record.status=isReceipt?(record.paid>=record.amount?'Đã thu':'Chưa thu'):(record.paid>=record.amount?'Đã trả':'Chưa trả');
    if(partner){partner.debt=Math.max(0,Number(partner.debt||0)-amount);if(isReceipt)partner.received=Number(partner.received||0)+amount;else partner.paid=Number(partner.paid||0)+amount;}
    appendHistory(record,`${isReceipt?'Ghi nhận thu':'Ghi nhận trả'} ${money(amount)} · ${date}${v.note?' · '+v.note:''}`);
  }
  function approveSale(){
    updateSelected('shipments',r=>{
      const customer=r.pendingCustomer??r.customer,price=Number(r.pendingPrice??r.price);
      if(customer==='__proposal__'&&r.customerProposal){const id=nextId('KH',state.data.customers);const c={id,name:r.customerProposal.name,contact:r.customerProposal.contact||'',phone:r.customerProposal.phone||'',address:'',debt:0,received:0,transactions:'Chưa có giao dịch',status:'Đang hợp tác',history:[]};state.data.customers.unshift(c);appendHistory(c,'Owner duyệt Customer mới');r.customer=c.id;delete r.customerProposal;}
      else r.customer=customer;
      r.price=price;r.ownerApproved=true;r.contactStatus='Chờ liên hệ';r.status='Chờ Manager liên hệ';delete r.pendingCustomer;delete r.pendingPrice;appendHistory(r,'Owner duyệt khách hàng và giá bán dự kiến');
    });
  }
  function proposeCustomer(v){updateSelected('shipments',r=>{delete r.pendingCustomer;delete r.pendingPrice;delete r.customerProposal;r.customer=v.customer||'';if(!v.customer&&v.newCustomerName)r.customerProposal={name:v.newCustomerName,contact:v.newCustomerContact,phone:v.newCustomerPhone};r.ownerApproved=false;r.status='Chờ Owner xem xét';appendHistory(r,`Đề xuất khách hàng ${state.data.customers.find(c=>c.id===v.customer)?.name||v.newCustomerName} để Owner duyệt`);});}
  function customerResponse(v){
    updateSelected('shipments',r=>{if(v.response==='accept'){r.contactStatus='Khách đồng ý mua';r.status='Chờ ghi người và xe nhận hàng';appendHistory(r,'Ghi nhận khách đồng ý mua');}else{appendHistory(r,`Khách hàng ${state.data.customers.find(c=>c.id===r.customer)?.name||r.customer} không đồng ý mua · Giá dự kiến ${money(r.price)}`);r.contactStatus='Khách không đồng ý mua';r.customer='';r.price=0;r.ownerApproved=false;delete r.pendingCustomer;delete r.pendingPrice;r.receiver='';r.plate='';r.status='Chờ Owner xem xét';}});
  }
  function verifyPickup(v){
    updateSelected('shipments',r=>{if(v.match==='match'&&String(v.actualPlate).replace(/\s/g,'').toUpperCase()===String(r.plate).replace(/\s/g,'').toUpperCase()&&String(v.actualReceiver).trim().toLocaleLowerCase('vi')===String(r.receiver).trim().toLocaleLowerCase('vi')){r.status='Đã đối chiếu khớp';r.actualReceiver=v.actualReceiver;r.actualPlate=v.actualPlate;appendHistory(r,'Kho đối chiếu khớp người và biển số');}else{r.status='Trả Manager cập nhật';appendHistory(r,'Kho dừng xuất do thông tin không khớp; trả Manager cập nhật');} });
  }
  function dispatchShipment(v){
    updateSelected('shipments',r=>{const qty=Number(v.quantity);if(qty!==Number(r.quantity))throw new Error('Số lượng thực tế khác số lượng đề xuất. Cần xác nhận cách xử lý chênh lệch trước khi xuất.');if(r.unit==='bao'){
      const chosen=new Set((r.bagIds||[]).slice(0,qty)),available=new Set(availableBags(r.warehouse).map(b=>b.id));if(chosen.size!==qty||[...chosen].some(id=>!available.has(id)))throw new Error('Một hoặc nhiều bao trong đề xuất không còn khả dụng.');
      state.data.bagStocks.forEach(b=>{if(chosen.has(b.id))b.status='Đã xuất';});r.actualBagIds=[...chosen];
    }else{const stock=state.data.inventory.find(x=>x.category==='Viên nén thành phẩm'&&x.warehouse===r.warehouse&&x.lot===r.lot);if(!stock||qty>stock.quantity)throw new Error('Tồn kho khả dụng không đủ cho phiếu xuất này.');stock.quantity-=qty;stock.updated=today;}
      r.actualQuantity=qty;r.photo=v.photo;r.status='Đã xuất kho';r.actualDispatchDate=today;appendHistory(r,`Kho xác nhận xuất thực tế ${number(qty)} ${r.unit||'kg'}`);
    });
  }
  function receiveFinished(){
    if(getRole()!=='warehouse')throw new Error('Chỉ Thủ kho được xác nhận nhập thành phẩm.');
    const isQc=state.selected.startsWith('quality:'),record=lookup(isQc?'quality':'production',state.selected.split(':')[1]);
    const plan=isQc?lookup('production',record?.plan):record,lot=isQc?record:state.data.qcLots.find(q=>q.plan===plan?.id);
    if(!plan||!lot)throw new Error('Không tìm thấy đợt sản xuất hoặc báo cáo QC.');
    if(lot.status!=='Chờ kho xác nhận nhập'||plan.status!=='Chờ kho xác nhận nhập')throw new Error('Báo cáo QC cần được duyệt trước khi nhập kho.');
    if(lot.bags.some(b=>!b.warehouse))throw new Error('Mỗi bao cần được phân vào Kho A hoặc Kho B trước khi nhập.');
    const known=new Set(state.data.bagStocks.map(b=>b.id));
    lot.bags.forEach(b=>{const id=b.code||`${lot.lot}-${String(b.no).padStart(3,'0')}`;if(!known.has(id))state.data.bagStocks.push({id,lot:lot.lot,warehouse:b.warehouse,status:'Trong kho',qcId:lot.id,bagNo:b.no});});
    plan.status='Đã nhập kho';appendHistory(plan,`Thủ kho xác nhận nhập ${number(lot.bags.length)} bao`);lot.status='Đã nhập kho';appendHistory(lot,'Thủ kho xác nhận nhập thành phẩm');
  }
  function requestMaterial(v){if(getRole()!=='maintenance')throw new Error('Chỉ Nhân viên bảo trì được gửi yêu cầu vật tư.');updateSelected('incidents',r=>{r.materialsNeeded=true;r.materials=v.materials;r.materialQuantity=Number(v.materialQuantity);r.materialStatus='Chờ duyệt';appendHistory(r,'Nhân viên bảo trì gửi yêu cầu mua vật tư');});}
  function recordMaterialPurchase(v){
    if(!businessLead())throw new Error('Chỉ Owner hoặc Manager được ghi nhận vật tư mua và chi phí.');
    updateSelected('incidents',r=>{if(r.materialStatus!=='Đã duyệt mua'||r.materialPurchaseRecorded)throw new Error('Yêu cầu vật tư cần được duyệt trước và chưa ghi nhận mua.');r.purchasedMaterials=v.materials;r.purchaseCost=Number(v.purchaseCost);r.materialPurchaseRecorded=true;r.materialStatus='Đã ghi nhận mua';appendHistory(r,`Owner/Manager ghi nhận vật tư mua · ${money(v.purchaseCost)}`);const cost={id:nextId('TC',state.data.finance),type:'Chi phí sửa chữa',party:'',reference:r.id,amount:Number(v.purchaseCost),paid:0,status:'Chưa trả',date:today,note:`${v.materials} · ${r.id}`,history:[]};state.data.finance.unshift(cost);appendHistory(cost,'Ghi nhận chi phí vật tư đã mua');});
  }
  function submitRepairReport(v){updateSelected('incidents',r=>{r.repairStatus='Chờ duyệt báo cáo sửa chữa';r.repairApprovalStatus='Chờ duyệt';r.postRepairState=v.repairStatus;r.repairPhoto=v.repairPhoto;r.materialsUsed=v.materialsUsed;r.repairNote=v.note;if(['Nặng','Khẩn cấp'].includes(r.severity))r.status='Chờ duyệt sau sửa chữa';else if(r.status==='Đang sửa chữa')r.status=v.repairStatus;appendHistory(r,'Bảo trì gửi báo cáo sửa chữa chờ duyệt');});}
  function formatDate(value){const d=new Date(value+'T00:00:00');return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;}

  function runAction(action,confirmed=false){
    if(!state.role||!state.selected){notify('Không có phiếu được phép thao tác.',true);return;}
    const [actionModule,actionId]=state.selected.split(':'),actionRecord=lookup(actionModule,actionId);
    if(!actionRecord||!canAccessRecord(actionModule,actionId)||!detailActions(actionModule,actionRecord,actionModule==='procurement'&&state.data.purchases.includes(actionRecord)).some(a=>a.action==='act:'+action&&!a.disabled)){notify('Bạn không được thực hiện thao tác này ở trạng thái hiện tại.',true);return;}
    const ask=(title,text,yes='Xác nhận',danger=false)=>{if(!confirmed){confirmDialog(action,title,text,yes,danger);return false;}return true;};
    try{
      if(action==='approve-purchase'){
        if(!ask('Duyệt phiếu cân','Xác nhận khối lượng cân và giá mua thực tế trên phiếu này?'))return;
        updateSelected('procurement',r=>{r.status='Chờ kho xác nhận nhập';appendHistory(r,`${ROLE[getRole()]} duyệt phiếu cân`);const p=state.data.procurement.find(x=>x.id===r.parent);if(p)appendHistory(p,`Phiếu ${r.id} đã được duyệt cân`);});
      } else if(action==='adjust-cap'){openModal('owner-cap');return;}
      else if(action==='approve-cap'){
        if(!ask('Duyệt giá trần','Xác nhận mức giá trần đang hiển thị và chuyển phiếu cho nhân viên được phân công?'))return;
        updateSelected('procurement',r=>{r.status='Đang thu mua';appendHistory(r,'Owner duyệt giá trần');});
      }
      else if(action==='receive-raw'){
        const receipt=lookup('procurement',state.selected.split(':')[1]);if(!receipt||getRole()!=='warehouse'||!Number.isFinite(Number(receipt.receivedWeight))){notify('Cập nhật khối lượng thực nhận trước khi nhập kho.',true);return;}
        if(!ask('Xác nhận nhập nguyên liệu','Kho ghi nhận khối lượng trên phiếu cân đã duyệt vào tồn nguyên vật liệu?'))return;
        updateSelected('procurement',r=>{r.status='Đã nhập kho';appendHistory(r,`Thủ kho xác nhận nhập ${number(r.receivedWeight??r.weight)} kg`);const parent=state.data.procurement.find(p=>p.id===r.parent);if(parent){appendHistory(parent,`Kho xác nhận nhập phiếu ${r.id}`);const children=(parent.children||[]).map(id=>state.data.purchases.find(x=>x.id===id)).filter(Boolean);const total=children.reduce((a,x)=>a+Number(x.receivedWeight??x.weight),0);if(total>=parent.quantity&&children.every(x=>x.status==='Đã nhập kho'))parent.status='Đã nhập kho';}const material='Nguyên vật liệu thô';let inv=state.data.inventory.find(x=>x.category==='Nguyên vật liệu thô');if(!inv){inv={id:nextId('NVL',state.data.inventory),name:material,category:"Nguyên vật liệu thô",warehouse:"Kho nguyên vật liệu thô",quantity:0,unit:'kg',updated:today};state.data.inventory.unshift(inv);}inv.quantity+=Number(r.receivedWeight??r.weight);inv.updated=today;});
      } else if(action==='submit-qc'){
        const lot=lookup('quality',state.selected.split(':')[1]);if(!lot)return;
        if(lot.bags.some(b=>b.ash===''||b.impurities===''||b.sampleGrams===''||!b.samplePhoto||!b.afterPhoto||!b.warehouse)){notify('Hãy ghi thông số, ảnh mẫu, ảnh sau kiểm tra và phân Kho A hoặc Kho B cho từng bao.',true);return;}
        lot.inspector=state.userId;lot.status='Chờ duyệt';appendHistory(lot,'QC gửi báo cáo');const plan=lookup('production',lot.plan);if(plan){plan.status='Chờ duyệt QC';appendHistory(plan,'QC gửi báo cáo chờ Owner/Manager duyệt');}
      } else if(action==='approve-qc'){
        if(!ask('Duyệt báo cáo QC','Xác nhận báo cáo QC và chuyển đợt sang bước Kho xác nhận nhập?'))return;
        const lot=lookup('quality',state.selected.split(':')[1]);if(lot){lot.status='Chờ kho xác nhận nhập';appendHistory(lot,`${ROLE[getRole()]} duyệt báo cáo QC`);const plan=lookup('production',lot.plan);if(plan){plan.status='Chờ kho xác nhận nhập';appendHistory(plan,'Owner/Manager duyệt QC · chờ Kho xác nhận nhập');}}
      } else if(action==='receive-finished'){
        if(!ask('Xác nhận nhập viên nén thành phẩm','Nhập danh sách bao đã phân Kho A/Kho B vào tồn kho?'))return;
        receiveFinished();
      } else if(action==='assign-maintenance'){openModal('assign-maintenance');return;}
      else if(action==='request-material'){openModal('material-request');return;}
      else if(action==='receive-materials'){
        if(!ask('Xác nhận tiếp nhận vật tư','Xác nhận đã nhận đủ vật tư theo yêu cầu đã duyệt?'))return;
        updateSelected('incidents',r=>{r.materialsReceived=true;r.repairStatus='Đang sửa chữa';if(['Nặng','Khẩn cấp'].includes(r.severity))r.status='Đang sửa chữa';appendHistory(r,'Nhân viên bảo trì xác nhận tiếp nhận vật tư và bắt đầu sửa chữa');});
      }
      else if(action==='start-repair')updateSelected('incidents',r=>{r.repairStatus='Đang sửa chữa';if(['Nặng','Khẩn cấp'].includes(r.severity))r.status='Đang sửa chữa';appendHistory(r,'Nhân viên bảo trì bắt đầu sửa chữa');});
      else if(action==='approve-material'){
        if(!ask('Duyệt yêu cầu mua vật tư','Cho phép mua vật tư theo yêu cầu đã gửi?'))return;
        updateSelected('incidents',r=>{r.materialStatus='Đã duyệt mua';appendHistory(r,`${ROLE[getRole()]} duyệt yêu cầu mua vật tư`);});
      } else if(action==='record-material'){openModal('material-purchase');return;}
      else if(action==='repair-report'){openModal('repair-report');return;}
      else if(action==='approve-repair'){
        const r=lookup('incidents',state.selected.split(':')[1]);if(!ask('Duyệt báo cáo sửa chữa',`Sau khi duyệt, ${['Nặng','Khẩn cấp'].includes(r?.severity)?'máy đã dừng sẽ chuyển về Đang hoạt động.':'báo cáo được hoàn tất.'} Xác nhận?`))return;
        updateSelected('incidents',x=>{x.repairStatus='Đã duyệt báo cáo sửa chữa';x.repairApprovalStatus='Đã duyệt';x.status=x.postRepairState||'Đang hoạt động';appendHistory(x,`${ROLE[getRole()]} duyệt báo cáo sửa chữa${['Nặng','Khẩn cấp'].includes(x.severity)&&x.status==='Đang hoạt động'?' · máy hoạt động trở lại':''}`);});
      } else if(action==='adjust-sale'){openModal('owner-sale-adjust');return;}
      else if(action==='approve-sale'){if(!ask('Duyệt đề xuất xuất hàng','Xác nhận khách hàng và giá dự kiến đang hiển thị?'))return;approveSale();}
      else if(action==='propose-customer'){openModal('propose-customer');return;}
      else if(action==='customer-response'){openModal('customer-response');return;}
      else if(action==='pickup-info'){openModal('pickup-info');return;}
      else if(action==='verify-pickup'){openModal('verify-pickup');return;}
      else if(action==='dispatch'){
        const r=lookup('shipments',state.selected.split(':')[1]);if(!ask('Xác nhận xuất hàng thực tế',`Chỉ xác nhận sau khi đã đối chiếu đúng người nhận và biển số xe. Tồn kho sẽ giảm khi lưu thao tác này.`))return;
        openModal('dispatch-photo',{quantity:r?.quantity});return;
      } else if(action==='toggle-account'){
        if(!ask('Thay đổi tình trạng tài khoản','Xác nhận khóa hoặc mở khóa tài khoản này?',`Xác nhận ${lookup('accounts',state.selected.split(':')[1])?.active?'khóa':'mở khóa'}`,true))return;
        updateSelected('accounts',r=>{r.active=!r.active;appendHistory(r,r.active?'Admin mở khóa tài khoản':'Admin khóa tài khoản');});
      } else if(action==='toggle-directory'){
        if(getRole()!=='owner')throw new Error('Chỉ Owner được cập nhật tình trạng hợp tác.');
        const [module,id]=state.selected.split(':');const key=module==='suppliers'?'suppliers':'customers';const row=state.data[key].find(x=>x.id===id);if(!row)throw new Error('Không tìm thấy hồ sơ.');
        if(row.status!=='Ngừng hợp tác'&&hasOpenDirectoryWork(module,row))throw new Error('Chỉ có thể ngừng hợp tác khi không còn giao dịch đang xử lý hoặc công nợ chưa thanh toán/thu.');
        if(!ask(row.status==='Ngừng hợp tác'?'Kích hoạt hợp tác':'Ngừng hợp tác','Cập nhật tình trạng hồ sơ đối tác?','Xác nhận'))return;
        row.status=row.status==='Ngừng hợp tác'?'Đang hợp tác':(key==='customers'?'Ngừng hợp tác':'Ngừng hợp tác');appendHistory(row,row.status);
      }
      else if(action==='edit:incident'){openModal('incident',{edit:true});return;}
      else {notify('Thao tác chưa khả dụng ở trạng thái này.',true);return;}
      if(!saveData())return;render();notify('Đã cập nhật trạng thái phiếu.');
    }catch(err){notify(err.message||'Không thể hoàn tất thao tác.',true);}
  }
  function confirmDialog(action,title='Xác nhận thao tác',text='Bạn có chắc muốn tiếp tục?',yes='Xác nhận',danger=false){
    state.modal={type:'confirm'};openCustomModal(title,`<p class="confirm-copy">${esc(text)}</p><div class="form-actions"><button class="button" data-action="confirm-no">Hủy</button><button class="button ${danger?'button-danger':'button-primary'}" data-action="confirm-yes" data-confirm="${esc(action)}">${esc(yes)}</button></div>`);
  }
  window.BATT_PPMS={resetSampleData(){localStorage.removeItem(STORAGE);location.reload();},getCurrentRole(){return getRole();}};
  history.replaceState({role:null,userId:null},'','#/login');
  window.addEventListener('popstate',restoreRoute);
  render();
})();

